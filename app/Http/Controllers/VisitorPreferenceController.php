<?php

namespace App\Http\Controllers;

use App\Models\VisitorPreference;
use Illuminate\Http\Request;

class VisitorPreferenceController extends Controller
{
    /**
     * Display a listing of the resource.
     */

     public function getAcademicInterestCounts()
    {
        $interestCounts = VisitorPreference::select('academic_interests.academicInterestName as career_name')
        ->selectRaw('COUNT(*) as count')
        ->join('academic_interests', 'visitor_preferences.fk_id_academicInterested', '=', 'academic_interests.id_academicInterest')
        ->groupBy('fk_id_academicInterested', 'academic_interests.academicInterestName')
        ->get();

        // Formato de respuesta JSON
        return response()->json([
        'academic_interests' => $interestCounts
        ]);
    }

    public function getPreferencesByVisitorId($id_visitor)
    {
        // Obtiene las preferencias específicas del visitante
        $preferences = VisitorPreference::where('fk_id_visitor', $id_visitor)->orWhere('visitor_type', 'V')->get();

        // Verifica si se encontraron preferencias
        if ($preferences->isEmpty()) {
            return response()->json([
                
                'message' => 'No se encontraron preferencias para este visitante.'
            ], 404);
        }

        return response()->json([
            
            $preferences
        ]);
    }

    public function deletePreference($id_visitor, $fk_id_academicInterest)
{
    $preference = VisitorPreference::where('fk_id_visitor', $id_visitor)
                                   ->where('fk_id_academicInterested', $fk_id_academicInterest)
                                   ->first();

    if (!$preference) {
        return response()->json([
            'message' => 'No se encontró la preferencia para este visitante y el interés académico.'
        ], 404);
    }

    // Elimina la preferencia
    $preference->delete();

    return response()->json([
        'message' => 'Preferencia eliminada correctamente.'
    ], 200);
}


    public function index()
    {
        $details = VisitorPreference::all();
        return response()->json($details);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'fk_id_visitor' => 'required|integer',
            'fk_id_academicInterested' => 'required|integer',
            'visitor_type' => 'required|in:' . implode(',', [VisitorPreference::TYPE1, VisitorPreference::TYPE2]),
        ]);

        $visitorPreference = visitorPreference::create([
            'fk_id_visitor' => $request->fk_id_visitor,
            'fk_id_academicInterested' => $request->fk_id_academicInterested,
            'visitor_type' => $request->visitor_type,
        ]);

        return response()->json($visitorPreference, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $visitorPreference = VisitorPreference::findOrFail($id);
        return response()->json([
            $visitorPreference
        ] 
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(VisitorPreference $visitorPreference)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $visitorPreference)
    {
        $request->validate([
            'fk_id_visitor' => 'required|integer',
            'fk_id_academicInterested' => 'required|integer',
            'visitor_type' => 'in:' . implode(',', [visitorPreference::TYPE1, visitorPreference::TYPE2]),
        ]);

        $visitorPreference = visitorPreference::findOrFail($id);
        $visitorPreference->update($request->only('visitor_type'));

        return response()->json($visitorPreference, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $visitorPreference = visitorPreference::findOrFail($id);
        $visitorPreference -> delete();

        return response()->json([
            'Message' => 'Data was deleted successfully.'
        ]);
    }
}
