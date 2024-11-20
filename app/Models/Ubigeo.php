<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Ubigeo extends Model
{
    use SoftDeletes;
    protected $table = 'ubigeos';
    protected $primaryKey = 'id_Ubigeo';
    protected $fillable = ['cod_Ubigeo', 'UbigeoName'];
}
