<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Exports\DossiersExport;
use App\Models\Dossier;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class RapportController extends Controller
{
    public function exporterExcel(Request $request)
    {
        $filtres = $this->extraireFiltres($request);
        return Excel::download(new DossiersExport($filtres), 'rapport-dossiers-' . date('Y-m-d') . '.xlsx');
    }

    public function exporterPdf(Request $request)
    {
        $filtres = $this->extraireFiltres($request);
        $dossiers = $this->appliquerFiltres(Dossier::with(['user', 'exploitation', 'typeSubvention']), $filtres)->get();

        $pdf = Pdf::loadView('rapports.dossiers-pdf', ['dossiers' => $dossiers, 'filtres' => $filtres]);
        return $pdf->download('rapport-dossiers-' . date('Y-m-d') . '.pdf');
    }

    private function extraireFiltres(Request $request): array
    {
        return [
            'mois' => $request->query('mois'),         // format YYYY-MM
            'statut' => $request->query('statut'),
            'region' => $request->query('region'),
            'type_subvention_id' => $request->query('type_subvention_id'),
            'date_debut' => $request->query('date_debut'),
            'date_fin' => $request->query('date_fin'),
        ];
    }

    public static function appliquerFiltres($query, array $filtres)
    {
        if (!empty($filtres['mois'])) {
            $query->whereYear('created_at', substr($filtres['mois'], 0, 4))
                  ->whereMonth('created_at', substr($filtres['mois'], 5, 2));
        }
        if (!empty($filtres['statut'])) {
            $query->where('statut', $filtres['statut']);
        }
        if (!empty($filtres['type_subvention_id'])) {
            $query->where('type_subvention_id', $filtres['type_subvention_id']);
        }
        if (!empty($filtres['region'])) {
            $query->whereHas('exploitation', fn($q) => $q->where('region', $filtres['region']));
        }
        if (!empty($filtres['date_debut'])) {
            $query->whereDate('created_at', '>=', $filtres['date_debut']);
        }
        if (!empty($filtres['date_fin'])) {
            $query->whereDate('created_at', '<=', $filtres['date_fin']);
        }
        return $query;
    }
}