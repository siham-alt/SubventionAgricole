<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TypeSubvention;
use Illuminate\Http\Request;

class TypeSubventionController extends Controller
{
    public function index()
    {
        $types = TypeSubvention::where('actif', true)->get();
        return response()->json($types);
    }

    public function show(TypeSubvention $typeSubvention)
    {
        return response()->json($typeSubvention);
    }

    // Réservé admin/responsable pour la gestion
    public function store(Request $request)
    {
        $data = $request->validate([
            'nom_fr' => 'required|string',
            'nom_ar' => 'nullable|string',
            'description_fr' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'montant_max' => 'nullable|numeric',
            'taux_subvention' => 'nullable|numeric|max:100',
            'documents_requis' => 'nullable|array',
        ]);

        $type = TypeSubvention::create($data);
        return response()->json($type, 201);
    }

    public function update(Request $request, TypeSubvention $typeSubvention)
    {
        $data = $request->validate([
            'nom_fr' => 'sometimes|string',
            'nom_ar' => 'nullable|string',
            'description_fr' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'montant_max' => 'nullable|numeric',
            'taux_subvention' => 'nullable|numeric|max:100',
            'documents_requis' => 'nullable|array',
            'actif' => 'sometimes|boolean',
        ]);

        $typeSubvention->update($data);
        return response()->json($typeSubvention);
    }

    public function destroy(TypeSubvention $typeSubvention)
    {
        $typeSubvention->delete();
        return response()->json(['message' => 'Type de subvention supprimé']);
    }
}