<?php

namespace App\Http\Controllers;

use App\Models\visitorP;
use App\Models\visitV;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VisitorPController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $details = visitorP::all();
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
            'name' => ['required', 'max:500'],
            'lastName' => ['required', 'max:500'],
            'email' => ['required','email', 'max:500'],
            'fk_docType_id' => ['required', 'max:100'],
            'docNumber' => ['required','max:500'],
            'phone' => ['required','max:500'],
            'cod_Ubigeo' => ['max:500'],
            'educationalInstitution' => ['required','max:500'],
            'birthDate' => ['nullable','date_format:d/m/Y'],
            'gender' => 'nullable','in:' . implode(',', [visitorP::TYPE1, visitorP::TYPE2, visitorP::TYPE3])
        ]);

        
        $visitorP = visitorP::create($validatedData);

        $visitV = visitV::create([
            'fk_id_visitor' => $visitorP->id_visitorP,
            'visitor_type' => 'P',
            'fk_id_semester' => $this->assignSemester($visitorP->created_at),
        ]);

        // Retorna los datos del visitante existente para que Unity los muestre en el modal
        return response()->json([
            'visitorP' => $visitorP,
            'visitV' => $visitV, 
        ]);       
    }

    public function assignSemester($createdAt)
    {
        // Busca el semestre correspondiente basado en la fecha de creación
        $semester = Semester::where('semesterTo', '>=', $createdAt)
                        ->orderBy('semesterTo', 'asc')
                        ->first();

        // Retorna el id del semestre
        return $semester ? $semester->id_semester : null;
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $visitorP = visitorP::findOrFail($id);
        return response()->json([
            $visitorP
        ] 
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(visitorP $visitorP)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $visitorP)
    {
        $request->validate([
            'name' => ['nullable', 'max:500'],
            'lastName' => ['nullable', 'max:500'],
            'email' => ['nullable','email', 'max:500'],
            'fk_docType_id' => ['nullable', 'max:100'],
            'docNumber' => ['nullable','max:500'],
            'phone' => ['nullable','max:500'],
            'cod_Ubigeo' => ['nullable'],
            'educationalInstitution' => ['nullable','max:500'],
            'birthDate' => ['nullable','date_format:d/m/Y'],
            'gender' => 'nullable','in:' . implode(',', [visitorP::TYPE1, visitorP::TYPE2, visitorP::TYPE3])
       
        ]);

        $visitorP = visitorP::findOrFail($visitorP);
         // filled Solo actualiza los campos si no son null
    if ($request->filled('name')) {
        $visitorP->name = $request->input('name');
    }
    if ($request->filled('email')) {
        $visitorP->email = $request->input('email');
    }
    if ($request->filled('lastName')) {
        $visitorP->lastName = $request->input('lastName');
    }
    if ($request->filled('fk_docType_id')) {
        $visitorP->fk_docType_id = $request->input('fk_docType_id');
    }
    if ($request->filled('docNumber')) {
        $visitorP->docNumber = $request->input('docNumber');
    }
    if ($request->filled('phone')) {
        $visitorP->phone = $request->input('phone');
    }
    if ($request->filled('cod_Ubigeo')) {
        $visitorP->cod_Ubigeo = $request->input('cod_Ubigeo');
    }
    if ($request->filled('educationalInstitution')) {
        $visitorP->educationalInstitution = $request->input('educationalInstitution');
    }
    if ($request->filled('birthDate')) {
        $visitorP->birthDate = $request->input('birthDate');
    }
    if ($request->filled('gender')) {
        $visitorP->gender = $request->input('gender');
    }

    // Guarda los cambios
    $visitorP->save();

        return response()->json([
            'Message' => 'Data already updated.',
            'Physical Visitor: ' => $visitorP
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $visitorP = visitorP::findOrFail($id);
        $visitorP -> delete();

        return response()->json([
            'Message' => 'Physical visitor deleted successfully.'
        ]);
    }
}
