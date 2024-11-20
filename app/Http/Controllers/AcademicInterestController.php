<?php

namespace App\Http\Controllers;

use App\Models\AcademicInterest;
use Illuminate\Http\Request;

class AcademicInterestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        
        $details = AcademicInterest::all();
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
            'academicInterestCod' => ['required']
        ]);

        $acad_cod = AcademicInterest::where('academicInterestCod', $request-> academicInterestCod)->first();
        
        //si existe
        if($acad_cod)
        {
            return response()->json([
                'Message' => 'Code is already in the table.',
            ]); 
        }
        //si es que no
        else
        {
            $request->validate([
                'academicInterestName' => ['required', 'max:100'],
                'academicInterestCod' => ['required']
            ]);

            $academic = AcademicInterest::create([
                'academicInterestName' => $request['academicInterestName'],
                'academicInterestCod' => $request['academicInterestCod']
            ]);

            return response()->json([
                'Message' => 'Academic Interest is registered successfully.',
                'Academic Interest:' => $academic
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $academic = AcademicInterest::findOrFail($id);
        return response()->json(
            $academic
         
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AcademicInterest $academicInterest)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $academicInterest)
    {
        $request->validate([
            'academicInterestName' => ['required', 'max:100'],
            'academicInterestCod' => ['required']
        ]);

        $academicInterest = AcademicInterest::findOrFail($academicInterest);
        $academicInterest->academicInterestName= $request['academicInterestName'];
        $academicInterest->academicInterestCod = $request['academicInterestCod'];
        $academicInterest->save();

        return response()->json([
            'Message' => 'Data was updated successfully.',
            'academicInterested: ' => $academicInterest
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id_academicInterested)
    {
        $academic = AcademicInterest::findOrFail($id_academicInterested);
        $academic -> delete();

        return response()->json([
            'Message' => 'Data was deleted successfully.'
        ]);
    }
}
