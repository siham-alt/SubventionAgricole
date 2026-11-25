<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $guarded = [];

    public function dossier() { return $this->belongsTo(Dossier::class); }
    public function expediteur() { return $this->belongsTo(User::class, 'expediteur_id'); }
    public function destinataire() { return $this->belongsTo(User::class, 'destinataire_id'); }
}