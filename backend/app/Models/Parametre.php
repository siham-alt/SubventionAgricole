<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Parametre extends Model
{
    protected $guarded = [];

    public static function get(string $cle, $defaut = null)
    {
        return static::where('cle', $cle)->value('valeur') ?? $defaut;
    }

    public static function set(string $cle, $valeur): void
    {
        static::updateOrCreate(['cle' => $cle], ['valeur' => $valeur]);
    }
}