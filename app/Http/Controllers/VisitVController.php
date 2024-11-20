<?php

namespace App\Http\Controllers;

use App\Models\visitV;
use App\Models\Semester;
use Illuminate\Http\Request;

class VisitVController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $visit_V = visitV::get();

        $data = $visit_V->map(function($visit_V){
            return [
                'id_visitV' => $visit_V -> id_visitV,
                'fk_id_visitor' => $visit_V -> fk_id_visitorV,
                'visitor_type' => $visit_V -> visitor_type,
                'fk_id_semester' => $visit_V -> fk_id_semester,
            ];
        });

        //pequeña modificacion
        return response()->json(
            $data
        );
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
        $validatedData = $request->validate([
            'fk_id_visitor' => ['required', 'max:500'],
            'visitor_type' => 'required|in:' . implode(',', [visitV::TYPE1, visitV::TYPE2]),
            'fk_id_semester' => ['required'],
        ]);

        $visitV = visitV::create($validatedData);
        
        return response()->json($visitV, 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $visitor_V = visitV::findOrFail($id);
        return response()->json([
            $visitor_V
        ] 
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(visitV $visitV)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $visitV)
    {
        $request->validate([
            'fk_id_visitorV' => ['required', 'max:500'],
            'visitor_type' => ['required'],
        ]);

        $visitV = visitV::findOrFail($visitV);
        $visitV-> fk_id_visitor = $request['fk_id_visitor'];
        $visitV-> visitor_type = $request['visitor_type'];
        $visitV-> save();

        return response()->json([
            'Message' => 'Data already updated.',
            'Virtual visit: ' => $visitV
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $visitV = visitV::findOrFail($id);
        $visitV -> delete();

        return response()->json([
            'Message' => 'Virtual visit deleted successfully.'
        ]);
    }
}
