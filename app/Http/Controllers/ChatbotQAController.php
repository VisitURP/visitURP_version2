<?php

namespace App\Http\Controllers;

use App\Models\chatbotQA;
use Illuminate\Http\Request;

class ChatbotQAController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $QA = chatbotQA::all();
        return response()->json($QA);
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
            'fk_category_id' => 'required|exists:chatbot_categories,id_category',
            'question' => 'required|string',
            'answer' => 'required|string',
        ]);

        $qa = chatbotQA::create($request->all());

        return response()->json($qa, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $chatbotQA = chatbotQA::find($id);

        if (!$chatbotQA) {
            return response()->json(['message' => 'QA not found'], 404);
        }

        return response()->json($chatbotQA);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(chatbotQA $chatbotQA)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        $chatbotQA = chatbotQA::find($id);

        if (!$chatbotQA) {
            return response()->json(['message' => 'ChatBot QA not found'], 404);
        }

        $request->validate([
            'fk_category_id' => 'required|exists:chatbot_categories,id_category',
            'question' => 'required|string',
            'answer' => 'required|string',
        ]);

        $chatbotQA->update($request->all());

        return response()->json($chatbotQA);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $chatbotQA = chatbotQA::find($id);

        if (!$chatbotQA) {
            return response()->json(['message' => 'chatbotQA not found'], 404);
        }

        $chatbotQA->delete();

        return response()->json(['message' => 'chatbotQA deleted successfully']);
    }
}
