<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatistiqueController extends Controller
{
    // Statistiques pour le dashboard Agent
  public function agentDashboard(Request $request)
{
    $agentId = $request->user()->id;

    $aujourdHui = Dossier::whereDate('created_at', today())->count();

    $aTraiter = Dossier::whereIn('statut', [
        'soumis', 'en_cours_verification', 'complement_demande', 'en_validation_agent'
    ])->count();

    $validees = Dossier::whereIn('statut', ['approuve', 'paye'])->count();
    $rejetees = Dossier::where('statut', 'refuse')->count();

    $parStatut = Dossier::select('statut', DB::raw('count(*) as total'))
        ->groupBy('statut')
        ->get();

    $evolution7Jours = Dossier::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('count(*) as total')
        )
        ->where('created_at', '>=', now()->subDays(7))
        ->groupBy('date')
        ->orderBy('date')
        ->get();

    // ← AJOUT : délai moyen de traitement (tous agents confondus, vue d'équipe)
    $delaiMoyen = Dossier::whereNotNull('date_validation')
        ->whereNotNull('date_soumission')
        ->get()
        ->avg(fn($d) => $d->date_soumission->diffInDays($d->date_validation));

    // ← AJOUT : dossiers les plus urgents (en attente depuis le plus longtemps)
    $dossiersPrioritaires = Dossier::with(['user', 'typeSubvention'])
        ->whereIn('statut', ['soumis', 'en_cours_verification', 'en_validation_agent'])
        ->orderBy('date_soumission', 'asc')
        ->limit(5)
        ->get();

    return response()->json([
        'aujourd_hui' => $aujourdHui,
        'a_traiter' => $aTraiter,
        'validees' => $validees,
        'rejetees' => $rejetees,
        'par_statut' => $parStatut,
        'evolution_7_jours' => $evolution7Jours,
        'delai_moyen_jours' => round($delaiMoyen ?? 0, 1),
        'dossiers_prioritaires' => $dossiersPrioritaires,
    ]);
}

    // Statistiques décisionnelles pour l'admin/responsable
    public function adminDashboard(Request $request)
    {
        $totalDemandes = Dossier::count();
        $totalValidees = Dossier::whereIn('statut', ['approuve', 'paye'])->count();
        $totalRefusees = Dossier::where('statut', 'refuse')->count();

        $tauxAcceptation = $totalDemandes > 0
            ? round(($totalValidees / $totalDemandes) * 100, 1)
            : 0;

        $montantTotalAccorde = Dossier::whereNotNull('montant_accorde')->sum('montant_accorde');

        // Délai moyen de traitement (en jours) pour les dossiers validés/refusés
        $delaiMoyen = Dossier::whereNotNull('date_validation')
            ->whereNotNull('date_soumission')
            ->get()
            ->avg(function ($d) {
                return $d->date_soumission->diffInDays($d->date_validation);
            });

        // Répartition par région
        $parRegion = Dossier::join('exploitations_agricoles', 'dossiers.exploitation_id', '=', 'exploitations_agricoles.id')
            ->select('exploitations_agricoles.region', DB::raw('count(*) as total'))
            ->groupBy('exploitations_agricoles.region')
            ->get();

        // Répartition par type de subvention
        $parType = Dossier::join('types_subvention', 'dossiers.type_subvention_id', '=', 'types_subvention.id')
            ->select('types_subvention.nom_fr', DB::raw('count(*) as total'))
            ->groupBy('types_subvention.nom_fr')
            ->get();

        // Demandes par mois (12 derniers mois)
        $parMois = Dossier::select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as mois"),
                DB::raw('count(*) as total')
            )
            ->where('created_at', '>=', now()->subMonths(12))
            ->groupBy('mois')
            ->orderBy('mois')
            ->get();

        return response()->json([
            'total_demandes' => $totalDemandes,
            'total_validees' => $totalValidees,
            'total_refusees' => $totalRefusees,
            'taux_acceptation' => $tauxAcceptation,
            'montant_total_accorde' => $montantTotalAccorde,
            'delai_moyen_jours' => round($delaiMoyen ?? 0, 1),
            'par_region' => $parRegion,
            'par_type' => $parType,
            'par_mois' => $parMois,
        ]);
    }
    public function agentPersonnel(Request $request)
{
    $agentId = $request->user()->id;

    $dossiersTraites = Dossier::where('agent_traitant_id', $agentId)->count();

    $dossiersEnCours = Dossier::where('agent_traitant_id', $agentId)
        ->whereIn('statut', ['en_cours_verification', 'en_validation_agent', 'complement_demande'])
        ->count();

    $dossiersApprouves = Dossier::where('agent_traitant_id', $agentId)
        ->whereIn('statut', ['approuve', 'paye'])
        ->count();

    $dossiersRefuses = Dossier::where('agent_traitant_id', $agentId)
        ->where('statut', 'refuse')
        ->count();

    $delaiMoyen = Dossier::where('agent_traitant_id', $agentId)
        ->whereNotNull('date_validation')
        ->whereNotNull('date_soumission')
        ->get()
        ->avg(fn($d) => $d->date_soumission->diffInDays($d->date_validation));

    // Dossiers en attente depuis le plus longtemps (priorité)
    $dossiersPrioritaires = Dossier::with(['user', 'typeSubvention'])
        ->whereIn('statut', ['soumis', 'en_cours_verification', 'en_validation_agent'])
        ->orderBy('date_soumission', 'asc')
        ->limit(5)
        ->get();

    // Répartition des dossiers traités par statut
    $parStatut = Dossier::where('agent_traitant_id', $agentId)
        ->select('statut', DB::raw('count(*) as total'))
        ->groupBy('statut')
        ->get();

    // Activité des 7 derniers jours (dossiers traités par cet agent)
    $activite7Jours = \App\Models\DossierHistorique::where('user_id', $agentId)
        ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as total'))
        ->where('created_at', '>=', now()->subDays(7))
        ->groupBy('date')
        ->orderBy('date')
        ->get();

    return response()->json([
        'dossiers_traites' => $dossiersTraites,
        'dossiers_en_cours' => $dossiersEnCours,
        'dossiers_approuves' => $dossiersApprouves,
        'dossiers_refuses' => $dossiersRefuses,
        'delai_moyen_jours' => round($delaiMoyen ?? 0, 1),
        'dossiers_prioritaires' => $dossiersPrioritaires,
        'par_statut' => $parStatut,
        'activite_7_jours' => $activite7Jours,
    ]);
}
public function statsParAgent(Request $request)
{
    if (!$request->user()->hasRole('administrateur')) {
        abort(403);
    }

    $agents = \App\Models\User::whereHas('roles', fn($q) => $q->where('name', 'agent'))->get();

    $stats = $agents->map(function ($agent) {
        $traites = Dossier::where('agent_traitant_id', $agent->id)->count();
        $enCours = Dossier::where('agent_traitant_id', $agent->id)
            ->whereIn('statut', ['en_cours_verification', 'en_validation_agent', 'complement_demande'])
            ->count();
        $approuves = Dossier::where('agent_traitant_id', $agent->id)->where('statut', 'approuve')->count();
        $refuses = Dossier::where('agent_traitant_id', $agent->id)->where('statut', 'refuse')->count();

        $delaiMoyen = Dossier::where('agent_traitant_id', $agent->id)
            ->whereNotNull('date_validation')
            ->whereNotNull('date_soumission')
            ->get()
            ->filter(fn($d) => $d->date_soumission && $d->date_validation)
            ->avg(fn($d) => $d->date_soumission->diffInDays($d->date_validation));

        return [
            'id' => $agent->id,
            'name' => $agent->name,
            'actif' => $agent->actif,
            'dossiers_traites' => $traites,
            'dossiers_en_cours' => $enCours,
            'dossiers_approuves' => $approuves,
            'dossiers_refuses' => $refuses,
            'delai_moyen_jours' => round($delaiMoyen ?? 0, 1),
        ];
    });

    return response()->json($stats->sortByDesc('dossiers_en_cours')->values());
}
}