<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Region;
use Illuminate\Http\Request;

class RegionController extends Controller
{
    public function index()
    {
        return response()->json(Region::orderBy('nom')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string|unique:regions,nom',
            'code' => 'nullable|string|unique:regions,code',
        ]);

        $region = Region::create($data);
        return response()->json($region, 201);
    }

    public function destroy(Region $region)
    {
        $region->delete();
        return response()->json(['message' => 'Région supprimée']);
    }
}