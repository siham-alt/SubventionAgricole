<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UtilisateurController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('roles');

        if ($request->has('role')) {
            $query->whereHas('roles', fn($q) => $q->where('name', $request->role));
        }

        if ($request->has('recherche')) {
            $q = $request->recherche;
            $query->where(function ($query) use ($q) {
                $query->where('name', 'like', "%$q%")
                      ->orWhere('email', 'like', "%$q%");
            });
        }

        return response()->json($query->latest()->paginate(15));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:agent,responsable,administrateur,agriculteur',
            'telephone' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'telephone' => $data['telephone'] ?? null,
        ]);

        $user->assignRole($data['role']);

        return response()->json([
            'message' => 'Utilisateur créé avec succès',
            'user' => $user->load('roles'),
        ], 201);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'telephone' => 'nullable|string',
            'role' => 'sometimes|in:agent,responsable,administrateur,agriculteur',
            'actif' => 'sometimes|boolean',
        ]);

        $user->update(collect($data)->except('role')->toArray());

        if (isset($data['role'])) {
            $user->syncRoles([$data['role']]);
        }

        return response()->json([
            'message' => 'Utilisateur mis à jour',
            'user' => $user->load('roles'),
        ]);
    }

    public function toggleActif(User $user)
    {
        $user->update(['actif' => !$user->actif]);

        return response()->json([
            'message' => $user->actif ? 'Compte activé' : 'Compte désactivé',
            'user' => $user,
        ]);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé']);
    }

    public function stats()
{
    return response()->json([
        'total' => User::count(),
        'agriculteurs' => User::whereHas('roles', fn($q) => $q->where('name', 'agriculteur'))->count(),
        'agents' => User::whereHas('roles', fn($q) => $q->where('name', 'agent'))->count(),
        'responsables' => User::whereHas('roles', fn($q) => $q->where('name', 'responsable'))->count(),
        'actifs' => User::where('actif', true)->count(),
        'inactifs' => User::where('actif', false)->count(),
    ]);
}

public function show(User $user)
{
    $user->load('roles', 'dossiers.typeSubvention');
    return response()->json($user);
}
public function agentsAvecStats()
{
    $agents = User::whereHas('roles', fn($q) => $q->where('name', 'agent'))
        ->withCount(['dossiers as dossiers_traites' => function ($q) {
            $q->whereNotNull('agent_traitant_id');
        }])
        ->with('roles')
        ->get();

    // Correction : compter via agent_traitant_id, pas la relation user_id
    $agents = $agents->map(function ($agent) {
        $agent->dossiers_traites = \App\Models\Dossier::where('agent_traitant_id', $agent->id)->count();
        $agent->dossiers_en_cours = \App\Models\Dossier::where('agent_traitant_id', $agent->id)
            ->whereIn('statut', ['en_cours_verification', 'en_validation_agent', 'complement_demande'])
            ->count();
        return $agent;
    });

    return response()->json($agents);
}

}