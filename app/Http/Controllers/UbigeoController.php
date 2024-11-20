<?php

namespace App\Http\Controllers;

use App\Models\Ubigeo;
use Illuminate\Http\Request;

class UbigeoController extends Controller
{
    public function getDepartments()
    {
        $results = Ubigeo::where('cod_Ubigeo', 'LIKE', '%'.'0000')->get();
        return response()->json($results);
    }

    public function getProvinces($department)
    {
        $results = Ubigeo::where('cod_Ubigeo', 'LIKE', $department.'%'.'00')
        ->where('cod_Ubigeo', '!=', $department . '0000') 
        ->get();
        
        return response()->json($results);        
    }

    public function getDistricts($province)
    {
        $results = Ubigeo::where('cod_Ubigeo', 'LIKE', $province.'%')
        ->where('cod_Ubigeo', '!=', $province . '00') 
        ->get();
        return response()->json($results);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $details = Ubigeo::all();
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
        $validatedData = $request->validate([
            'cod_Ubigeo' => ['required', 'max:7'],
            'UbigeoName' => ['required', 'max:500'],
        ]);

        $ubigeo = Ubigeo::create($validatedData);
        
        return response()->json($ubigeo, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ubigeo $ubigeo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ubigeo $ubigeo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ubigeo $ubigeo)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ubigeo $ubigeo)
    {
        //
    }
}
