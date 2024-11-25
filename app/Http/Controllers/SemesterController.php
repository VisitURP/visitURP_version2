<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Semester; // Asegúrate de que este modelo existe y apunta a la tabla de semestres

class SemesterController extends Controller
{
    public function index()
    {
        $semesters = Semester::whereNull('deleted_at')->get();
        return response()->json($semesters);
    }

    public function show(string $id)
    {
        $semester = Semester::findOrFail($id);
        return response()->json([
            $semester
        ] 
        );
    }

    public function store(Request $request)
    {
        $semester = new Semester();
        $semester->semesterName = $request->input('semesterName');
        $semester->semesterFrom = $request->input('semesterFrom');
        $semester->semesterTo = $request->input('semesterTo');
        $semester->created_at = now();
        // Se asume que updated_at y deleted_at son nulos por defecto
        $semester->save();

        return response()->json($semester, 201);
        }

    public function update(Request $request, $id)
    {
        // Buscar el semestre por ID
        $semester = Semester::find($id);
        
        // Comprobar si el semestre existe
        if (!$semester) {
            return response()->json(['error' => 'Semestre no encontrado'], 404);
        }

        // Validar los datos
        $request->validate([
            'semesterName' => 'required|string|max:255',
            'semesterFrom' => 'required|date',
            'semesterTo' => 'required|date',
        ]);

        // Actualiza los campos
        $semester->semesterName = $request->input('semesterName');
        $semester->semesterFrom = $request->input('semesterFrom');
        $semester->semesterTo = $request->input('semesterTo');
        $semester->updated_at = now(); // Actualiza la fecha de última modificación
        $semester->save();

        return response()->json($semester);
    }

    // Agrega el método para eliminar si no lo tienes
    public function destroy($id)
{
    $semester = Semester::find($id);
    if (!$semester) {
        return response()->json(['error' => 'Semestre no encontrado'], 404);
    }

    $semester->deleted_at = now(); // Marca la fecha de eliminación
    $semester->save();

    return response()->json(['message' => 'Semestre marcado como eliminado exitosamente']);
}
}