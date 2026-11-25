<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Dossier extends Model implements HasMedia
{
    use SoftDeletes, InteractsWithMedia;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'date_soumission' => 'datetime',
            'date_validation' => 'datetime',
            'montant_demande' => 'decimal:2',
            'montant_accorde' => 'decimal:2',
        ];
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($dossier) {
            $dossier->numero_dossier = 'DOS-' . date('Y') . '-' . str_pad(
                (static::withTrashed()->count() + 1), 6, '0', STR_PAD_LEFT
            );
        });
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('cin');
        $this->addMediaCollection('titre_foncier');
        $this->addMediaCollection('devis');
        $this->addMediaCollection('facture');
        $this->addMediaCollection('attestation');
        $this->addMediaCollection('photo');
        $this->addMediaCollection('releve_bancaire');
        $this->addMediaCollection('autre');
    }

    public function user() { return $this->belongsTo(User::class); }
    public function exploitation() { return $this->belongsTo(ExploitationAgricole::class, 'exploitation_id'); }
    public function typeSubvention() { return $this->belongsTo(TypeSubvention::class, 'type_subvention_id'); }
    public function documents() { return $this->hasMany(Document::class); }
    public function historique() { return $this->hasMany(DossierHistorique::class); }
    public function messages() { return $this->hasMany(Message::class); }
    public function agentTraitant() { return $this->belongsTo(User::class, 'agent_traitant_id'); }
    public function valideParUser() { return $this->belongsTo(User::class, 'valide_par_id'); }
}