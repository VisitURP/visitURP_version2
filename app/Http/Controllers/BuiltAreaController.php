<?php

namespace App\Http\Controllers;

use App\Models\BuiltArea;
use Illuminate\Http\Request;

class BuiltAreaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $builtArea = BuiltArea::all();
        return response()->json($builtArea);
        
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
            'builtAreaCod' => ['required']
        ]);

        $area_cod = BuiltArea::where('builtAreaCod', $request-> builtAreaCod)->first();
        
        //si existe
        if($area_cod)
        {
            return response()->json([
                'Message' => 'Code is already in the table.',
            ]); 
        }
        //si es que no
        else
        {
            $request->validate([
                'fk_id_academicInterest' => ['required'],
                'builtAreaName' => ['required', 'max:100'],
                'builtAreaImageURL' => ['nullable'],
                'builtAreaAudioURL' => ['nullable'],
                'builtAreaCod' => ['required'],
                'builtAreaDescription' => ['required', 'max:200'],
            ]);

            $area = BuiltArea::create([
                'fk_id_academicInterest' => $request['fk_id_academicInterest'],
                'builtAreaName' => $request['builtAreaName'],
                'builtAreaImageURL' => $request['builtAreaImageURL'],
                'builtAreaAudioURL' => $request['builtAreaAudioURL'],
                'builtAreaCod' => $request['builtAreaCod'],
                'builtAreaDescription' => $request['builtAreaDescription']
            ]);

            return response()->json([
                'Message' => 'Built Area is registered successfully.',
                'Built Area:' => $area
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $area = BuiltArea::findOrFail($id);
        return response()->json([
            $area
        ] 
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BuiltArea $builtArea)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $builtArea)
    {
        $request->validate([
            'fk_id_academicInterest' => ['required', 'max:100'],
            'builtAreaName' => ['required', 'max:100'],
            'builtAreaImageURL' => ['nullable'],
            'builtAreaAudioURL' => ['nullable'],
            'builtAreaCod' => ['required'],
            'builtAreaDescription' => ['required']
        ]);

        $builtArea = BuiltArea::findOrFail($builtArea);
        $builtArea->fk_id_academicInterest= $request['fk_id_academicInterest'];
        $builtArea->builtAreaName= $request['builtAreaName'];
        $builtArea->builtAreaImageURL= $request['builtAreaImageURL'];
        $builtArea->builtAreaAudioURL= $request['builtAreaAudioURL'];
        $builtArea->builtAreaCod= $request['builtAreaCod'];
        $builtArea->builtAreaDescription = $request['builtAreaDescription'];
        $builtArea->save();

        return response()->json([
            'Message' => 'Data was updated successfully.',
            'Built Area: ' => $builtArea
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id_builtArea)
    {
        $area = BuiltArea::findOrFail($id_builtArea);
        $area -> delete();

        return response()->json([
            'Message' => 'Data was deleted successfully.'
        ]);
    }
}
