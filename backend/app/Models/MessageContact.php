<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessageContact extends Model
{
    protected $table = 'messages_contact';
    protected $guarded = [];

    protected function casts(): array
    {
        return ['repondu_le' => 'datetime'];
    }

    public function dossier() { return $this->belongsTo(Dossier::class); }
    public function assigneA() { return $this->belongsTo(User::class, 'assigne_a_id'); }
    public function renduParUser() { return $this->belongsTo(User::class, 'repondu_par_id'); }
}