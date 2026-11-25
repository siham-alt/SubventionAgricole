<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UploadDocumentRequest;
use App\Models\Dossier;
use App\Models\Document;
use App\Models\DossierHistorique;
use App\Services\DossierService;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    private function validerEtExtraireMime(string $base64): array
    {
        if (!preg_match('/^data:([\w\-\/\.\+]+);base64,/i', $base64, $matches)) {
            return [false, null, 'Format de fichier invalide (encodage incorrect)'];
        }

        $mimeDetecte = strtolower($matches[1]);
        $mimesAutorises = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

        if (!in_array($mimeDetecte, $mimesAutorises)) {
            return [false, $mimeDetecte, "Le fichier doit être un PDF, JPG ou PNG (type détecté : $mimeDetecte)"];
        }

        return [true, $mimeDetecte, null];
    }

    public function store(UploadDocumentRequest $request, Dossier $dossier)
    {
        $this->authorizeAccess($request, $dossier);

        $data = $request->validated();

        $tailleApprox = strlen($data['fichier_base64']) * 0.75;
        if ($tailleApprox > 10 * 1024 * 1024) {
            return response()->json(['message' => 'Le fichier ne doit pas dépasser 10 Mo'], 422);
        }

        [$valide, $mime, $erreur] = $this->validerEtExtraireMime($data['fichier_base64']);
        if (!$valide) {
            return response()->json(['message' => $erreur], 422);
        }

        $versionPrecedente = Document::where('dossier_id', $dossier->id)
            ->where('type_document', $data['type_document'])
            ->max('version') ?? 0;

        $media = $dossier->addMediaFromBase64($data['fichier_base64'])
            ->usingFileName($data['nom_fichier'])
            ->toMediaCollection($data['type_document']);

        $document = Document::create([
            'dossier_id' => $dossier->id,
            'media_id' => $media->id,
            'type_document' => $data['type_document'],
            'nom_original' => $data['nom_fichier'],
            'chemin_fichier' => $media->getPath(),
            'mime_type' => $media->mime_type,
            'taille' => $media->size,
            'version' => $versionPrecedente + 1,
            'statut_verification' => 'en_attente',
        ]);

        DossierHistorique::create([
            'dossier_id' => $dossier->id,
            'user_id' => $request->user()->id,
            'action' => 'ajout_document',
            'commentaire' => 'Document ajouté : ' . $data['type_document'],
        ]);

        return response()->json([
            'message' => 'Document téléversé avec succès',
            'document' => $document,
            'url' => $media->getUrl(),
        ], 201);
    }

    public function index(Request $request, Dossier $dossier)
    {
        $this->authorizeAccess($request, $dossier);

        $documents = $dossier->documents()->with('verifiePar')->get()->map(function ($doc) use ($dossier) {
            $media = $dossier->media()->find($doc->media_id);
            $doc->url = $media?->getUrl();
            return $doc;
        });

        return response()->json($documents);
    }

 public function verifier(Request $request, Document $document)
{
    if (!$request->user()->hasAnyRole(['agent', 'administrateur'])) {
        abort(403, 'Action non autorisée');
    }

    $dossier = $document->dossier;

    // Garde-fou : le dossier doit avoir démarré sa vérification
    if ($dossier->statut === 'soumis') {
        return response()->json([
            'message' => 'Démarrez la vérification du dossier avant d\'agir sur les documents.'
        ], 422);
    }

    $data = $request->validate([
        'statut_verification' => 'required|in:valide,refuse',
        'commentaire_agent' => 'required_if:statut_verification,refuse|nullable|string',
    ]);

    $document->update([
        'statut_verification' => $data['statut_verification'],
        'commentaire_agent' => $data['commentaire_agent'] ?? null,
        'verifie_par_id' => $request->user()->id,
        'date_verification' => now(),
    ]);

    // Refus d'un document → passage automatique du dossier en complément demandé
    if ($data['statut_verification'] === 'refuse' && $dossier->statut !== 'complement_demande') {
        app(DossierService::class)->changerStatut(
            $dossier,
            'complement_demande',
            'Document refusé : ' . $data['commentaire_agent']
        );
    }

    return response()->json([
        'message' => 'Document vérifié',
        'document' => $document->fresh(),
    ]);
}

    public function remplacer(Request $request, Document $document)
    {
        $dossier = $document->dossier;
        $this->authorizeAccess($request, $dossier);

        $data = $request->validate([
            'fichier_base64' => 'required|string',
            'nom_fichier' => 'required|string',
        ]);

        $tailleApprox = strlen($data['fichier_base64']) * 0.75;
        if ($tailleApprox > 10 * 1024 * 1024) {
            return response()->json(['message' => 'Le fichier ne doit pas dépasser 10 Mo'], 422);
        }

        [$valide, $mime, $erreur] = $this->validerEtExtraireMime($data['fichier_base64']);
        if (!$valide) {
            return response()->json(['message' => $erreur], 422);
        }

        // Supprime l'ancien média physique
        $dossier->media()->where('id', $document->media_id)->first()?->delete();

        // Upload du nouveau fichier
        $media = $dossier->addMediaFromBase64($data['fichier_base64'])
            ->usingFileName($data['nom_fichier'])
            ->toMediaCollection($document->type_document);

        $document->update([
            'media_id' => $media->id,
            'nom_original' => $data['nom_fichier'],
            'chemin_fichier' => $media->getPath(),
            'mime_type' => $media->mime_type,
            'taille' => $media->size,
            'version' => $document->version + 1,
            'statut_verification' => 'en_attente',
            'commentaire_agent' => null,
            'verifie_par_id' => null,
            'date_verification' => null,
        ]);

        DossierHistorique::create([
            'dossier_id' => $dossier->id,
            'user_id' => $request->user()->id,
            'action' => 'remplacement_document',
            'commentaire' => 'Document renvoyé : ' . $document->type_document,
        ]);

        // Si tous les documents refusés ont été renvoyés, repasse le dossier en vérification
      // Si tous les documents refusés ont été renvoyés, signale à l'agent qu'il doit revérifier
$documentsEnAttenteRefus = $dossier->documents()->where('statut_verification', 'refuse')->count();
if ($documentsEnAttenteRefus === 0 && $dossier->statut === 'complement_demande') {
    app(DossierService::class)->changerStatut(
        $dossier,
        'en_attente_agent',
        'Documents renvoyés par l\'agriculteur, en attente de revérification'
    );
}

        return response()->json([
            'message' => 'Document renvoyé avec succès',
            'document' => $document->fresh(),
        ]);
    }

    public function destroy(Request $request, Document $document)
    {
        $dossier = $document->dossier;
        $this->authorizeAccess($request, $dossier);

        if ($dossier->statut !== 'brouillon') {
            return response()->json(['message' => 'Impossible de supprimer un document après soumission'], 422);
        }

        $dossier->media()->where('id', $document->media_id)->first()?->delete();
        $document->delete();

        return response()->json(['message' => 'Document supprimé']);
    }

    private function authorizeAccess(Request $request, Dossier $dossier): void
    {
        $user = $request->user();
        if ($user->hasRole('agriculteur') && $dossier->user_id !== $user->id) {
            abort(403, 'Accès non autorisé');
        }
    }
}