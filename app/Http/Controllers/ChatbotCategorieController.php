<?php

namespace App\Http\Controllers;

use App\Models\ChatbotCategorie;
use Illuminate\Http\Request;

class ChatbotCategorieController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $details = ChatbotCategorie::all();
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
        $request->validate([
            'categoryCode' => ['required']
        ]);

        $cat_cod = ChatbotCategorie::where('categoryCode', $request-> categoryCode)->first();
        
        //si existe
        if($cat_cod)
        {
            return response()->json([
                'Message' => 'Ya existe ese código en la tabla.',
            ]); 
        }
        //si es que no
        else
        {
            $request->validate([
                'categoryName' => ['required', 'max:100'],
                'categoryCode' => ['required', 'max:100']
            ]);

            $category = ChatbotCategorie::create([
                'categoryName' => $request['categoryName'],
                'categoryCode' => $request['categoryCode']
            ]);

            return response()->json([
                'Message' => 'Chatbot Category is registered successfully.',
                'Chatbot Category:' => $category
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        //
         $category = ChatbotCategorie::findOrFail($id);
        return response()->json([
            $category
        ] 
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ChatbotCategorie $chatbotCategorie)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $category)
    {
        $request->validate([
            'categoryName' => ['required', 'max:100'],
            'categoryCode' => ['required', 'max:100']
        ]);

        $category = ChatbotCategorie::findOrFail($category);
        $category->categoryName= $request['categoryName'];
        $category->categoryCode = $request['categoryCode'];
        $category->save();

        return response()->json([
            'Message' => 'Data was updated successfully.',
            'Chatbot Category: ' => $category
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        //
        $category = ChatbotCategorie::findOrFail($id);
        $category -> delete();

        return response()->json([
            'Message' => 'Data was deleted successfully.'
        ]);
    }
}
