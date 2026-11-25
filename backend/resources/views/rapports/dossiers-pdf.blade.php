<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: sans-serif; font-size: 11px; color: #263238; }
        h1 { color: #1B5E20; font-size: 18px; margin-bottom: 4px; }
        .filtres { font-size: 10px; color: #607d8b; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background: #1B5E20; color: #fff; padding: 8px; text-align: left; font-size: 10px; }
        td { padding: 7px 8px; border-bottom: 1px solid #eee; font-size: 10px; }
    </style>
</head>
<body>
    <h1>Rapport des dossiers de subvention</h1>
    <p class="filtres">
        Généré le {{ date('d/m/Y à H:i') }}
        @if(!empty($filtres['mois'])) — Mois : {{ $filtres['mois'] }} @endif
        @if(!empty($filtres['statut'])) — Statut : {{ $filtres['statut'] }} @endif
        @if(!empty($filtres['region'])) — Région : {{ $filtres['region'] }} @endif
        — {{ $dossiers->count() }} dossier(s)
    </p>

    <table>
        <thead>
            <tr>
                <th>Référence</th><th>Agriculteur</th><th>Programme</th>
                <th>Montant demandé</th><th>Montant accordé</th><th>Statut</th><th>Date</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($dossiers as $d)
            <tr>
                <td>{{ $d->numero_dossier }}</td>
                <td>{{ $d->user->name ?? '' }}</td>
                <td>{{ $d->typeSubvention->nom_fr ?? '' }}</td>
                <td>{{ number_format($d->montant_demande, 0, ',', ' ') }} DH</td>
                <td>{{ $d->montant_accorde ? number_format($d->montant_accorde, 0, ',', ' ') . ' DH' : '-' }}</td>
                <td>{{ $d->statut }}</td>
                <td>{{ optional($d->date_soumission)->format('d/m/Y') ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>