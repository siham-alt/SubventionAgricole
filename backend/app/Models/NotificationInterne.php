<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationInterne extends Model
{
    protected $table = 'notifications_internes';
    protected $guarded = [];

    public function user() { return $this->belongsTo(User::class); }
    public function dossier() { return $this->belongsTo(Dossier::class); }
}