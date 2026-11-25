<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages_contact', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('email');
            $table->string('numero_dossier')->nullable(); // saisi tel quel par le visiteur
            $table->foreignId('dossier_id')->nullable()->constrained('dossiers')->nullOnDelete();
            $table->string('sujet')->nullable();
            $table->text('message');

            // null = file d'attente admin ; sinon l'agent_traitant_id du dossier au moment de l'envoi
            $table->foreignId('assigne_a_id')->nullable()->constrained('users')->nullOnDelete();

            $table->enum('statut', ['nouveau', 'lu', 'traite'])->default('nouveau');
            $table->text('reponse')->nullable();
            $table->foreignId('repondu_par_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('repondu_le')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages_contact');
    }
};