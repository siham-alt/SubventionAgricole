<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dossier_id')->constrained()->cascadeOnDelete();
            $table->enum('type_document', [
                'cin', 'titre_foncier', 'devis', 'facture',
                'attestation', 'photo', 'releve_bancaire', 'autre'
            ]);
            $table->string('nom_original');
            $table->string('chemin_fichier');
            $table->string('mime_type');
            $table->unsignedBigInteger('taille');
            $table->integer('version')->default(1);
            $table->enum('statut_verification', ['en_attente', 'valide', 'refuse'])->default('en_attente');
            $table->text('commentaire_agent')->nullable();
            $table->foreignId('verifie_par_id')->nullable()->constrained('users');
            $table->timestamp('date_verification')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};