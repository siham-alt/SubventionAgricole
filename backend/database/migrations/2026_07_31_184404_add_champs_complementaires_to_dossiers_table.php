<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('dossiers', function (Blueprint $table) {
            // Identité juridique
            $table->enum('statut_juridique', ['physique', 'cooperative', 'gie', 'societe'])
                  ->default('physique');
            $table->string('numero_immatriculation')->nullable();
            $table->string('numero_cnss')->nullable();
            $table->string('nom_representant_legal')->nullable();

            // Statut foncier
            $table->enum('mode_tenure', ['proprietaire', 'locataire', 'melk', 'collectif', 'domaine_etat'])
                  ->default('proprietaire');
            $table->string('numero_titre_foncier')->nullable();

            // Détails techniques
            $table->integer('nombre_unites')->nullable(); // têtes de bétail, plants, hectares irrigués...
            $table->string('type_equipement')->nullable();
            $table->decimal('cout_total_projet', 12, 2)->nullable();
            $table->decimal('apport_personnel', 12, 2)->nullable();
            $table->date('date_debut_prevue')->nullable();
            $table->date('date_fin_prevue')->nullable();

            // Bancaire
            $table->string('rib')->nullable();
            $table->string('nom_banque')->nullable();
            $table->string('agence_bancaire')->nullable();

            // Antécédents
            $table->boolean('a_deja_beneficie')->default(false);
            $table->string('reference_subvention_precedente')->nullable();

            // Contact projet
            $table->string('telephone_contact_projet')->nullable();
            $table->string('email_contact_projet')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('dossiers', function (Blueprint $table) {
            $table->dropColumn([
                'statut_juridique', 'numero_immatriculation', 'numero_cnss', 'nom_representant_legal',
                'mode_tenure', 'numero_titre_foncier',
                'nombre_unites', 'type_equipement', 'cout_total_projet', 'apport_personnel',
                'date_debut_prevue', 'date_fin_prevue',
                'rib', 'nom_banque', 'agence_bancaire',
                'a_deja_beneficie', 'reference_subvention_precedente',
                'telephone_contact_projet', 'email_contact_projet',
            ]);
        });
    }
};