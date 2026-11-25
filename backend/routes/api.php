<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ExploitationController;
use App\Http\Controllers\Api\TypeSubventionController;
use App\Http\Controllers\Api\DossierController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ProfilController;
use App\Http\Controllers\Api\StatistiqueController;
use App\Http\Controllers\Api\UtilisateurController;
use App\Http\Controllers\Api\RegionController;
use App\Http\Controllers\Api\RapportController;
use App\Http\Controllers\Api\MessageController;
 use App\Http\Controllers\Api\ParametreController;
 
use App\Http\Controllers\Api\MessageContactController; 
// Route publique — accessible sans authentification, c'est le point d'entrée du formulaire Contact
Route::post('/contact', [MessageContactController::class, 'store']);Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

    Route::get('/types-subvention', [TypeSubventionController::class, 'index']);
    Route::get('/types-subvention/{typeSubvention}', [TypeSubventionController::class, 'show']);
Route::middleware('auth:sanctum')->group(function () {
Route::post('/profil/photo', [ProfilController::class, 'updatePhoto']);
Route::get('/profil/preferences', [ProfilController::class, 'getPreferences']);
Route::put('/profil/preferences', [ProfilController::class, 'updatePreferences']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::apiResource('exploitations', ExploitationController::class);


    Route::middleware('role:administrateur')->group(function () {
        Route::post('/types-subvention', [TypeSubventionController::class, 'store']);
        Route::put('/types-subvention/{typeSubvention}', [TypeSubventionController::class, 'update']);
        Route::delete('/types-subvention/{typeSubvention}', [TypeSubventionController::class, 'destroy']);
    Route::get('/statistiques/par-agent', [StatistiqueController::class, 'statsParAgent']);
        });

    // Dossiers
    Route::get('/dossiers', [DossierController::class, 'index']);
    Route::post('/dossiers', [DossierController::class, 'store']);
    Route::get('/dossiers/{dossier}', [DossierController::class, 'show']);
    Route::post('/dossiers/{dossier}/soumettre', [DossierController::class, 'soumettre']);
    Route::post('/dossiers/{dossier}/statut', [DossierController::class, 'changerStatut']);
    Route::post('/documents/{document}/remplacer', [DocumentController::class, 'remplacer']);
    // Documents
    Route::get('/dossiers/{dossier}/documents', [DocumentController::class, 'index']);
    Route::post('/dossiers/{dossier}/documents', [DocumentController::class, 'store']);
    Route::post('/documents/{document}/verifier', [DocumentController::class, 'verifier']);
    Route::delete('/documents/{document}', [DocumentController::class, 'destroy']);

    // Messages
    Route::get('/dossiers/{dossier}/messages', [MessageController::class, 'index']);
    Route::post('/dossiers/{dossier}/messages', [MessageController::class, 'store']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/non-lues', [NotificationController::class, 'nonLues']);
    Route::post('/notifications/{notification}/lu', [NotificationController::class, 'marquerLu']);
    Route::post('/notifications/tout-lire', [NotificationController::class, 'marquerToutesLues']);

    // Profil
    Route::put('/profil', [ProfilController::class, 'update']);
    Route::post('/profil/mot-de-passe', [ProfilController::class, 'changerMotDePasse']);

    // Statistiques
    Route::middleware('role:agent,administrateur')->group(function () {
        Route::get('/statistiques/agent', [StatistiqueController::class, 'agentDashboard']);
        Route::get('/statistiques/agent-personnel', [StatistiqueController::class, 'agentPersonnel']);
     Route::get('/messages-contact', [MessageContactController::class, 'index']);
    Route::post('/messages-contact/{messageContact}/repondre', [MessageContactController::class, 'repondre']);

        });

    Route::middleware('role:administrateur')->group(function () {
        Route::get('/statistiques/admin', [StatistiqueController::class, 'adminDashboard']);
     Route::post('/messages-contact/{messageContact}/reassigner', [MessageContactController::class, 'reassigner']);
    Route::get('/agents-disponibles', [MessageContactController::class, 'agentsDisponibles']);

        });

    // Utilisateurs (admin uniquement)
    Route::middleware('role:administrateur')->group(function () {
        Route::get('/utilisateurs-stats', [UtilisateurController::class, 'stats']);
        Route::get('/agents-stats', [UtilisateurController::class, 'agentsAvecStats']);
        Route::apiResource('utilisateurs', UtilisateurController::class);
        Route::post('/utilisateurs/{user}/toggle-actif', [UtilisateurController::class, 'toggleActif']);

        Route::get('/regions', [RegionController::class, 'index']);
        Route::post('/regions', [RegionController::class, 'store']);
        Route::delete('/regions/{region}', [RegionController::class, 'destroy']);

        Route::post('/notifications/envoyer-globale', [NotificationController::class, 'envoyerGlobale']);
        Route::get('/notifications/historique-envois', [NotificationController::class, 'historiqueEnvois']);

        Route::get('/rapports/excel', [RapportController::class, 'exporterExcel']);
        Route::get('/rapports/pdf', [RapportController::class, 'exporterPdf']);

Route::get('/parametres', [ParametreController::class, 'index']);
Route::put('/parametres', [ParametreController::class, 'update']);
        });

}); // fin du groupe auth:sanctum