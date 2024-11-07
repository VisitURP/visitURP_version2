<?php

namespace App\Http\Controllers;

use App\Models\VisitP; 
use Illuminate\Http\Request;

class VisitPController extends Controller
{
    public function index()
    {
        return response()->json(VisitP::all());
    }
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'ID_Visitante' => 'required|string|max:255|unique:visitp',
                'Fecha_Visita' => 'required|date',
                'Hora_Visita' => 'required|date_format:H:i',
                'Semestre' => 'required|string|max:255',
                'Provincia_O' => 'required|string|max:255',
            ]);
    
            VisitP::create($validated);
    
            return response()->json(['message' => 'Visita registrada exitosamente'], 201);
        } catch (ValidationException $e) {
            return $this->invalidJson($request, $e); // Usar tu método para manejar errores de validación
        }
    }
    public function invalidJson($request, ValidationException $exception)
    {
        return response()->json(['errors' => $exception->validator->errors(),], 422);
    }

    public function destroy($id)
    {
        $visit = VisitP::find($id);
    
        if (!$visit) {
        return response()->json(['message' => 'Visitante no encontrado'], 404);}
    
        $visit->delete();
    
        return response()->json(['message' => 'Visitante eliminado exitosamente']);
    }
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
        'Fecha_Visita' => 'required|date',
        'Hora_Visita' => 'required|date_format:H:i:s',
        'Semestre' => 'required|string|max:10',
        'Provincia_O' => 'required|string|max:50',
        'Estado' => 'required|string|max:20',
        ]);

        $visit = VisitP::findOrFail($id);

        $visit->Fecha_Visita = $validatedData['Fecha_Visita'];
        $visit->Hora_Visita = $validatedData['Hora_Visita'];
        $visit->Semestre = $validatedData['Semestre'];
        $visit->Provincia_O = $validatedData['Provincia_O'];
        $visit->Estado = $validatedData['Estado'];

        $visit->save();

        return response()->json(['message' => 'Visita actualizada correctamente'], 200);
    }
}
