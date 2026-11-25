<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('cin')->unique()->nullable()->after('name');
            $table->string('telephone')->nullable()->after('email');
            $table->string('adresse')->nullable();
            $table->string('region')->nullable();
            $table->string('province')->nullable();
            $table->string('commune')->nullable();
            $table->string('photo_profil')->nullable();
            $table->boolean('actif')->default(true);
            $table->timestamp('derniere_connexion')->nullable();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'cin', 'telephone', 'adresse', 'region',
                'province', 'commune', 'photo_profil',
                'actif', 'derniere_connexion'
            ]);
            $table->dropSoftDeletes();
        });
    }
};