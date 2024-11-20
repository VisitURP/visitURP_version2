<?php

namespace App\Http\Controllers;

use App\Models\VisitorInfoXApplicant;
use App\Models\VisitorV;
use App\Models\visitorP;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class VisitorInfoXApplicantController extends Controller
{
    /**
     * Display a listing of the resource.
     */

     public function getTotalVisitors() {
        // Contar visitantes virtuales
        $totalVirtualVisitors = VisitorInfoXApplicant::where('visitor_type', 'V')
        ->orWhere('visitor_type', 'B')
        ->count();

        $totalPhysicalVisitors = VisitorInfoXApplicant::where('visitor_type', 'P') 
        ->orWhere('visitor_type', 'B')
        ->count();

        // Sumar ambos
        $totalVisitors = $totalVirtualVisitors + $totalPhysicalVisitors;
    
        return response()->json(
            $totalVisitors
        );
    }

    public function getVisitorInfosByGender($gender) 
   {
        // Contadores para cada género
        $femaleCount = 0; 
        $maleCount = 0; 
        $naCount = 0; 

        // Contar visitantes virtuales
        $virtualVisitors = VisitorInfoXApplicant::where('visitor_type', 'V')->get();
        foreach ($virtualVisitors as $visitorInfo) {
            // Obtener el género del visitante usando el fk_id_visitor
            $visitor = VisitorV::find($visitorInfo->fk_id_visitor);
            
                if ($visitor->gender === 'F') {
                    $femaleCount++;
                } elseif ($visitor->gender === 'M') {
                    $maleCount++;
                } elseif ($visitor->gender === 'NA') {
                    $naCount++;
                }
            
        }

             // Contar visitantes presenciales
            $physicalVisitors = VisitorInfoXApplicant::where('visitor_type', 'P')->get();
            foreach ($physicalVisitors as $visitorInfo) {
             // Obtener el género del visitante usando el fk_id_visitor
             $visitor = visitorP::find($visitorInfo->fk_id_visitor);
             
                 if ($visitor->gender === 'F') {
                     $femaleCount++;
                 } elseif ($visitor->gender === 'M') {
                     $maleCount++;
                 } elseif ($visitor->gender === 'NA') {
                     $naCount++;
                 }
             
         }

           // Contar visitantes presenciales
           $BothVisitors = VisitorInfoXApplicant::where('visitor_type', 'B')->get();
           foreach ($BothVisitors as $visitorInfo) {
            
            // Obtener el género del visitante usando el fk_id_visitor
            // Desconcatenar usando explode
            $ids = explode('_', $visitorInfo->fk_id_visitor);

            // Acceder a los IDs
            $virtualId = $ids[0]; // 12
            $physicalId = $ids[1]; // 3

            $visitor = VisitorV::find($virtualId);
            
                if ($visitor->gender === 'F') {
                    $femaleCount++;
                } elseif ($visitor->gender === 'M') {
                    $maleCount++;
                } elseif ($visitor->gender === 'NA') {
                    $naCount++;
                }
            
            
        }

        // Retornar el conteo según el género solicitado
        switch ($gender) {
        case 'F':
            return response()->json(['total_visitorsbyGender' => $femaleCount]);
        case 'M':
            return response()->json(['total_visitorsbyGender' => $maleCount]);
        case 'NA':
            return response()->json(['total_visitorsbyGender' => $naCount]);
        }
    }

     public function getAdmittedVisitors()
    {
        // Contar visitantes admitidos
        $admittedCount = DB::table('visitor_info_x_applicants')
        ->where('admitted', 1)
        ->count();

        // Preparar los resultados
        $admittedVisitors = [
        'total_admitted' => $admittedCount
    ];

        return response()->json($admittedVisitors);
    }

    public function getNonAdmittedVisitors()
    {
        // Contar visitantes no admitidos
        $nonAdmittedCount = DB::table('visitor_info_x_applicants')
        ->where('admitted', 0)
        ->count();

        // Preparar los resultados
        $nonAdmittedVisitors = [
        'total_non_admitted' => $nonAdmittedCount
        ];

        return response()->json($nonAdmittedVisitors);
    }

    public function getVisitorsByResidence($ubigeocode)
    {
        $counter = 0;

        // Validar que el código de ubigeo no esté vacío
        if (empty($ubigeocode)) {
            return response()->json(['error' => 'El código de ubigeo no puede estar vacío.'], 400);
        }

        // Contar visitantes virtuales
        $virtualVisitors = VisitorInfoXApplicant::where('visitor_type', 'V')->get();
        foreach ($virtualVisitors as $visitorInfo) {
            // Obtener el visitante virtual usando el fk_id_visitor
            $visitor = VisitorV::find($visitorInfo->fk_id_visitor);
            if ($visitor && $visitor->cod_Ubigeo === $ubigeocode) {
                $counter++;
            }
        }

        // Contar visitantes físicos
        $physicalVisitors = VisitorInfoXApplicant::where('visitor_type', 'P')->get();
        foreach ($physicalVisitors as $visitorInfo) {
        // Obtener el visitante físico usando el fk_id_visitor
        $visitor = visitorP::find($visitorInfo->fk_id_visitor);
        if ($visitor && $visitor->cod_Ubigeo === $ubigeocode) {
            $counter++;
            }
       }

       // Contar visitantes presenciales
       $BothVisitors = VisitorInfoXApplicant::where('visitor_type', 'B')->get();
       foreach ($BothVisitors as $visitorInfo) {
        
        // Obtener el género del visitante usando el fk_id_visitor
        // Desconcatenar usando explode
        $ids = explode('_', $visitorInfo->fk_id_visitor);

        // Acceder a los IDs
        $virtualId = $ids[0]; // 12
        $physicalId = $ids[1]; // 3

        $visitorV = VisitorV::find($virtualId);
        $visitorP = visitorP::find($physicalId);
        
            if ($visitorV->cod_Ubigeo === $ubigeocode) {
                $counter++;
            } elseif ($visitorP->cod_Ubigeo === $ubigeocode) {
                $counter++;
            }        
        
       }

        // Retornar el conteo en formato JSON
            return response()->json(['total_visitorsbyResidence' => $counter]);
        }

    public function getVisitorsBySemester($id_semestre)
    {
        
        // Obtener el semestre por nombre
        $semester = Semester::where('semesterName', $id_semestre)->first();

        // Verificar si el semestre existe
        if (!$semester) {
            return response()->json(['error' => 'semestre no encontrado'], 404);
        }

        // Inicializar contador
        $counter = 0;

        // Contar visitantes virtuales
        $virtualVisitors = VisitorInfoXApplicant::where('visitor_type', 'V')->get();
        foreach ($virtualVisitors as $visitorInfo) {
            // Obtener el género del visitante usando el fk_id_visitor
            $visitor = VisitorV::find($visitorInfo->fk_id_visitor);
            
                if ($visitor->created_at < $semester->until) {
                    $counter++;
                }             
        }

             // Contar visitantes presenciales
            $physicalVisitors = VisitorInfoXApplicant::where('visitor_type', 'P')->get();
            foreach ($physicalVisitors as $visitorInfo) {
             // Obtener el género del visitante usando el fk_id_visitor
             $visitor = visitorP::find($visitorInfo->fk_id_visitor);
             
                 if ($visitor->created_at < $semester->until) {
                     $counter++;
                 } 
             
         }

           // Contar visitantes presenciales
           $BothVisitors = VisitorInfoXApplicant::where('visitor_type', 'B')->get();
           foreach ($BothVisitors as $visitorInfo) {
            
            // Obtener el género del visitante usando el fk_id_visitor
            // Desconcatenar usando explode
            $ids = explode('_', $visitorInfo->fk_id_visitor);

            // Acceder a los IDs
            $virtualId = $ids[0]; // 12
            $physicalId = $ids[1]; // 3

            $visitor = VisitorV::find($virtualId);
            
                if ($visitor->created_at < $semester->until) {
                    $counter++;
                }            
        }      

        // Devolver el resultado en formato JSON
        return response()->json([
            'semester' => $id_semestre,
            'count' => $counter
        ]);

    }

    //  //tengo que adecuarlo
    //  public function getMonthlyPhysicalVisitors(Request $request)
    //  {
    //      // Usa el año actual o el año especificado en la solicitud
    //      $year = $request->query('year', date('Y'));
 
    //      $monthlyVisitors = [];
 
    //      // Bucle para contar visitantes en cada mes del año
    //      for ($month = 1; $month <= 12; $month++) {
    //      $count = visitorP::whereYear('visitDate', $year)
    //                       ->whereMonth('visitDate', $month)
    //                       ->count();
 
    //      // Log para verificar el conteo por mes
    //      Log::info("Contando visitantes para el mes $month en el año $year: $count");
 
    //      $monthlyVisitors[$month] = $count;
    //      }
 
    //      // Retornar el resultado en formato JSON
    //      return response()->json([
    //          'year' => $year,
    //          'monthly_visitors' => $monthlyVisitors
    //      ]);
    //  }



     public function syncVisitorInfoXApplicant(): JsonResponse
    {
        // Llamada al comando usando Artisan
        Artisan::call('sync:visitor-infoXapplicant');

        // Opcional: Capturar el resultado del comando y mostrar en la respuesta
        $output = Artisan::output();

        return response()->json([
            'success' => true,
            'message' => 'Sincronización de VisitorInfoXApplicant ejecutada.',
            'output' => $output, // Muestra la salida del comando (opcional)
        ]);
    }

    public function index()
    {
        $records = VisitorInfoxApplicant::all();
        return response()->json($records);
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
        // Validar el request
        $request->validate([
            'fk_id_applicant' => 'nullable',
            'fk_id_visitor' => 'nullable',
            'visitor_type' => 'nullable|in:' . implode(',', [VisitorInfoXApplicant::TYPE1, VisitorInfoXApplicant::TYPE2, VisitorInfoXApplicant::TYPE3, VisitorInfoXApplicant::TYPE4]),
            'admitted' => 'boolean',
        ]);

        // Verificar si el registro ya existe basado en fk_id_applicant y fk_id_visitor
        $existingRecord = VisitorInfoxApplicant::where('fk_id_applicant', $request->fk_id_applicant)
                            ->where('fk_id_visitor', $request->fk_id_visitor)
                            ->first();

        if ($existingRecord) {
            return response()->json(['message' => 'Registro duplicado'], 409);
        }

        // Crear el nuevo registro
        $newRecord = VisitorInfoxApplicant::create($request->all());
        return response()->json($newRecord, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $record = VisitorInfoxApplicant::find($id);
        if ($record) {
            return response()->json($record);
        } else {
            return response()->json(['message' => 'Registro no encontrado'], 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(VisitorInfoXApplicant $visitorInfoXApplicant)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        $record = VisitorInfoxApplicant::find($id);

        if (!$record) {
            return response()->json(['message' => 'Registro no encontrado'], 404);
        }

        // Validar el request
        $request->validate([
            'visitor_type' => 'nullable|in:V,P,B,NV',
            'admitted' => 'boolean',
        ]);

        // Actualizar el registro
        $record->update($request->all());
        return response()->json($record);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $record = VisitorInfoxApplicant::find($id);

        if (!$record) {
            return response()->json(['message' => 'Registro no encontrado'], 404);
        }

        $record->delete();
        return response()->json(['message' => 'Registro eliminado']);
    }
}
