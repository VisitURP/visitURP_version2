<?php

namespace App\Http\Controllers;

use App\Models\docType;
use Illuminate\Http\Request;

class DocTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $docTypes = docType::get();
        $data = $docTypes->map(function($docType){
            return [
                'id_docType' => $docType -> id_docType,
                'docTypeName' => $docType -> docTypeName           
            ];
        });

        //pequeña modificacion
        return response()->json(
            $data
        );
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
            'docTypeCode' => ['required']
        ]);

        $docType_cod = docType::where('docTypeCode', $request-> docTypeCode)->first();
        
        //si existe
        if($docType_cod)
        {
            return response()->json([
                'Message' => 'Ya existe ese código en la tabla.',
            ]); 
        }
        //si es que no
        else
        {
            $request->validate([
                'docTypeName' => ['required', 'max:100'],
                'docTypeCode' => ['required', 'max:100']
            ]);

            $docType = docType::create([
                'docTypeName' => $request['docTypeName'],
                'docTypeCode' => $request['docTypeCode']
            ]);

            return response()->json([
                'Message' => 'Document Type is registered successfully.',
                'Document Type:' => $docType
            ]);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        //
        $docType = docType::findOrFail($id);
        return response()->json([
            $docType
        ] 
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(docType $docType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $docuType)
    {
        $request->validate([
            'docTypeName' => ['required', 'max:100'],
            'docTypeCode' => ['required', 'max:100']
        ]);

        $docuType = docType::findOrFail($docuType);
        $docuType->docTypeName= $request['docTypeName'];
        $docuType->docTypeCode = $request['docTypeCode'];
        $docuType->save();

        return response()->json([
            'Message' => 'Data was updated successfully.',
            'Document Type: ' => $docuType
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $docuType = docType::findOrFail($id);
        $docuType -> delete();

        return response()->json([
            'Message' => 'Data was deleted successfully.'
        ]);
    }
}
