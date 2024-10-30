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
        $validated = $request->validate([
            'ID_Visitante' => 'required|string|max:255',
            'Fecha_Visita' => 'required|date',
            'Hora_Visita' => 'required|date_format:H:i',
            'Semestre' => 'required|string|max:255',
            'Provincia_O' => 'required|string|max:255',
        ]);

        VisitP::create($validated);

        return response()->json(['message' => 'Visita registrada exitosamente'], 201);
    }
}
