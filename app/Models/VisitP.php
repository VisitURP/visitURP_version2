<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisitP extends Model
{
    use HasFactory;

    protected $table = 'visitp';

    public $timestamps = false;

    protected $fillable = [
        'ID_Visitante',
        'Fecha_Visita',
        'Hora_Visita',
        'Semestre',
        'Provincia_O',
        'Estado'
    ];
}
