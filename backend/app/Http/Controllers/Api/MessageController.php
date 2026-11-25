<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\Message;
use App\Models\NotificationInterne;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request, Dossier $dossier)
    {
        $this->authorizeAccess($request, $dossier);

        $messages = $dossier->messages()->with('expediteur')->orderBy('created_at')->get();

        // Marque comme lus les messages destinés à l'utilisateur courant
        $dossier->messages()
            ->where('destinataire_id', $request->user()->id)
            ->where('lu', false)
            ->update(['lu' => true]);

        return response()->json($messages);
    }

    public function store(Request $request, Dossier $dossier)
    {
        $this->authorizeAccess($request, $dossier);

        $data = $request->validate([
            'contenu' => 'required|string',
        ]);

        // Détermine le destinataire : si l'expéditeur est l'agriculteur, le destinataire est l'agent traitant (ou null si pas encore assigné)
        // si l'expéditeur est l'agent, le destinataire est l'agriculteur (user_id du dossier)
        $expediteur = $request->user();
        $destinataireId = $expediteur->id === $dossier->user_id
            ? ($dossier->agent_traitant_id ?? $dossier->user_id)
            : $dossier->user_id;

        $message = Message::create([
            'dossier_id' => $dossier->id,
            'expediteur_id' => $expediteur->id,
            'destinataire_id' => $destinataireId,
            'contenu' => $data['contenu'],
        ]);

        NotificationInterne::create([
            'user_id' => $destinataireId,
            'dossier_id' => $dossier->id,
            'titre' => 'Nouveau message',
            'message' => 'Vous avez reçu un nouveau message concernant le dossier ' . $dossier->numero_dossier,
            'type' => 'info',
        ]);

        return response()->json([
            'message' => $message->load('expediteur'),
        ], 201);
    }

    private function authorizeAccess(Request $request, Dossier $dossier): void
    {
        $user = $request->user();
        if ($user->hasRole('agriculteur') && $dossier->user_id !== $user->id) {
            abort(403, 'Accès non autorisé');
        }
    }
}