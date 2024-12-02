<?php

namespace App\Http\Controllers;

use App\Models\VisitorInfoXApplicant;
use App\Models\VisitorV;
use App\Models\visitorP;
use App\Models\visitV;
use App\Models\VisitGroup;
use App\Models\Semester;
use App\Models\VisitVDetail;
use App\Models\BuiltArea;
use App\Models\Ubigeo;
use Illuminate\Support\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class VisitorInfoXApplicantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getVisitsforToday()
    {
        // Definir la fecha actual
        $today = Carbon::today()->toDateString();

        // Crear la consulta de la visita con Eager Loading para la relación builtArea
        $visits = VisitGroup::with('builtAreas') // Cargar la relación builtArea
            ->where('dayOfVisit', $today)
            ->get();

        // Formatear la respuesta para que solo contenga los campos requeridos
        $formattedVisits = $visits->map(function ($visit) {
            return [
                'nameGroup' => $visit->nameGroup,
                'guide' => $visit->guide,
                'quantity' => $visit->quantity,                
                'Places To visit' => $visit->builtAreas->map(function ($builtArea) {
                    return [
                        'builtAreaName' => $builtArea->builtAreaName,
                    ];
                }),
            ];
        });

        // Retornar los resultados como JSON
        return response()->json($formattedVisits);
    }

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

    public function getVisitorsAdmitted()
    {
        
        // Sumar ambos
        $totalVisitors =  VisitorInfoXApplicant::whereNot('visitor_type', 'NV') 
        ->count();

         // Contar visitantes con fk_id_applicant y fk_id_visitor
         //loa postulantes que fueron visitantes
        $visitorAndApplicantCount = VisitorInfoXApplicant::whereNotNull('fk_id_applicant')
        ->WhereNotNull('fk_id_visitor')
        ->count();

        
       // Contar visitantes admitidos
        $admittedCounts = VisitorInfoXApplicant::whereNotNull('fk_id_applicant')
            ->WhereNotNull('fk_id_visitor')
            ->where('admitted', 1)
            ->count();

    return response()->json([
        'visitorCounts' => $totalVisitors,
        'postulantes que fueron visitantes count' => $visitorAndApplicantCount,
        'admittedCounts' => $admittedCounts,
    ]);
    }

    public function filterVisitsByVisitorV($fk_id_visitor)
    {
        // Buscar las visitas asociadas al visitante
        $visits = visitV::where('fk_id_visitor', $fk_id_visitor)->where('visitor_type', 'V')->get();

        // Si no hay visitas, retornar un mensaje
        if ($visits->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No visits found for the given visitor ID.',
            ], 404);
        }

        // Retornar las visitas encontradas
        return response()->json([
            'success' => true,
            'data' => $visits,
        ]);
    }

    public function filterVisitDetailsByVisit($fk_id_visitV)
    {
        // Buscar las visitas asociadas al visitante
        $visitsDetails = VisitVDetail::where('fk_id_visitV', $fk_id_visitV)->where('kindOfEvent','V')->get();

        // Si no hay visitas, retornar un mensaje
        if ($visitsDetails->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No visits found for the given visitor ID.',
            ], 404);
        }

        // Retornar las visitas encontradas
        return response()->json([
            'success' => true,
            'data' => $visitsDetails,
        ]);
    }

    public function filterVisitsByVisitorP($fk_id_visitor)
    {
        // Buscar las visitas asociadas al visitante
        $visits = visitV::where('fk_id_visitor', $fk_id_visitor)->where('visitor_type', 'P')->get();

        // Si no hay visitas, retornar un mensaje
        if ($visits->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No visits found for the given visitor ID.',
            ], 404);
        }

        // Retornar las visitas encontradas
        return response()->json([
            'success' => true,
            'data' => $visits,
        ]);
    }

    public function getVirtualVisitorsfromVisitorInfo()
    {
        // Inicializar el array para almacenar los visitantes virtuales
        $virtualVisitors = [];

        // Obtener los visitantes virtuales
        $virtualVisitorsData = VisitorInfoXApplicant::where('visitor_type', 'V')->get();
        foreach ($virtualVisitorsData as $visitorInfo) {
            // Obtener el visitante virtual usando fk_id_visitor
            $visitor = VisitorV::find($visitorInfo->fk_id_visitor);
            if ($visitor) {
                // Agregar el visitante virtual a la lista
                $virtualVisitors[] = [
                    'id_visitorV' => $visitor->id_visitorV,
                    'name' => $visitor->name,
                    'lastName' => $visitor->lastName,
                    'email' => $visitor->email,
                    'fk_docType_id' => $visitor->fk_docType_id,
                    'documentNumber' => $visitor->documentNumber,
                    'phone' => $visitor->phone,
                    'cod_Ubigeo' => $visitor->cod_Ubigeo,
                    'educationalInstitution' => $visitor->educationalInstitution,
                    'birthDate' => $visitor->birthDate,
                    'gender' => $visitor->gender,
                ];
            }
        }

        // Obtener los visitantes de tipo Both (virtual + físico) y agregarlos a la lista de visitantes virtuales
        $bothVisitors = VisitorInfoXApplicant::where('visitor_type', 'B')->get();
        foreach ($bothVisitors as $visitorInfo) {
            // Desconcatenar el fk_id_visitor usando explode para obtener los dos IDs (virtual y físico)
            $ids = explode('_', $visitorInfo->fk_id_visitor);

            // Acceder a los IDs de los visitantes virtual y físico
            $virtualId = $ids[0]; // ID del visitante virtual

            // Obtener el visitante virtual
            $visitorV = VisitorV::find($virtualId);
            
            if ($visitorV) {
                // Agregar el visitante virtual (del tipo Both) a la lista
                $virtualVisitors[] = [
                    'id_visitorV' => $visitorV->id_visitorV,
                    'name' => $visitorV->name,
                    'lastName' => $visitorV->lastName,
                    'email' => $visitorV->email,
                    'fk_docType_id' => $visitorV->fk_docType_id,
                    'documentNumber' => $visitorV->documentNumber,
                    'phone' => $visitorV->phone,
                    'cod_Ubigeo' => $visitorV->cod_Ubigeo,
                    'educationalInstitution' => $visitorV->educationalInstitution,
                    'birthDate' => $visitorV->birthDate,
                    'gender' => $visitorV->gender,
                ];
            }
            
        }

        usort($virtualVisitors, function($a, $b) {
            return $a['id_visitorV'] <=> $b['id_visitorV'];  // Comparación ascendente
        });

        // Retornar los visitantes virtuales (incluyendo los de tipo Both)
        return response()->json($virtualVisitors);
    }

    public function getPhysicalVisitorsFromInfo()
    {
        // Inicializar el array para almacenar los visitantes presenciales
        $physicalVisitors = [];

        // Obtener los visitantes físicos
        $physicalVisitorsData = VisitorInfoXApplicant::where('visitor_type', 'P')->get();
        foreach ($physicalVisitorsData as $visitorInfo) {
            // Obtener el visitante físico usando fk_id_visitor
            $visitor = VisitorP::find($visitorInfo->fk_id_visitor);
            if ($visitor) {
                // Agregar el visitante físico a la lista
                $physicalVisitors[] = [
                    'id_visitorP' => $visitor->id_visitorP,
                    'name' => $visitor->name,
                    'lastName' => $visitor->lastName,
                    'email' => $visitor->email,
                    'fk_docType_id' => $visitor->fk_docType_id,
                    'docNumber' => $visitor->docNumber,
                    'phone' => $visitor->phone,
                    'cod_Ubigeo' => $visitor->cod_Ubigeo,
                    'educationalInstitution' => $visitor->educationalInstitution,
                    'birthDate' => $visitor->birthDate,
                    'gender' => $visitor->gender,
                ];
            }
        }

        // Obtener los visitantes de tipo Both (virtual + físico) y agregarlos a la lista de visitantes físicos
        $bothVisitors = VisitorInfoXApplicant::where('visitor_type', 'B')->get();
        foreach ($bothVisitors as $visitorInfo) {
            // Desconcatenar el fk_id_visitor usando explode para obtener los dos IDs (virtual y físico)
            $ids = explode('_', $visitorInfo->fk_id_visitor);

            // Acceder a los IDs de los visitantes virtual y físico
            $physicalId = $ids[1]; // ID del visitante físico

            // Obtener el visitante físico
            $visitorP = VisitorP::find($physicalId);
            
            if ($visitorP) {
                // Agregar el visitante físico (del tipo Both) a la lista
                $physicalVisitors[] = [
                    'id_visitorP' => $visitorP->id_visitorP,
                    'name' => $visitorP->name,
                    'lastName' => $visitorP->lastName,
                    'email' => $visitorP->email,
                    'fk_docType_id' => $visitorP->fk_docType_id,
                    'docNumber' => $visitorP->docNumber,
                    'phone' => $visitorP->phone,
                    'cod_Ubigeo' => $visitorP->cod_Ubigeo,
                    'educationalInstitution' => $visitorP->educationalInstitution,
                    'birthDate' => $visitorP->birthDate,
                    'gender' => $visitorP->gender,
                ];
            }
        }

        usort($physicalVisitors, function($a, $b) {
            return $a['id_visitorP'] <=> $b['id_visitorP'];  // Comparación ascendente
        });

        // Retornar los visitantes presenciales (incluyendo los de tipo Both)
        return response()->json($physicalVisitors);
    }



    public function getVisitsWithDetailsByBuiltArea()
{
    // Obtener todas las áreas construidas
    $builtAreas = BuiltArea::all(['id_builtArea', 'BuiltAreaName']);

    // Inicializar los resultados con cada área
    $areaVisitDetails = [];
    foreach ($builtAreas as $area) {
        $areaVisitDetails[$area->id_builtArea] = [
            'name' => $area->BuiltAreaName,
            'visit_count' => 0,
            'visitors' => [] // Aquí almacenaremos los visitantes
        ];
    }

    // Contar y agregar detalles de visitantes virtuales
    $virtualVisitors = VisitorInfoXApplicant::where('visitor_type', 'V')->get();
    foreach ($virtualVisitors as $visitorInfo) {
        $visitor = VisitorV::find($visitorInfo->fk_id_visitor);
        if ($visitor) {
            $details = VisitVDetail::where('fk_id_visitorV', $visitor->id_visitorV)->get();
            foreach ($details as $detail) {
                if (isset($areaVisitDetails[$detail->fk_id_builtArea])) {
                    $areaVisitDetails[$detail->fk_id_builtArea]['visit_count']++;
                    $areaVisitDetails[$detail->fk_id_builtArea]['visitors'][] = [
                        'name' => $visitor->name,
                        'lastName' => $visitor->lastName,
                        'email' => $visitor->email,
                        'phone' => $visitor->phone
                    ];
                }
            }
        }
    }

    // Contar y agregar detalles de visitantes físicos
    $physicalVisitors = VisitorInfoXApplicant::where('visitor_type', 'P')->get();
    foreach ($physicalVisitors as $visitorInfo) {
        $visitor = VisitorP::find($visitorInfo->fk_id_visitor);
        if ($visitor) {
            $details = VisitVDetail::where('fk_id_visitorV', $visitor->id_visitorP)->get();
            foreach ($details as $detail) {
                if (isset($areaVisitDetails[$detail->fk_id_builtArea])) {
                    $areaVisitDetails[$detail->fk_id_builtArea]['visit_count']++;
                    $areaVisitDetails[$detail->fk_id_builtArea]['visitors'][] = [
                        'name' => $visitor->name,
                        'lastName' => $visitor->lastName,
                        'email' => $visitor->email,
                        'phone' => $visitor->phone
                    ];
                }
            }
        }
    }

    // Contar y agregar detalles de visitantes combinados (Both)
    $BothVisitors = VisitorInfoXApplicant::where('visitor_type', 'B')->get();
    foreach ($BothVisitors as $visitorInfo) {
        $ids = explode('_', $visitorInfo->fk_id_visitor);
        $virtualId = $ids[0];
        $physicalId = $ids[1];

        $visitorV = VisitorV::find($virtualId);
        $visitorP = VisitorP::find($physicalId);

        if ($visitorV) {
            $details = VisitVDetail::where('fk_id_visitorV', $visitorV->id_visitorV)->get();
            foreach ($details as $detail) {
                if (isset($areaVisitDetails[$detail->fk_id_builtArea])) {
                    $areaVisitDetails[$detail->fk_id_builtArea]['visit_count']++;
                    $areaVisitDetails[$detail->fk_id_builtArea]['visitors'][] = [
                        'name' => $visitorV->name,
                        'lastName' => $visitorV->lastName,
                        'email' => $visitorV->email,
                        'phone' => $visitorV->phone
                    ];
                }
            }
        }

        if ($visitorP) {
            $details = VisitVDetail::where('fk_id_visitorV', $visitorP->id_visitorP)->get();
            foreach ($details as $detail) {
                if (isset($areaVisitDetails[$detail->fk_id_builtArea])) {
                    $areaVisitDetails[$detail->fk_id_builtArea]['visit_count']++;
                    $areaVisitDetails[$detail->fk_id_builtArea]['visitors'][] = [
                        'name' => $visitorP->name,
                        'lastName' => $visitorP->lastName,
                        'email' => $visitorP->email,
                        'phone' => $visitorP->phone
                    ];
                }
            }
        }
    }

    // // Imprimir resultados
    // foreach ($areaVisitDetails as $id => $data) {
    //     echo "Área: {$data['name']} (ID: $id) - Visitas: {$data['visit_count']}\n";
    //     foreach ($data['visitors'] as $visitor) {
    //         echo "    Visitante: {$visitor['name']} - Email: {$visitor['email']} - Teléfono: {$visitor['phone']}\n";
    //     }
    // }

    // Retornar como JSON (opcional)
    return response()->json($areaVisitDetails);
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
            if ($visitor && $visitor->cod_Ubigeo === $ubigeocode ) {
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

        public function getVisitorsFromLima()
    {
        $counter = 0;

        
        // Contar visitantes virtuales
        $virtualVisitors = VisitorInfoXApplicant::where('visitor_type', 'V')->get();
        foreach ($virtualVisitors as $visitorInfo) {
            // Obtener el visitante virtual usando el fk_id_visitor
            $visitor = VisitorV::find($visitorInfo->fk_id_visitor);
            if ($visitor && str_starts_with($visitor->cod_Ubigeo, '1401') ) {
                $counter++;
            }
        }

        // Contar visitantes físicos
        $physicalVisitors = VisitorInfoXApplicant::where('visitor_type', 'P')->get();
        foreach ($physicalVisitors as $visitorInfo) {
        // Obtener el visitante físico usando el fk_id_visitor
        $visitor = visitorP::find($visitorInfo->fk_id_visitor);
        if ($visitor && str_starts_with($visitor->cod_Ubigeo, '1401')) {
            $counter++;
            }
       }

       // Contar visitantes both
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
        
            if (str_starts_with($visitorV->cod_Ubigeo, '1401')) {
                $counter++;
            } elseif (str_starts_with($visitor->cod_Ubigeo, '1401')) {
                $counter++;
            }        
        
       }

        // Retornar el conteo en formato JSON
            return response()->json(['total_visitorsfromLima' => $counter]);
        }

        

   public function CountVisitorsByDistrictfromLima()
{
    // Obtener todas las regiones de Lima Metropolitana (donde cod_Ubigeo empieza con '1401')
    $regions = Ubigeo::where('cod_Ubigeo', 'like', '1401%')->get(['cod_Ubigeo', 'UbigeoName']);

    // Inicializar el conteo por región
    $regionCount = [];
    foreach ($regions as $region) {
        $regionCount[$region->cod_Ubigeo] = [
            'name' => $region->UbigeoName,
            'count' => 0
        ];
    }

    // Procesar visitantes virtuales
    $virtualVisitors = VisitorInfoXApplicant::where('visitor_type', 'V')->get();
    foreach ($virtualVisitors as $visitorInfo) {
        $visitor = VisitorV::find($visitorInfo->fk_id_visitor);
        if ($visitor && str_starts_with($visitor->cod_Ubigeo, '1401')) {
            $regionCount[$visitor->cod_Ubigeo]['count']++;
        }
    }

    // Procesar visitantes físicos
    $physicalVisitors = VisitorInfoXApplicant::where('visitor_type', 'P')->get();
    foreach ($physicalVisitors as $visitorInfo) {
        $visitor = VisitorP::find($visitorInfo->fk_id_visitor);
        if ($visitor && str_starts_with($visitor->cod_Ubigeo, '1401')) {
            $regionCount[$visitor->cod_Ubigeo]['count']++;
        }
    }

    // Procesar visitantes mixtos
    $bothVisitors = VisitorInfoXApplicant::where('visitor_type', 'B')->get();
    foreach ($bothVisitors as $visitorInfo) {
        $ids = explode('_', $visitorInfo->fk_id_visitor);
        $virtualId = $ids[0];
        $physicalId = $ids[1];

        $visitorV = VisitorV::find($virtualId);
        $visitorP = VisitorP::find($physicalId);

        if ($visitorV && str_starts_with($visitorV->cod_Ubigeo, '1401')) {
            $regionCount[$visitorV->cod_Ubigeo]['count']++;
        }
        if ($visitorP && str_starts_with($visitorP->cod_Ubigeo, '1401')) {
            $regionCount[$visitorP->cod_Ubigeo]['count']++;
        }
    }

    return response()->json($regionCount);
}

public function CountApplicantsAdmittedByDistrictfromLima()
{
    // Obtener todas las regiones de Lima Metropolitana (donde cod_Ubigeo empieza con '1401')
    $regions = Ubigeo::where('cod_Ubigeo', 'like', '1401%')->get(['cod_Ubigeo', 'UbigeoName']);

    // Inicializar el conteo por región
    $regionCount = [];
    foreach ($regions as $region) {
        $regionCount[$region->cod_Ubigeo] = [
            'cod_Ubigeo' => $region->cod_Ubigeo,
            'name' => $region->UbigeoName,
            'count' => 0,        // Total de registros (aplicantes)
            'applicants' => 0,   // Total de postulantes
            'admitted' => 0      // Total de ingresados
        ];
    }

    // Obtener todos los aplicantes válidos
    $applicants = VisitorInfoXApplicant::whereNotNull('fk_id_visitor')
        ->whereNotNull('fk_id_applicant')
        ->get();

    foreach ($applicants as $applicant) {
        // Obtener información del aplicante basado en el tipo de visitante (V, P, B)
        $visitor = null;
        if ($applicant->visitor_type === 'V') {
            $visitor = VisitorV::find($applicant->fk_id_visitor);
        } elseif ($applicant->visitor_type === 'P') {
            $visitor = VisitorP::find($applicant->fk_id_visitor);
        } elseif ($applicant->visitor_type === 'B') {
            $ids = explode('_', $applicant->fk_id_visitor);
            $virtualId = $ids[0];
            $physicalId = $ids[1];

            $visitorV = VisitorV::find($virtualId);
            $visitorP = VisitorP::find($physicalId);

            // Contar ambas partes del visitante mixto
            if ($visitorV && str_starts_with($visitorV->cod_Ubigeo, '1401')) {
                $regionCount[$visitorV->cod_Ubigeo]['count']++;
                $regionCount[$visitorV->cod_Ubigeo]['applicants']++;
                if ($applicant->admitted) {
                    $regionCount[$visitorV->cod_Ubigeo]['admitted']++;
                }
            }

            if ($visitorP && str_starts_with($visitorP->cod_Ubigeo, '1401')) {
                $regionCount[$visitorP->cod_Ubigeo]['count']++;
                $regionCount[$visitorP->cod_Ubigeo]['applicants']++;
                if ($applicant->admitted) {
                    $regionCount[$visitorP->cod_Ubigeo]['admitted']++;
                }
            }
            continue; // Saltar al siguiente aplicante
        }

        // Procesar aplicantes virtuales y presenciales
        if ($visitor && str_starts_with($visitor->cod_Ubigeo, '1401')) {
            $regionCount[$visitor->cod_Ubigeo]['count']++;
            $regionCount[$visitor->cod_Ubigeo]['applicants']++;
            if ($applicant->admitted) {
                $regionCount[$visitor->cod_Ubigeo]['admitted']++;
            }
        }
    }

    // Convertir el array asociativo en uno indexado y ordenarlo por cod_Ubigeo
    $sortedRegions = array_values($regionCount);
    usort($sortedRegions, function ($a, $b) {
        return $a['cod_Ubigeo'] <=> $b['cod_Ubigeo'];
    });

    return response()->json($sortedRegions);
}




    public function getMostVisitedBuiltAreas()
    {
        // Obtener las áreas construidas más visitadas con sus nombres
        $mostVisitedBuiltAreas = VisitVDetail::select('fk_id_builtArea', DB::raw('COUNT(*) as visit_count'))
            ->groupBy('fk_id_builtArea')
            ->orderBy('visit_count', 'desc')
            ->get();

        // Cargar los nombres de las áreas construidas usando relaciones (asumiendo que tienes el modelo relacionado)
        foreach ($mostVisitedBuiltAreas as $area) {
            $builtArea = BuiltArea::find($area->fk_id_builtArea); // Relación al modelo BuiltArea
            $area->builtAreaName = $builtArea ? $builtArea->builtAreaName : 'Área desconocida'; // Manejo de nombres
        }

        // Imprimir resultados
        foreach ($mostVisitedBuiltAreas as $area) {
            // echo "Área: {$area->builtAreaName} - Visitas: {$area->visit_count}\n";
            return response()->json("Área: {$area->builtAreaName} - Visitas: {$area->visit_count}\n");
        }

        // // Retornar como JSON (opcional)
        // return response()->json($mostVisitedBuiltAreas);
    }

    public function getVisitsByBuiltArea()
{
    // Obtener todas las áreas construidas
    $builtAreas = BuiltArea::all(['id_builtArea', 'BuiltAreaName']);

    // Inicializar el resultado con cada área y un conteo de visitas en 0
    $areaVisitCounts = [];
    foreach ($builtAreas as $area) {
        $areaVisitCounts[$area->id_builtArea] = [
            'name' => $area->BuiltAreaName,
            'visit_count' => 0
        ];
    }

    // Contar las visitas por área construida
    $visitCounts = VisitVDetail::select('fk_id_builtArea', DB::raw('COUNT(*) as visit_count'))
        ->groupBy('fk_id_builtArea')
        ->get();

    // Actualizar los conteos en el resultado
    foreach ($visitCounts as $count) {
        if (isset($areaVisitCounts[$count->fk_id_builtArea])) {
            $areaVisitCounts[$count->fk_id_builtArea]['visit_count'] = $count->visit_count;
        }
    }

    // // Imprimir los resultados
    // foreach ($areaVisitCounts as $id => $data) {
    //     echo "Área: {$data['name']} (ID: $id) - Visitas: {$data['visit_count']}\n";
    // }

    // Retornar como JSON (opcional)
    return response()->json($areaVisitCounts);
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
