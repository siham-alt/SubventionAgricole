<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DossierHistorique extends Model
{
    protected $table = 'dossier_historique';
    protected $guarded = [];

    public function dossier() { return $this->belongsTo(Dossier::class); }
    public function user() { return $this->belongsTo(User::class); }
}
