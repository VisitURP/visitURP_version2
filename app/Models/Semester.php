<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Semester extends Model
{
    use HasFactory;

    protected $table = 'semesters'; // Nombre de la tabla en la base de datos
    // Puedes agregar otras configuraciones aquí, como columnas fillable si deseas hacer operaciones de guardado
}
