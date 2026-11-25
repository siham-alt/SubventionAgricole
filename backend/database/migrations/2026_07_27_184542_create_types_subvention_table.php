<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('types_subvention', function (Blueprint $table) {
            $table->id();
            $table->string('nom_fr');
            $table->string('nom_ar')->nullable();
            $table->text('description_fr')->nullable();
            $table->text('description_ar')->nullable();
            $table->decimal('montant_max', 12, 2)->nullable();
            $table->decimal('taux_subvention', 5, 2)->nullable(); // en %
            $table->json('documents_requis')->nullable(); // liste des pièces obligatoires
            $table->boolean('actif')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('types_subvention');
    }
};