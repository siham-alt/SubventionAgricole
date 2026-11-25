<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $guarded = [];

    public function dossier() { return $this->belongsTo(Dossier::class); }
    public function verifiePar() { return $this->belongsTo(User::class, 'verifie_par_id'); }
}