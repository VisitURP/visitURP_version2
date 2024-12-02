<?php

namespace App\Http\Controllers;

use App\Models\visitorP;
use App\Models\visitV;
use App\Models\VisitGroup;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
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
            'gender' => 'nullable','in:' . implode(',', [visitorP::TYPE1, visitorP::TYPE2, visitorP::TYPE3]),
            'fk_id_visitGroup' => ['nullable', 'exists:visit_groups,id_visitGroup'],
            'chosenDate' => ['nullable', 'date_format:d/m/Y'],
        ]);

        // Validación adicional
        if (empty($validatedData['fk_id_visitGroup']) && empty($validatedData['chosenDate'])) {
            return response()->json(['error' => 'Debe proporcionar un grupo de visita o una fecha elegida.'], 422);
        }
        
        // Verifica si el visitante ya existe (basado en el email o documento)
        $existingVisitor = VisitorP::where('email', $request->input('email'))
        ->orWhere('docNumber', $request->input('docNumber'))
        ->first();

        if ($existingVisitor) {
        // Si el visitante ya existe, actualiza sus datos
        $existingVisitor->update(array_filter($validatedData));

            // Crear nueva visita relacionada para el visitante actualizado
            $visitP = visitV::create([
            'fk_id_visitor' => $existingVisitor->id_visitorP,
            'visitor_type' => 'P',
            'fk_id_semester' => $this->assignSemester($this->determineVisitDate($validatedData)),
            ]);

        // Retorna los datos del visitante existente y su nueva visita
            return response()->json([
            'isNewVisitor' => false,
            'visitorP' => $existingVisitor,
            'visitP' => $visitP,
            ]);
        } else {
        // Si el visitante no existe, crea uno nuevo
        $visitorP = VisitorP::create($validatedData);

        // Crear nueva visita relacionada para el visitante recién creado
        $visitP = VisitP::create([
        'fk_id_visitor' => $visitorP->id_visitorP,
        'visitor_type' => 'P',
        'fk_id_semester' => $this->assignSemester($this->determineVisitDate($validatedData)),
        ]);

        // Retorna los datos del nuevo visitante y su visita
        return response()->json([
        'isNewVisitor' => true,
        'visitorP' => $visitorP,
        'visitP' => $visitP,
        ], 201);
        }
    }

    // Método para determinar la fecha de la visita
    private function determineVisitDate(array $validatedData)
    {
        if (!empty($validatedData['fk_id_visitGroup'])) {
            // Si tiene un grupo de visita, usamos la fecha del grupo
            $visitGroup = VisitGroup::findOrFail($validatedData['fk_id_visitGroup']);
            // Asegúrate de que la fecha esté en formato Y-m-d
            return Carbon::parse($visitGroup->dayOfVisit)->format('Y-m-d');
        }

        // Si no tiene un grupo de visita, usamos la fecha elegida por el visitante
        if (!empty($validatedData['chosenDate'])) {
            // Asegúrate de que la fecha esté en formato Y-m-d
            return Carbon::parse($validatedData['chosenDate'])->format('Y-m-d');
        }

        return null; // Si no hay fecha, retornamos null
    }

    public function assignSemester($createdAt)
    {
        // Asegúrate de que la fecha esté en el formato correcto
        try {
            // Si la fecha ya está en formato Y-m-d, no es necesario hacer la conversión
            $createdAt = Carbon::parse($createdAt)->format('Y-m-d');
        } catch (\Exception $e) {
            Log::error("Error al parsear la fecha: {$createdAt}. Mensaje de error: " . $e->getMessage());
            return null; // Si ocurre un error, retorna null
        }

        Log::info("Asignando semestre para la fecha: {$createdAt}");

        $semester = Semester::where('semesterFrom', '<=', $createdAt)
            ->where('semesterTo', '>=', $createdAt)
            ->orderBy('semesterFrom', 'asc')
            ->first();

        if ($semester) {
            Log::info("Semestre encontrado: {$semester->semesterName}");
            return $semester->semesterName; // Devuelve el nombre del semestre
        } else {
            Log::warning("No se encontró un semestre para la fecha: {$createdAt}");
            return null; 
        }
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
        // Validación
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
            'gender' => 'nullable','in:' . implode(',', [visitorP::TYPE1, visitorP::TYPE2, visitorP::TYPE3]),
            'fk_id_visitGroup' => ['nullable', 'exists:visit_groups,id_visitGroup'],
            'chosenDate' => ['nullable', 'date_format:d/m/Y'], 
        ]);

        // Buscar al visitante
        $visitorP = visitorP::findOrFail($visitorP);

        // Actualizar los campos solo si están presentes
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

        // Si el campo 'chosenDate' está presente, actualizarlo
        if ($request->filled('chosenDate')) {
            $visitorP->chosenDate = Carbon::createFromFormat('d/m/Y', $request->input('chosenDate'))->format('Y-m-d');
        }

        // Si el campo 'fk_id_visitGroup' está presente, actualizarlo
        if ($request->filled('fk_id_visitGroup')) {
            $visitorP->fk_id_visitGroup = $request->input('fk_id_visitGroup');
        }

        // Guardar los cambios
        $visitorP->save();

        return response()->json([
            'Message' => 'Data successfully updated.',
            'Physical Visitor' => $visitorP
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
