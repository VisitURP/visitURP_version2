<?php

namespace App\Http\Controllers;

use App\Models\VisitGroup;
use Illuminate\Http\Request;

class VisitGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

     public function index()
    {
        // $visitGroup = VisitGroup::whereHas('builtAreas')->with('builtAreas')->get();
        // \Log::info('Visit Groups with Built Areas:', $visitGroup->toArray());

        $visitGroup = VisitGroup::with('builtAreas')->get();        

        return response()->json([
            'success' => true,
            'data' => $visitGroup,
        ]);
    }

     


    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nameGroup' => 'required|string',
            'guide' => 'required|string',
            'dayOfVisit' => 'required|date_format:d/m/Y',
            'quantity' => 'required|integer',
            'educationalInstitution' => 'required|string',
            'placesToVisit' => 'required|array',
            'placesToVisit.*' => 'exists:built_areas,id_builtArea',
        ]);
    
        $visitGroup = VisitGroup::create($validatedData);
    
        // Asocia las builtAreas al visitGroup
        $visitGroup->builtAreas()->attach($validatedData['placesToVisit']);
    
        // Verifica qué datos se insertaron
        $builtAreas = $visitGroup->builtAreas;
        \Log::info('Built Areas:', $builtAreas->toArray());

        return response()->json([
            'success' => true,
            'data' => $visitGroup
        ]);

    }
    

    

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\VisitGroup  $visitGroup
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $visitGroup = VisitGroup::with('builtAreas')->find($id);

        if (!$visitGroup) {
            return response()->json([
                'success' => false,
                'message' => 'Visit Group not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $visitGroup
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\VisitGroup  $visitGroup
     * @return \Illuminate\Http\Response
     */
    public function edit(VisitGroup $visitGroup)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\VisitGroup  $visitGroup
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // Validación de los datos de entrada
        $validated = $request->validate([
            'nameGroup' => 'required|string',
            'guide' => 'required|string',
            'dayOfVisit' => 'required|date_format:d/m/Y',
            'quantity' => 'required|integer',
            'educationalInstitution' => 'required|string',
            'placesToVisit' => 'required|array', // Asegúrate de que placesToVisit sea un arreglo de IDs de áreas
        ]);

        // Encontrar el grupo de visitas por su ID
        $visitGroup = VisitGroup::find($id);

        if (!$visitGroup) {
            return response()->json([
                'success' => false,
                'message' => 'Visit Group not found.',
            ], 404);
        }

        // Actualizar los campos del grupo de visitas
        $visitGroup->update($validated);

        // Si se proporciona una lista de áreas, asociarlas
        if (isset($validated['placesToVisit'])) {
            $visitGroup->builtAreas()->sync($validated['placesToVisit']); // Sync reemplaza las relaciones existentes
        }

        return response()->json([
            'success' => true,
            'message' => 'Visit group updated successfully.',
            'data' => $visitGroup,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\VisitGroup  $visitGroup
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $visitGroup = VisitGroup::find($id);

        if (!$visitGroup) {
            return response()->json([
                'success' => false,
                'message' => 'Visit Group not found.',
            ], 404);
        }

        // Eliminar el grupo de visitas
        $visitGroup->delete();

        return response()->json([
            'success' => true,
            'message' => 'Visit group deleted successfully.',
        ]);
    }
}
