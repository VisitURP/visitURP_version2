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
            'name' => 'required|string|max:500',
            'lastName' => 'required|string|max:500',
            'email' => 'required|email|max:500',
            'docNumber' => 'required|string|max:500',
            'phone' => 'nullable|string|max:500',
            'cod_Ubigeo' => 'nullable|string|max:255',
            'educationalInstitution' => 'nullable|string|max:500',
            'gender' => 'required|in:F,M',
            'birthDate' => 'required|date',
        ]);

        $validated['fk_docType_id'] = is_numeric($validated['docNumber']) ? 1 : 2;

        $validated['created_at'] = now();
        $validated['updated_at'] = now();

        VisitP::create($validated);

        return response()->json(['message' => 'Visita registrada exitosamente'], 201);}
        catch (ValidationException $e) {
        return $this->invalidJson($request, $e); }
    }
    public function invalidJson($request, ValidationException $exception)
    {
        return response()->json(['errors' => $exception->validator->errors(),], 422);
    }

    public function softDelete(Request $request, $id)
{
    $visit = VisitP::find($id);

    if (!$visit) {
        return response()->json(['message' => 'Visitante no encontrado'], 404);
    }

    $visit->deleted_at = now();
    $visit->save();

    return response()->json(['message' => 'Visitante marcado como eliminado']);
}
    public function update(Request $request, $id)
{
    try {
        $validated = $request->validate([
            'name' => 'required|string|max:500',
            'lastName' => 'required|string|max:500',
            'email' => 'required|email|max:500',
            'docNumber' => 'required|string|max:500',
            'phone' => 'nullable|string|max:500',
            'cod_Ubigeo' => 'nullable|string|max:255',
            'educationalInstitution' => 'nullable|string|max:500',
            'gender' => 'required|in:F,M',
            'birthDate' => 'required|date',
        ]);

        $validated['fk_docType_id'] = is_numeric($validated['docNumber']) ? 1 : 2;
        $validated['updated_at'] = now();

        $visitor = VisitP::find($id);
        if (!$visitor) {
            return response()->json(['message' => 'Visitante no encontrado'], 404);
        }

        $visitor->update($validated);

        return response()->json(['message' => 'Visita actualizada exitosamente']);
    } catch (Exception $e) {
        return response()->json(['message' => 'Error al actualizar la visita', 'error' => $e->getMessage()], 500);
    }
}
}
