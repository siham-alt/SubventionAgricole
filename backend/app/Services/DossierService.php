<?php
namespace App\Services;

use App\Models\Dossier;
use App\Models\DossierHistorique;
use App\Models\NotificationInterne;
use Illuminate\Support\Facades\Auth;

class DossierService
{
    public function documentsComplets(Dossier $dossier): array
    {
        $requis = $dossier->typeSubvention->documents_requis ?? [];
        $fournis = $dossier->documents()->pluck('type_document')->unique()->toArray();

        $manquants = array_diff($requis, $fournis);

        return [
            'complet' => empty($manquants),
            'manquants' => array_values($manquants),
        ];
    }

    public function changerStatut(Dossier $dossier, string $nouveauStatut, ?string $commentaire = null): Dossier
    {
        $ancienStatut = $dossier->statut;

        $dossier->update(['statut' => $nouveauStatut]);

        DossierHistorique::create([
            'dossier_id' => $dossier->id,
            'user_id' => Auth::id(),
            'action' => 'changement_statut',
            'statut_avant' => $ancienStatut,
            'statut_apres' => $nouveauStatut,
            'commentaire' => $commentaire,
        ]);

        $this->notifierAgriculteur($dossier, $nouveauStatut, $commentaire);

        return $dossier->fresh();
    }

 private function notifierAgriculteur(Dossier $dossier, string $statut, ?string $commentaire): void
{
    $messages = [
        'soumis' => 'Votre dossier a été soumis avec succès.',
        'en_cours_verification' => 'Votre dossier est en cours de vérification.',
        'complement_demande' => 'Un complément d\'information est demandé pour votre dossier.',
        'en_validation_agent' => 'Votre dossier est en cours de validation par un agent.',
        'approuve' => 'Félicitations ! Votre dossier a été approuvé.',
        'refuse' => 'Votre dossier a été refusé.',
        'paye' => 'La subvention a été versée.',
    ];

    NotificationInterne::create([
        'user_id' => $dossier->user_id,
        'dossier_id' => $dossier->id,
        'titre' => 'Mise à jour de votre dossier ' . $dossier->numero_dossier,
        'message' => $messages[$statut] ?? 'Le statut de votre dossier a changé.',
        'type' => in_array($statut, ['approuve', 'paye']) ? 'success' : (in_array($statut, ['refuse']) ? 'danger' : 'info'),
    ]);

    // Envoi d'email uniquement pour les événements "importants"
    $evenementsImportants = ['soumis', 'complement_demande', 'approuve', 'refuse'];
    $user = $dossier->user;

    $doitEnvoyerEmail = in_array($statut, $evenementsImportants)
        || $user->notif_email_niveau === 'tout';

    if ($doitEnvoyerEmail && $user->email) {
        // On implémentera l'envoi réel avec Mailable dans une prochaine étape si besoin
        // Mail::to($user->email)->send(new DossierStatutChange($dossier, $statut));
    }
}
}