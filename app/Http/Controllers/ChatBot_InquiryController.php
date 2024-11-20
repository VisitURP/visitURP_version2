<?php

namespace App\Http\Controllers;

use App\Models\ChatbotInquiry;
use Illuminate\Http\Request;

class ChatBot_InquiryController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function markSpecificVisitorsAsAnswered($id_inquiry)
    {
        $updatedRows = ChatbotInquiry::where('state', 'To Answer')
                                        ->where('id_inquiry', $id_inquiry)
                                        ->update(['state' => 'Answered']);

         return response()->json(['updated_count' => $updatedRows]);
    }

    public function countInquiryNonAnswered()
    {
        $count = ChatbotInquiry::where('state', 'To Answer')->count();

        return response()->json($count);
    
    }

    public function countInquiryAnswered()
    {
        $count = ChatbotInquiry::where('state', 'Answered')->count();

        return response()->json($count);
    
    }
    


    public function index()
    {
        $QA = ChatbotInquiry::all();
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
            'fk_visitorV_id' => 'required|exists:visitor_v_s,id_visitorV',
            'detail' => 'required|string',
            'state' => 'required|string',
        ]);

        $qa = ChatbotInquiry::create($request->all());

        return response()->json($qa, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $chatbotQA = ChatbotInquiry::find($id);

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
        $ChatbotInquiry = ChatbotInquiry::find($id);

        if (!$ChatbotInquiry) {
            return response()->json(['message' => 'ChatbotInquiry not found'], 404);
        }

        $request->validate([
            'fk_visitorV_id' => 'required|exists:chatbot_categories,id_category',
            'detail' => 'required|string',
            'state' => 'required|string',
        ]);

        $ChatbotInquiry->update($request->all());

        return response()->json($ChatbotInquiry);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $ChatbotInquiry = ChatbotInquiry::find($id);

        if (!$ChatbotInquiry) {
            return response()->json(['message' => 'ChatbotInquiry not found'], 404);
        }

        $ChatbotInquiry->delete();

        return response()->json(['message' => 'ChatbotInquiry deleted successfully']);
    }
}
