<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('dossiers', function (Blueprint $table) {
            $table->id();
            $table->string('numero_dossier')->unique(); // ex: DOS-2026-000123
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('exploitation_id')->constrained('exploitations_agricoles')->cascadeOnDelete();
            $table->foreignId('type_subvention_id')->constrained('types_subvention');

            $table->enum('statut', [
                'brouillon',
                'soumis',
                'en_cours_verification',
                'complement_demande',
                'en_validation_agent',
                'en_validation_responsable',
                'approuve',
                'refuse',
                'paye'
            ])->default('brouillon');

            $table->decimal('montant_demande', 12, 2)->nullable();
            $table->decimal('montant_accorde', 12, 2)->nullable();
            $table->text('description_projet')->nullable();
            $table->text('motif_refus')->nullable();

            $table->foreignId('agent_traitant_id')->nullable()->constrained('users');
            $table->foreignId('valide_par_id')->nullable()->constrained('users');

            $table->timestamp('date_soumission')->nullable();
            $table->timestamp('date_validation')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dossiers');
    }
};