<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Semester; // Asegúrate de que este modelo existe y apunta a la tabla de semestres

class SemesterController extends Controller
{
    public function index()
    {
        // Obtener todos los registros de la tabla de semestres
        $semesters = Semester::all();

        // Devolver los registros en formato JSON
        return response()->json($semesters);
    }
    public function store(Request $request)
    {
    $semester = new Semester();
    $semester->semesterName = $request->input('semesterName');
    $semester->until = $request->input('until');
    $semester->created_at = now();
    // Se asume que updated_at y deleted_at son nulos por defecto
    $semester->save();

    return response()->json($semester, 201);
    }
}