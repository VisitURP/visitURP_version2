<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Ubigeo;
use Illuminate\Support\Facades\Storage;

class ImportController extends Controller
{
    public function importUbigeos(Request $request)
    {
        $path = 'public/TB_UBIGEOS.csv';

        if (Storage::exists($path)) {
            $file = Storage::path($path);
            // Abre el archivo en modo de lectura
            if (($handle = fopen($file, 'r')) !== false) {
                // Lee cada línea del archivo CSV
                while (($data = fgetcsv($handle, 1000, ';')) !== false) {
                    // El formato de las columnas es:
                    // [0] => id, [1] => ubigeo_reniec, [2] => ubigeo_inei, 
                    //[3] => departamento_inei, [4] => departamento, 
                    //[5] => provincia_inei, [6] => provincia, 
                    //[7] => distrito, etc.

                    // Primer nivel: Departamento
                    $cod_Departamento = substr($data[1], 0, 2) . '0000';
                    $UbigeoName_Departamento = $data[4]; // Nombre del departamento

                    if (is_numeric($cod_Departamento) && strlen($cod_Departamento) === 6) {
                        Ubigeo::updateOrCreate(
                            ['cod_Ubigeo' => $cod_Departamento],
                            ['UbigeoName' => $UbigeoName_Departamento]
                        );
                    }
                    

                    // Segundo nivel: Provincia
                    $cod_Provincia = substr($data[1], 0, 4) . '00';
                    $UbigeoName_Provincia = $data[6]; // Nombre de la Provincia

                    if (is_numeric($cod_Provincia) && strlen($cod_Provincia) === 6) {
                        Ubigeo::updateOrCreate(
                            ['cod_Ubigeo' => $cod_Provincia],
                            ['UbigeoName' => $UbigeoName_Provincia]
                        );
                    }

                    // Tercer nivel: Distrito
                    $cod_Distrito = $data[1]; // Código completo
                    $UbigeoName_Distrito =  $data[7]; 

                    if (is_numeric($cod_Distrito) && strlen($cod_Distrito) === 6) {
                        Ubigeo::updateOrCreate(
                            ['cod_Ubigeo' => $cod_Distrito],
                            ['UbigeoName' => $UbigeoName_Distrito]
                        );
                    }
                }

                fclose($handle); // Cierra el archivo
            }

            return response()->json(['message' => 'Ubigeos importados correctamente.']);
        }

        return response()->json(['message' => 'Por favor sube un archivo CSV.'], 400);
        }
        
}
