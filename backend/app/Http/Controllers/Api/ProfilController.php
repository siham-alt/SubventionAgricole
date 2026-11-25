<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfilController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'telephone' => 'sometimes|string|max:20',
            'adresse' => 'nullable|string',
            'region' => 'sometimes|string',
            'province' => 'sometimes|string',
            'commune' => 'sometimes|string',
        ]);

        $user->update($data);

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'user' => $user->load('roles'),
        ]);
    }

    public function changerMotDePasse(Request $request)
    {
        $data = $request->validate([
            'mot_de_passe_actuel' => 'required|string',
            'nouveau_mot_de_passe' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($data['mot_de_passe_actuel'], $user->password)) {
            return response()->json(['message' => 'Le mot de passe actuel est incorrect'], 422);
        }

        $user->update(['password' => $data['nouveau_mot_de_passe']]);

        return response()->json(['message' => 'Mot de passe modifié avec succès']);
    }
 public function getPreferences(Request $request)
{
    $user = $request->user();
    return response()->json([
        'notif_email_niveau' => $user->notif_email_niveau ?? 'important',
    ]);
}

public function updatePreferences(Request $request)
{
    $data = $request->validate([
        'notif_email_niveau' => 'required|in:important,tout',
    ]);

    $request->user()->update($data);

    return response()->json(['message' => 'Préférences enregistrées']);
}
public function preferences(Request $request)
{
    $data = $request->validate([
        'notifications_email' => 'required|boolean',
        'langue' => 'required|in:fr,ar',
    ]);

    $request->user()->update($data);

    return response()->json(['message' => 'Préférences mises à jour']);
}public function updatePhoto(Request $request)
{
    $data = $request->validate([
        'photo_base64' => 'required|string',
    ]);

    $user = $request->user();

    // Extraire l'extension et décoder le base64
    if (!preg_match('/^data:image\/(png|jpe?g|gif);base64,/', $data['photo_base64'], $matches)) {
        return response()->json(['message' => 'Format d\'image invalide'], 422);
    }

    $extension = $matches[1];
    $imageData = base64_decode(substr($data['photo_base64'], strpos($data['photo_base64'], ',') + 1));

    // Limite de taille (ex: 2 Mo)
    if (strlen($imageData) > 2 * 1024 * 1024) {
        return response()->json(['message' => 'L\'image ne doit pas dépasser 2 Mo'], 422);
    }

    // Supprimer l'ancienne photo si elle existe
    if ($user->photo_profil) {
        \Storage::disk('public')->delete($user->photo_profil);
    }

    $nomFichier = 'avatars/' . $user->id . '_' . time() . '.' . $extension;
    \Storage::disk('public')->put($nomFichier, $imageData);

    $user->update(['photo_profil' => $nomFichier]);

    return response()->json([
        'message' => 'Photo mise à jour',
        'user' => $user->fresh(),
    ]);
}
}