<?php

namespace App\Http\Controllers;

use App\Models\Applicant;
use Illuminate\Http\Request;

class ApplicantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $applicants = Applicant::all();
        return response()->json($applicants);
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
            'applicantCod' => 'required|string',
            'name' => 'required|string',
            'lastName' => 'required|string',
            'fk_docType_id' => 'nullable|exists:doc_types,id_docType',
            'documentNumber' => 'required|string',
            'meritOrder' => 'required|string|unique:applicants,meritOrder',
            'studentCode' => 'required|string',
            'admitted' => 'required|boolean',
        ]);

        $applicant = Applicant::create($request->all());

        return response()->json($applicant, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $applicant = Applicant::find($id);

        if (!$applicant) {
            return response()->json(['message' => 'Applicant not found'], 404);
        }

        return response()->json($applicant);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Applicant $applicant)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        $applicant = Applicant::find($id);

        if (!$applicant) {
            return response()->json(['message' => 'Applicant not found'], 404);
        }

        $request->validate([
            'applicantCod' => 'required|string',
            'name' => 'required|string',
            'lastName' => 'required|string',
            'fk_docType_id' => 'nullable|exists:doc_types,id_docType',
            'documentNumber' => 'required|string',
            'meritOrder' => 'required|string|unique:applicant_u_r_p_s,meritOrder,' . $id . ',id_applicant',
            'studentCode' => 'required|string',
            'admitted' => 'required|boolean',
        ]);

        $applicant->update($request->all());

        return response()->json($applicant);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $applicant = Applicant::find($id);

        if (!$applicant) {
            return response()->json(['message' => 'Applicant not found'], 404);
        }

        $applicant->delete();

        return response()->json(['message' => 'Applicant deleted successfully']);
    }
}
