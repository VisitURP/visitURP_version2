<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Semester extends Model
{
    use HasFactory;

    protected $table = 'semesters'; // Nombre de la tabla en la base de datos
    protected $primaryKey = 'id_semester'; // Establece 'id_semester' como la clave primaria

    public $timestamps = true; // Habilita los timestamps (created_at, updated_at)
    
    // Si deseas, puedes definir las propiedades fillable para asignación masiva
    protected $fillable = ['semesterName', 'until']; // Permite asignar estos campos
    
    use SoftDeletes;

    protected $dates = ['deleted_at'];
}
