<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDossierRequest;
use App\Models\Dossier;
use App\Models\DossierHistorique;
use App\Services\DossierService;
use Illuminate\Http\Request;

class DossierController extends Controller
{
    public function __construct(private DossierService $dossierService) {}

  public function index(Request $request)
{
    $user = $request->user();
$query = Dossier::with(['exploitation', 'typeSubvention', 'user', 'agentTraitant', 'documents']);
    if ($user->hasRole('agriculteur')) {
        $query->where('user_id', $user->id);
    } elseif ($user->hasRole('agent')) {
        if ($request->query('vue') === 'historique') {
            // Dossiers que CET agent a traités et qui sont clos
            $query->where('agent_traitant_id', $user->id)
                  ->whereIn('statut', ['approuve', 'refuse', 'paye']);
       } else {
    // Vue par défaut : pool (non affecté) + mes dossiers en cours
    $query->where(function ($q) use ($user) {
        $q->whereNull('agent_traitant_id')
          ->orWhere('agent_traitant_id', $user->id);
    })->whereIn('statut', ['soumis', 'en_cours_verification', 'complement_demande', 'en_validation_agent']);
}
    }
    // administrateur : voit tout, sans filtre

    if ($request->has('statut')) {
        $query->where('statut', $request->statut);
    }
    if ($request->has('recherche')) {
        $query->where('numero_dossier', 'like', '%' . $request->recherche . '%');
    }
    if ($request->has('agent_id')) {
        $query->where('agent_traitant_id', $request->agent_id);
    }

    return response()->json($query->latest()->paginate(15));
}

    public function store(StoreDossierRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;
        $data['statut'] = 'brouillon';

        $dossier = Dossier::create($data);

        DossierHistorique::create([
            'dossier_id' => $dossier->id,
            'user_id' => $request->user()->id,
            'action' => 'creation',
            'statut_apres' => 'brouillon',
        ]);

        return response()->json([
            'message' => 'Dossier créé en brouillon',
            'dossier' => $dossier->load('exploitation', 'typeSubvention'),
        ], 201);
    }

    public function show(Request $request, Dossier $dossier)
    {
        $this->authorizeAccess($request, $dossier);

        $dossier->load([
            'exploitation', 'typeSubvention', 'user',
            'documents', 'historique.user', 'agentTraitant'
        ]);

        $verification = $this->dossierService->documentsComplets($dossier);
// Dans DossierController::show(), après le chargement des relations
$dossier->documents->each(function ($doc) use ($dossier) {
    $media = $dossier->media()->find($doc->media_id);
    $doc->url = $media?->getUrl();
});
        return response()->json([
            'dossier' => $dossier,
            'documents_verification' => $verification,
        ]);
    }


    public function soumettre(Request $request, Dossier $dossier)
    {
        $this->authorizeAccess($request, $dossier);

        if ($dossier->statut !== 'brouillon') {
            return response()->json(['message' => 'Ce dossier ne peut plus être soumis'], 422);
        }

        $verification = $this->dossierService->documentsComplets($dossier);
        if (!$verification['complet']) {
            return response()->json([
                'message' => 'Documents manquants',
                'documents_manquants' => $verification['manquants'],
            ], 422);
        }

        $dossier->update(['date_soumission' => now()]);
        $dossier = $this->dossierService->changerStatut($dossier, 'soumis', 'Dossier soumis par l\'agriculteur');

        return response()->json([
            'message' => 'Dossier soumis avec succès',
            'dossier' => $dossier,
        ]);
    }
public function changerStatut(Request $request, Dossier $dossier)
{
    if (!$request->user()->hasAnyRole(['agent', 'administrateur'])) {
        abort(403, 'Action non autorisée');
    }

    // Un agent ne peut agir que sur un dossier libre ou déjà affecté à lui-même
    if ($request->user()->hasRole('agent')
        && $dossier->agent_traitant_id
        && $dossier->agent_traitant_id !== $request->user()->id) {
        abort(403, 'Ce dossier est déjà pris en charge par un autre agent.');
    }

    $data = $request->validate([
        'statut' => 'required|in:en_cours_verification,complement_demande,en_validation_agent,approuve,refuse,paye',
        'commentaire' => 'required_if:statut,refuse,complement_demande|nullable|string',
        'montant_accorde' => 'nullable|numeric',
    ]);

    // Affectation atomique lors de la première prise en charge
    if (!$dossier->agent_traitant_id) {
        $affecte = Dossier::where('id', $dossier->id)
            ->whereNull('agent_traitant_id')
            ->update(['agent_traitant_id' => $request->user()->id]);

        if (!$affecte) {
            return response()->json([
                'message' => "Ce dossier vient d'être pris en charge par un autre agent."
            ], 409);
        }
        $dossier->refresh();
    }

    if (isset($data['montant_accorde'])) {
        $dossier->update(['montant_accorde' => $data['montant_accorde']]);
    }

    if ($data['statut'] === 'refuse') {
        $dossier->update(['motif_refus' => $data['commentaire']]);
    }

    if (in_array($data['statut'], ['approuve', 'refuse'])) {
        $dossier->update(['date_validation' => now(), 'valide_par_id' => $request->user()->id]);
    }

    $dossier = $this->dossierService->changerStatut($dossier, $data['statut'], $data['commentaire'] ?? null);

    return response()->json(['message' => 'Statut mis à jour', 'dossier' => $dossier]);
}

    private function authorizeAccess(Request $request, Dossier $dossier): void
    {
        $user = $request->user();
        if ($user->hasRole('agriculteur') && $dossier->user_id !== $user->id) {
            abort(403, 'Accès non autorisé à ce dossier');
        }
    }
}