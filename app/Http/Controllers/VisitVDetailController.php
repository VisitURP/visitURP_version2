<?php

namespace App\Http\Controllers;

use App\Models\VisitVDetail;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Validation\Rule;

class VisitVDetailController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $details = VisitVDetail::all();
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
        $validated = $request->validate([
            'fk_id_visitorV' => 'required|exists:visitor_v_s,id_visitorV',
            'fk_id_visitV' => 'required|exists:visit_v_s,id_visitV',
            'fk_id_builtArea' => 'required|exists:built_areas,id_builtArea',
            'kindOfEvent' => 'required|string',
            'get' => 'required|string',
            'DateTime' => 'required|date_format:Y-m-d H:i:s',
        ]);

        $detail = VisitVDetail::create($validated);

        return response()->json($detail, 201);
    }

    

    /**
     * Display the specified resource.
     */
    public function show(int $id_visitVDetail)
    {
        $visitVDetail = VisitVDetail::findOrFail($id_visitVDetail);
        return response()->json([
            $visitVDetail
        ] 
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(VisitVDetail $visitVDetail)
    {
        //
    }

    public function update(Request $request, int $id_visitVDetail)
    {
        $request->validate([
            'fk_id_visitorV' => ['required', 'exists:visitor_v_s,id_visitorV'],
            'fk_id_visitV' => ['required','exists:visit_v_s,id_visitV'],
            'fk_id_builtArea' => ['required', 'exists:built_areas,id_builtArea'],
            'kindOfEvent' => ['required', 'string'],
            'get' => ['required','string'],
            'DateTime' => ['required','date_format:Y-m-d H:i:s'],
        ]);

        $visitVDetail = VisitVDetail::findOrFail($id_visitVDetail);
        $visitVDetail-> fk_id_visitorV = $request['fk_id_visitorV'];
        $visitVDetail-> fk_id_visitV = $request['fk_id_visitV'];
        $visitVDetail-> fk_id_builtArea = $request['fk_id_builtArea'];
        $visitVDetail-> kindOfEvent = $request['kindOfEvent'];
        $visitVDetail-> get = $request['get'];
        $visitVDetail-> DateTime = $request['DateTime'];
        $visitVDetail-> save();

        return response()->json([
            'Message' => 'Data already updated.',
            'Virtual visitor: ' => $visitVDetail
        ]);
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id_visitVDetail)
    {
        $visitVDetail = VisitVDetail::findOrFail($id_visitVDetail);
        $visitVDetail -> delete();

        return response()->json([
            'Message' => 'Virtual visitor deleted successfully.'
        ]);
    }
}
