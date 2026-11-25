<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TypeSubvention extends Model
{
    protected $table = 'types_subvention';
    protected $guarded = [];
    protected $casts = ['documents_requis' => 'array'];
}
