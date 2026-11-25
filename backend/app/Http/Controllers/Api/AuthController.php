<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    // Inscription (toujours agriculteur par défaut)
    public function register(RegisterRequest $request)
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);
        $user->assignRole('agriculteur');

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Inscription réussie',
            'user' => $user->load('roles'),
            'token' => $token,
        ], 201);
    }

    // Connexion
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Identifiants incorrects'
            ], 401);
        }

        $user = User::where('email', $credentials['email'])->firstOrFail();

        if (!$user->actif) {
            return response()->json([
                'message' => 'Ce compte a été désactivé'
            ], 403);
        }

        $user->update(['derniere_connexion' => now()]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => $user->load('roles'),
            'token' => $token,
        ]);
    }

    // Déconnexion
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie'
        ]);
    }

    // Utilisateur connecté
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()->load('roles', 'exploitations'),
        ]);
    }
}