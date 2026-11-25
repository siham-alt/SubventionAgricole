<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NotificationInterne;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = NotificationInterne::where('user_id', $request->user()->id)
            ->latest()
            ->paginate(20);

        return response()->json($notifications);
    }

    public function nonLues(Request $request)
    {
        $count = NotificationInterne::where('user_id', $request->user()->id)
            ->where('lu', false)
            ->count();

        return response()->json(['count' => $count]);
    }

    public function marquerLu(Request $request, NotificationInterne $notification)
    {
        if ($notification->user_id !== $request->user()->id) {
            abort(403);
        }

        $notification->update(['lu' => true]);

        return response()->json(['message' => 'Notification marquée comme lue']);
    }

    public function marquerToutesLues(Request $request)
    {
        NotificationInterne::where('user_id', $request->user()->id)
            ->where('lu', false)
            ->update(['lu' => true]);

        return response()->json(['message' => 'Toutes les notifications ont été marquées comme lues']);
    }
    public function envoyerGlobale(Request $request)
{
    $data = $request->validate([
        'titre' => 'required|string',
        'message' => 'required|string',
        'type' => 'required|in:info,success,warning,danger',
        'cible' => 'required|in:tous,agriculteurs,agents',
    ]);

    $query = \App\Models\User::query();

    if ($data['cible'] === 'agriculteurs') {
        $query->whereHas('roles', fn($q) => $q->where('name', 'agriculteur'));
    } elseif ($data['cible'] === 'agents') {
        $query->whereHas('roles', fn($q) => $q->where('name', 'agent'));
    }

    $utilisateurs = $query->get();

    foreach ($utilisateurs as $user) {
        \App\Models\NotificationInterne::create([
            'user_id' => $user->id,
            'titre' => $data['titre'],
            'message' => $data['message'],
            'type' => $data['type'],
        ]);
    }

    return response()->json([
        'message' => 'Notification envoyée à ' . $utilisateurs->count() . ' utilisateur(s)',
    ]);
}

public function historiqueEnvois(Request $request)
{
    $notifications = \App\Models\NotificationInterne::select('titre', 'message', 'type', 'created_at')
        ->distinct()
        ->orderByDesc('created_at')
        ->limit(30)
        ->get();

    return response()->json($notifications);
}
}