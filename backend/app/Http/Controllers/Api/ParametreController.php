<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Parametre;
use Illuminate\Http\Request;

class ParametreController extends Controller
{
    private array $clesAutorisees = [
        'email_contact', 'telephone_contact', 'delai_legal_traitement_jours', 'inscriptions_ouvertes',
    ];

    public function index()
    {
        $parametres = [];
        foreach ($this->clesAutorisees as $cle) {
            $parametres[$cle] = Parametre::get($cle);
        }
        return response()->json($parametres);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'email_contact' => 'nullable|email',
            'telephone_contact' => 'nullable|string',
            'delai_legal_traitement_jours' => 'nullable|integer|min:1',
            'inscriptions_ouvertes' => 'nullable|boolean',
        ]);

        foreach ($data as $cle => $valeur) {
            Parametre::set($cle, $valeur);
        }

        return response()->json(['message' => 'Paramètres mis à jour avec succès']);
    }
}