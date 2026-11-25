<?php
namespace App\Exports;

use App\Http\Controllers\Api\RapportController;
use App\Models\Dossier;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class DossiersExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    public function __construct(private array $filtres = []) {}

    public function collection()
    {
        $query = Dossier::with(['user', 'exploitation', 'typeSubvention']);
        return RapportController::appliquerFiltres($query, $this->filtres)->get();
    }

    public function headings(): array
    {
        return [
            'Référence', 'Agriculteur', 'Programme', 'Région',
            'Montant demandé', 'Montant accordé', 'Statut', 'Date de dépôt'
        ];
    }

    public function map($dossier): array
    {
        return [
            $dossier->numero_dossier,
            $dossier->user->name ?? '',
            $dossier->typeSubvention->nom_fr ?? '',
            $dossier->exploitation->region ?? '',
            $dossier->montant_demande,
            $dossier->montant_accorde ?? '-',
            $dossier->statut,
            optional($dossier->date_soumission)->format('d/m/Y') ?? '-',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [1 => ['font' => ['bold' => true]]];
    }
}