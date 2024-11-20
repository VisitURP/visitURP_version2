<?php

namespace App\Http\Controllers;

use App\Models\interactiveFeedbacks;
use Illuminate\Http\Request;

class InteractiveFeedbacksController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $details = interactiveFeedbacks::all();
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
            'fk_id_visitorV' => 'required|integer|exists:visitor_v_s,id_visitorV',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:255',
        ]);

        $interactiveFeedback = interactiveFeedbacks::create($validatedData);

        return response()->json($interactiveFeedback, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $feedback = interactiveFeedback::findOrFail($id);
        return response()->json([
            $feedback
        ] 
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(interactiveFeedbacks $interactiveFeedbacks)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $feedback)
    {
        $request->validate([
            'fk_id_visitorV' => 'required|integer|exists:visitor_v_s,id_visitorV',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:255',
        ]);

        $feedback = interactiveFeedbacks::findOrFail($feedback);
        $feedback-> fk_id_visitorV = $request['fk_id_visitorV'];
        $feedback->rating = $request['rating'];
        $feedback->comment = $request['comment'];
        $feedback-> save();

        return response()->json([
            'Message' => 'Data already updated.',
            'feedback: ' => $feedback
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $feedback = interactiveFeedbacks::findOrFail($id);
        $feedback -> delete();

        return response()->json([
            'Message' => 'Feedback deleted successfully.'
        ]);
    }
}
