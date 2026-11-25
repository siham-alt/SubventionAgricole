<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\MessageContact;
use App\Models\NotificationInterne;
use Illuminate\Http\Request;
use App\Mail\ReponseContactMail;
use Illuminate\Support\Facades\Mail;

class MessageContactController extends Controller
{
    // Réception d'un message (route publique, visiteur non connecté)
    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'numero_dossier' => 'nullable|string|max:255',
            'sujet' => 'nullable|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        $dossier = null;
        $assigneAId = null;

        if (!empty($data['numero_dossier'])) {
            $dossier = Dossier::where('numero_dossier', $data['numero_dossier'])->first();

            if ($dossier && $dossier->agent_traitant_id) {
                $assigneAId = $dossier->agent_traitant_id;
            }
        }

        $messageContact = MessageContact::create([
            'nom' => $data['nom'],
            'email' => $data['email'],
            'numero_dossier' => $data['numero_dossier'] ?? null,
            'dossier_id' => $dossier?->id,
            'sujet' => $data['sujet'] ?? null,
            'message' => $data['message'],
            'assigne_a_id' => $assigneAId,
            'statut' => 'nouveau',
        ]);

        // Notifie l'agent concerné, sinon tous les admins
        if ($assigneAId) {
            NotificationInterne::create([
                'user_id' => $assigneAId,
                'titre' => 'Nouveau message de contact',
                'message' => 'Un message concernant le dossier ' . $data['numero_dossier'] . ' vous a été assigné.',
                'type' => 'info',
            ]);
        } else {
            $admins = \App\Models\User::whereHas('roles', fn($q) => $q->where('name', 'administrateur'))->get();
            foreach ($admins as $admin) {
                NotificationInterne::create([
                    'user_id' => $admin->id,
                    'titre' => 'Nouveau message de contact',
                    'message' => 'Message de ' . $data['nom'] . ' : ' . ($data['sujet'] ?? 'Sans sujet'),
                    'type' => 'info',
                ]);
            }
        }

        return response()->json(['message' => 'Votre message a bien été transmis.'], 201);
    }

    // Liste des messages visibles par l'utilisateur connecté
    public function index(Request $request)
    {
        $user = $request->user();

        $query = MessageContact::with(['dossier', 'assigneA'])->latest();

        if ($user->hasRole('agent')) {
            $query->where('assigne_a_id', $user->id);
        } elseif (!$user->hasRole('administrateur')) {
            abort(403, 'Accès non autorisé');
        }
        // administrateur : pas de filtre, voit tout

        return response()->json($query->paginate(20));
    }

    

public function repondre(Request $request, MessageContact $messageContact)
{
    $user = $request->user();

    if ($user->hasRole('agent') && $messageContact->assigne_a_id !== $user->id) {
        abort(403, 'Ce message ne vous est pas assigné');
    }
    if (!$user->hasAnyRole(['agent', 'administrateur'])) {
        abort(403, 'Accès non autorisé');
    }

    $data = $request->validate([
        'reponse' => 'required|string|max:5000',
    ]);

    $messageContact->update([
        'reponse' => $data['reponse'],
        'repondu_par_id' => $user->id,
        'repondu_le' => now(),
        'statut' => 'traite',
    ]);

    // Envoi de la réponse par email au visiteur
    Mail::to($messageContact->email)->send(new ReponseContactMail($messageContact->fresh()));

    return response()->json($messageContact->fresh(['dossier', 'assigneA']));
}

    // Réassigner un message (admin uniquement)
    public function reassigner(Request $request, MessageContact $messageContact)
    {
        if (!$request->user()->hasRole('administrateur')) {
            abort(403, 'Accès non autorisé');
        }

        $data = $request->validate([
            'assigne_a_id' => 'nullable|exists:users,id',
        ]);

        $messageContact->update(['assigne_a_id' => $data['assigne_a_id']]);

        if ($data['assigne_a_id']) {
            NotificationInterne::create([
                'user_id' => $data['assigne_a_id'],
                'titre' => 'Message de contact réassigné',
                'message' => 'Un message vous a été assigné par un administrateur.',
                'type' => 'info',
            ]);
        }

        return response()->json($messageContact->fresh(['dossier', 'assigneA']));
    }

    // Liste des agents disponibles pour réassignation (admin uniquement)
    public function agentsDisponibles(Request $request)
    {
        if (!$request->user()->hasRole('administrateur')) {
            abort(403);
        }

        $agents = \App\Models\User::whereHas('roles', fn($q) => $q->where('name', 'agent'))
            ->where('actif', true)
            ->get(['id', 'name']);

        return response()->json($agents);
    }
}