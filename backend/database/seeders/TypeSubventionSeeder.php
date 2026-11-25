<?php
namespace Database\Seeders;

use App\Models\TypeSubvention;
use Illuminate\Database\Seeder;

class TypeSubventionSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            [
                'nom_fr' => 'Acquisition de matériel agricole',
                'nom_ar' => 'اقتناء المعدات الفلاحية',
                'description_fr' => 'Subvention pour l\'achat de tracteurs, moissonneuses et équipements agricoles',
                'montant_max' => 500000,
                'taux_subvention' => 40,
                'documents_requis' => ['cin', 'titre_foncier', 'devis', 'attestation'],
            ],
            [
                'nom_fr' => 'Irrigation localisée (goutte-à-goutte)',
                'nom_ar' => 'الري الموضعي',
                'description_fr' => 'Subvention pour l\'installation de systèmes d\'irrigation économes en eau',
                'montant_max' => 300000,
                'taux_subvention' => 50,
                'documents_requis' => ['cin', 'titre_foncier', 'devis', 'photo'],
            ],
            [
                'nom_fr' => 'Plantation arboricole',
                'nom_ar' => 'الغراسات الشجرية',
                'description_fr' => 'Subvention pour la plantation d\'oliviers, agrumes et amandiers',
                'montant_max' => 200000,
                'taux_subvention' => 45,
                'documents_requis' => ['cin', 'titre_foncier', 'facture'],
            ],
            [
                'nom_fr' => 'Développement de l\'élevage',
                'nom_ar' => 'تنمية تربية المواشي',
                'description_fr' => 'Subvention pour l\'acquisition de cheptel et aménagement d\'étables',
                'montant_max' => 400000,
                'taux_subvention' => 35,
                'documents_requis' => ['cin', 'titre_foncier', 'devis', 'attestation'],
            ],
        ];

        foreach ($types as $type) {
            TypeSubvention::create($type);
        }
    }
}