<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\VisitorInfoXapplicant;
use App\Models\VisitorV;
use App\Models\visitorP;
use App\Models\Applicant;

class SyncVisitorInfoXApplicant extends Command
{
    protected $signature = 'sync:visitor-infoXapplicant';
    protected $description = 'Sync Applicant x Visitor Info without duplicates';

    public function handle()
    {
        $this->info('Iniciando la sincronización...');

    // Traer y ordenar los registros de VisitorV, VisitorP y Applicant
    $visitorVList = VisitorV::whereNotNull('documentNumber')->where('documentNumber', '!=', '')
    ->orderBy('documentNumber')
    ->get();
    $this->info('' . $visitorVList );
    $visitorPList = visitorP::whereNotNull('docNumber')->where('docNumber', '!=', '')
    ->orderBy('docNumber')->get();
    $this->info('' . $visitorPList );

    $applicants = Applicant::whereNotNull('documentNumber')->where('documentNumber', '!=', '')
    ->orderBy('documentNumber')->get();

    // Lista para almacenar documentos únicos con tres parámetros
    $uniqueDocs = [];

    // Punteros para las listas
    $recorrerlista = 0;
    $vPointer = 0;
    $pPointer = 0;

    while ($vPointer < count($visitorVList) || $pPointer < count($visitorPList)) {
        // Asegúrate de que $vPointer y $pPointer están dentro de los límites
        $docV = $vPointer < count($visitorVList) ? $visitorVList[$vPointer]->documentNumber : null;
        $this->info("Puntero pPointer: {$vPointer}, Total visitorVList: " . count($visitorVList));
        
        $this->info("Puntero pPointer: {$pPointer}, Total visitorPList: " . count($visitorPList));
        $docP = $pPointer < count($visitorPList) ? $visitorPList[$pPointer]->docNumber : null;

        // $this->info("docV: {$docV} como virtual (V)");
        // $this->info("docP: {$docP} como virtual (V)");

        // Lógica de comparación
        if ($docV !== null && ($docP === null || $docV < $docP)) {

            // Agregar visitante virtual
            $uniqueDocs[$recorrerlista] = [
                'document' => $docV,
                'fk_id_visitor' => $visitorVList[$vPointer]->id_visitorV,
                'visitor_type' => 'V',
            ];
            $this->info("Agregado: {$docV} como virtual (V)");
           

            $recorrerlista++;
            $vPointer++;

            $this->info("recorrerlista: {$recorrerlista} como virtual (V)");
            $this->info("vPointer: {$vPointer} como virtual (V)");

        } elseif ($docP !== null && ($docV === null || $docP < $docV)) {
            // Agregar visitante físico
            $uniqueDocs[$recorrerlista] = [
                'document' => $docP,
                'fk_id_visitor' => $visitorPList[$pPointer]->id_visitorP,
                'visitor_type' => 'P',
            ];
            $this->info("Agregado: {$docP} como físico (P)");
            $recorrerlista++;
            $pPointer++;

            $this->info("recorrerlista: {$recorrerlista} como virtual (V)");
            $this->info("pPointer: {$pPointer} como Presencial (P)");
        } elseif ($docV === $docP) {
            // Agregar ambos
            $id_visitorVP = $visitorVList[$vPointer]->id_visitorV . '_' . $visitorPList[$pPointer]->id_visitorP;
            $uniqueDocs[$recorrerlista] = [
                'document' => $docV,
                'fk_id_visitor' => $id_visitorVP,
                'visitor_type' => 'B',
            ];
            $this->info("Agregado: {$docV} como ambos (B)");
            $recorrerlista++;
            $vPointer++;
            $pPointer++;

            $this->info("recorrerlista: {$recorrerlista} como virtual (V)");
            $this->info("pPointer: {$pPointer} como Presencial (P)");
            $this->info("vPointer: {$vPointer} como virtual (V)");

            
        }
    }
    
    // Añadir elementos restantes de visitorVList si visitorPList termina primero
    while ($vPointer < count($visitorVList)) {
        $docV = $visitorVList[$vPointer]->documentNumber;
        $uniqueDocs[$recorrerlista] = [
            'document' => $docV,
            'fk_id_visitor' => $visitorVList[$vPointer]->id_visitorV,
            'visitor_type' => 'V',
        ];
        $this->info("Agregado restante: {$docV} como virtual (V)");
        $recorrerlista++;
        $vPointer++;

        $this->info("recorrerlista: {$recorrerlista} como virtual (V)");
        $this->info("vPointer: {$vPointer} como virtual (V)");
    }

    // Añadir elementos restantes de visitorPList si visitorVList termina primero
    while ($pPointer < count($visitorPList)) {
        $docP = $visitorPList[$pPointer]->docNumber;
        $uniqueDocs[$recorrerlista] = [
            'document' => $docP,
            'fk_id_visitor' => $visitorPList[$pPointer]->id_visitorP,
            'visitor_type' => 'P',
        ];
        $this->info("Agregado restante: {$docP} como físico (P)");
        $recorrerlista++;
        $pPointer++;

        $this->info("recorrerlista: {$recorrerlista} como virtual (V)");
        $this->info("pPointer: {$pPointer} como Presencial (P)");
    }
    
    // Sincronización de UniqueDocs y Applicants
$uniqueIndex = 0;
$aPointer = 0;

while ($aPointer < count($applicants) || $uniqueIndex < count($uniqueDocs)) {
    $docA = $aPointer < count($applicants) ? $applicants[$aPointer]->documentNumber : null;
    $uniqueDoc = $uniqueIndex < count($uniqueDocs) ? $uniqueDocs[$uniqueIndex] : null;
    $docU = $uniqueDoc['document'] ?? null;

    if ($docA !== null && ($docU === null || $docA < $docU)) {
        // Procesa `applicant` si su documento es menor
        $this->updateOrCreateVisitorInfo($applicants[$aPointer], null);
        $aPointer++;
        $this->info("docA: {$docA} ");
        $this->info("docU: {$docU} ");            
        $this->info("Aplicante agregado: {$docA}");


    } elseif ($docU !== null && ($docA === null || $docU < $docA)) {
        // Procesa `uniqueDoc` si su documento es menor
        $this->updateOrCreateVisitorInfo(null, $uniqueDoc);
        $uniqueIndex++;
        
        $this->info("docU: {$docU} ");
        $this->info("docA: {$docA} ");
        $this->info("visitante agregado: {$docU}");


    } elseif ($docA === $docU) {
        // Coincidencia exacta
        $this->updateOrCreateVisitorInfo($applicants[$aPointer], $uniqueDoc);
        $uniqueIndex++;
        $aPointer++;
        $this->info("coincidencia agregada: {$docU}");

    }
}

            while ($uniqueIndex < count($uniqueDocs)) {
            // Aquí podrías manejar el caso en que los uniqueDocs se han agotado
            $this->updateOrCreateVisitorInfo(null, $uniqueDocs[$uniqueIndex]);
                    
            $uniqueIndex++;
            
            $this->info("uniqueIndex: {$uniqueIndex} ");
            $this->info("docA: {$docA} ");
            $this->info("aPointer: {$aPointer}");
                    
        }
            
            
            while ($aPointer < count($applicants)) {
            $docA = $applicants[$aPointer]->documentNumber;
           
            
            // Registrar en VisitorInfoXapplicant si el aplicante no coincide con ningún visitante
            // Si es necesario, podrías hacer una verificación adicional aquí
            $this->updateOrCreateVisitorInfo($applicants[$aPointer], null); // Asumiendo que la función permite un segundo parámetro nulo
            
                    $this->info("Aplicante agregado: {$docA}");
                    $aPointer++;
                
        }
    }
            
            protected function updateOrCreateVisitorInfo($applicant, $uniqueDoc)
            {
                // Verificar si el documento único es nulo o no tiene `fk_id_visitor`
                if (is_null($uniqueDoc) || !isset($uniqueDoc['fk_id_visitor'])) {
                
                    VisitorInfoXapplicant::firstOrCreate(
                        [
                            'fk_id_applicant' => $applicant->id_applicant,
                            'fk_id_visitor' => null,
                        ],
                        [
                            'visitor_type' => 'NV',
                            'admitted' => $applicant->admitted,
                        ]
                    );
                }

                VisitorInfoXapplicant::firstOrCreate(
                    [
                        'fk_id_applicant' => $applicant->id_applicant ?? null,
                        'fk_id_visitor' => $uniqueDoc['fk_id_visitor'] ?? null,
                    ],
                    [
                        'visitor_type' => $uniqueDoc['visitor_type'] ?? 'NV',
                        'admitted' => $applicant->admitted ?? false,
                    ]
                );

               
            }

    }         



