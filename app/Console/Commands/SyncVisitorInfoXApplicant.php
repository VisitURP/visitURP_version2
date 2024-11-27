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

        //EXTRACT
        $this->info('Iniciando la sincronización...');

        $visitorInfoRecords = VisitorInfoXApplicant::all(); // Trae todos los registros

        if ($visitorInfoRecords->isEmpty()) {
            // La tabla está vacía, entonces inicializamos las listas como vacías
            $existingVisitorVIds = [];
            $existingVisitorPIds = [];
            $existingVisitorBothIds = [];
            $existingApplicantIds = [];

        } else {
            // Si no está vacía, procedemos a filtrar según el visitor_type
            $existingVisitorVIds = $visitorInfoRecords
                ->where('visitor_type', 'V')
                ->pluck('fk_id_visitor')
                ->toArray();
        
            $existingVisitorPIds = $visitorInfoRecords
                ->where('visitor_type', 'P')
                ->pluck('fk_id_visitor')
                ->toArray();
        
            $existingVisitorBothIds = $visitorInfoRecords
                ->where('visitor_type', 'B')
                ->pluck('fk_id_visitor') 
                ->toArray();

            $existingApplicantIds = $visitorInfoRecords
                ->where('visitor_type', 'NV')
                ->pluck('fk_id_applicant') 
                ->toArray();    
        }

        // Inicializamos arrays para los IDs a excluir
            $visitorVIdsFromBoth = [];
            $visitorPIdsFromBoth = [];

            // Procesamos los IDs concatenados
            foreach ($existingVisitorBothIds as $idConcatenated) {
                [$visitorVId, $visitorPId] = explode('_', $idConcatenated);

                $visitorVIdsFromBoth[] = $visitorVId;
                $visitorPIdsFromBoth[] = $visitorPId;
            }

            // Filtramos los visitantes tipo 'V'
        $filteredVisitorV = VisitorV::whereNotNull('documentNumber')
        ->where('documentNumber', '!=', '')
        ->whereNotIn('id_visitorV', $existingVisitorVIds) // Excluye visitantes ya registrados como 'V'
        ->whereNotIn('id_visitorV', $visitorVIdsFromBoth) // Excluye visitantes registrados como 'Both'
        ->orderBy('documentNumber')
        ->get();

        // Filtramos los visitantes tipo 'P'
        $filteredVisitorP = visitorP::whereNotNull('docNumber')
        ->where('docNumber', '!=', '')
        ->whereNotIn('id_visitorP', $existingVisitorPIds) // Excluye visitantes ya registrados como 'P'
        ->whereNotIn('id_visitorP', $visitorPIdsFromBoth) // Excluye visitantes registrados como 'Both'
        ->orderBy('docNumber')
        ->get();

        // Filtramos los visitantes tipo 'P'
        $filteredApplicant = Applicant::whereNotNull('documentNumber')
        ->where('documentNumber', '!=', '')
        ->whereNotIn('id_applicant', $existingApplicantIds) // Excluye visitantes ya registrados como 'P'
        ->orderBy('documentNumber')
        ->get();

        foreach($filteredVisitorV as $docs)
        {
            $this->info("Filtered VisitorV: " . $docs['documentNumber']);
            $this->info("_________________ " );

        }

        foreach($filteredVisitorP as $docs)
        {
            $this->info("Filtered VisitorP: " . $docs['docNumber']);
            $this->info("_________________ " );

        }

        foreach($filteredApplicant as $docs)
        {
            $this->info("Filtered Applicant: " . $docs['documentNumber']);
            $this->info("_________________ " );

        }

       


        $this->info("Filtered VisitorV: " . $filteredVisitorV->count());
        $this->info("Filtered VisitorP: " . $filteredVisitorP->count());
        $this->info("Filtered Applicant: " . $filteredApplicant->count());

        

        
        
        //Transform:

        // Lista para almacenar documentos únicos con tres parámetros
        $uniqueDocs = [];

        // Punteros para las listas
        $recorrerlista = 0;
        $vPointer = 0;
        $pPointer = 0;

        while ($vPointer < count($filteredVisitorV) || $pPointer < count($filteredVisitorP)) {
            $docV = $vPointer < count($filteredVisitorV) ? $filteredVisitorV[$vPointer]->documentNumber : 99999999999999999999;
            $docP = $pPointer < count($filteredVisitorP) ? $filteredVisitorP[$pPointer]->docNumber : 99999999999999999999;
        
            if ($docV === $docP) {
                $this->info("Adding in Both: " . $docV);
                $id_visitorVP = $filteredVisitorV[$vPointer]->id_visitorV . '_' . $filteredVisitorP[$pPointer]->id_visitorP;
        
                $uniqueDocs[$recorrerlista] = [
                    'document' => $docV,
                    'fk_id_visitor' => $id_visitorVP,
                    'visitor_type' => 'B',
                ];
        
                $vPointer++;
                $pPointer++;
            } elseif ($docV < $docP) {
                $this->info("Adding VisitorV: " . $docV);
                $uniqueDocs[$recorrerlista] = [
                    'document' => $docV,
                    'fk_id_visitor' => $filteredVisitorV[$vPointer]->id_visitorV,
                    'visitor_type' => 'V',
                ];
        
                $vPointer++;
            } else {
                $this->info("Adding VisitorP: " . $docP);
                $uniqueDocs[$recorrerlista] = [
                    'document' => $docP,
                    'fk_id_visitor' => $filteredVisitorP[$pPointer]->id_visitorP,
                    'visitor_type' => 'P',
                ];
        
                $pPointer++;
            }
        
            $recorrerlista++;
        }

        $this->info("" . $docV);
        $this->info("" . $docP);

        // $this->info("filteredV" . $filteredVisitorV[$vPointer]->documentNumber);
        $this->info("vpointer" . $vPointer);
        // $this->info("filteredP" . $filteredVisitorP[$pPointer]->docNumber);
        $this->info("ppointer" . $pPointer);
        


        foreach($uniqueDocs as $docs)
        {
            $this->info($docs['document']);
            $this->info($docs['fk_id_visitor']);
            $this->info($docs['visitor_type']);
            $this->info('___________________');

        }

        // Sincronización de UniqueDocs y Applicants
        $uniqueIndex = 0;
        $aPointer = 0;

        while ($aPointer < count($filteredApplicant) || $uniqueIndex < count($uniqueDocs)) {
            $docA = $aPointer < count($filteredApplicant) ? $filteredApplicant[$aPointer]->documentNumber : 99999999999999999999;
            $docU = $uniqueIndex < count($uniqueDocs) ? $uniqueDocs[$uniqueIndex]['document'] : 99999999999999999999;
        
            if ($docA === $docU) {
                $this->updateOrCreateVisitorInfo($filteredApplicant[$aPointer], $uniqueDocs[$uniqueIndex]);
                $aPointer++;
                $uniqueIndex++;
            } 
           else if ($docA < $docU) {
                $this->updateOrCreateVisitorInfo($filteredApplicant[$aPointer], null);
                $aPointer++;
            }else{
                $this->updateOrCreateVisitorInfo(null, $uniqueDocs[$uniqueIndex]);
                $uniqueIndex++;
            } 
           
            
        }

        



        // while ($aPointer <= count($filteredApplicant)) {
        //     $docU = $uniqueDocs[$uniqueIndex]['document'];
        //     $docA = $filteredApplicant[$aPointer]->documentNumber;
            
        //     if($aPointer === count($filteredApplicant))
        //     {
        //         $docA = 999999999999999999;
        //     }
        //     if ($uniqueIndex === count($uniqueDocs)){
        //         $docU = 999999999999999999; 
        //     } 
        //     // $docU = $uniqueDocs[$uniqueIndex]['document'] ?? 9999999999999999999;      
        //     if ($docA === $docU) {
        //         $this->updateOrCreateVisitorInfo($filteredApplicant[$aPointer], $uniqueDocs[$uniqueIndex]);
        //         $aPointer++;
        //         $uniqueIndex++;

        //     } elseif ($docA < $docU) {
        //         $this->updateOrCreateVisitorInfo($filteredApplicant[$aPointer], null);
        //         $aPointer++;
        //     } else {
        //         $this->updateOrCreateVisitorInfo(null, $uniqueDocs[$uniqueIndex]);
        //         $uniqueIndex++;
        //     }
    
        // }
   }
            
   protected function updateOrCreateVisitorInfo($applicant, $uniqueDoc)
   {
       // Caso 1: Si `$applicant` es nulo
       if (is_null($applicant) && !is_null($uniqueDoc)) {
           VisitorInfoXapplicant::firstOrCreate(
               [
                   'fk_id_applicant' => null,
                   'fk_id_visitor' => $uniqueDoc['fk_id_visitor'],
               ],
               [
                   'visitor_type' => $uniqueDoc['visitor_type'],
                   'admitted' => false,
               ]
           );
           return;
       }
   
       // Caso 2: Si `$uniqueDoc` es nulo
       if (is_null($uniqueDoc) && !is_null($applicant)) {
           VisitorInfoXapplicant::firstOrCreate(
               [
                   'fk_id_applicant' => $applicant->id_applicant,
                   'fk_id_visitor' => null,
               ],
               [
                   'visitor_type' => 'NV',
                   'admitted' => false,
               ]
           );
           return;
       }
   
       // Caso 3: Ambos están presentes
       if (!is_null($applicant) && !is_null($uniqueDoc)) {
           VisitorInfoXapplicant::firstOrCreate(
               [
                   'fk_id_applicant' => $applicant->id_applicant,
                   'fk_id_visitor' => $uniqueDoc['fk_id_visitor'],
               ],
               [
                   'visitor_type' => $uniqueDoc['visitor_type'],
                   'admitted' => $applicant->admitted,
               ]
           );
       }
   }
   

    }  

   



