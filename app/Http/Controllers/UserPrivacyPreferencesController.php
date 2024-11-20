<?php

namespace App\Http\Controllers;

use App\Models\User_Privacy_preferences;
use Illuminate\Http\Request;

class UserPrivacyPreferencesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $details = User_Privacy_preferences::all();
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
            'fk_id_visitorV' => 'integer|exists:visitor_v_s,id_visitorV',
            'fk_id_visitV' => 'integer|exists:visit_v_s,id_visitV',
            'user_personal_data' => 'nullable|boolean',
            'receive_communications' => 'nullable|string|in:monthly_updates,important_notifications,no_communications',
            'user_cooking_tracking' => 'nullable|boolean',
            'consent_date' => 'required|date_format:Y-m-d H:i:s',
            'withdraw_consent' => 'required|boolean',
            'withdraw_date' => 'nullable|date_format:Y-m-d H:i:s',
        ]);
    
        $userPrivacyPreference = User_Privacy_preferences::create($validatedData);
    
        return response()->json($userPrivacyPreference, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $userPrivacyPreference = User_Privacy_preferences::findOrFail($id);
        return response()->json([
            $userPrivacyPreference
        ] 
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User_Privacy_preferences $user_Privacy_preferences)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $user_Privacy_preferences)
    {
        $request->validate([
            'fk_id_visitorV' => 'integer|exists:visitor_v_s,id_visitorV',
            'fk_id_visitV' => 'integer|exists:visit_v_s,id_visitV',
            'user_personal_data' => 'nullable|boolean',
            'receive_communications' => 'nullable|string|in:monthly_updates,important_notifications,no_communications',
            'user_cooking_tracking' => 'nullable|boolean',
            'consent_date' => 'required|date_format:Y-m-d H:i:s',
            'withdraw_consent' => 'required|boolean',
            'withdraw_date' => 'nullable|date_format:Y-m-d H:i:s',
        ]);

        $user_Privacy_preferences = User_Privacy_preferences::findOrFail($user_Privacy_preferences);
        $user_Privacy_preferences->fk_id_visitorV = $request['fk_id_visitorV'];
        $user_Privacy_preferences->fk_id_visitV = $request['fk_id_visitV'];
        $user_Privacy_preferences-> user_personal_data = $request['user_personal_data'];
        $user_Privacy_preferences-> receive_communications = $request['receive_communications'];
        $user_Privacy_preferences-> user_cooking_tracking = $request['user_cooking_tracking'];
        $user_Privacy_preferences-> consent_date = $request['consent_date'];
        $user_Privacy_preferences-> withdraw_consent = $request['withdraw_consent'];
        $user_Privacy_preferences-> withdraw_date = $request['withdraw_date'];
        $user_Privacy_preferences-> save();

        return response()->json([
            'Message' => 'Data already updated.',
            'user privacy Preference: ' => $user_Privacy_preferences
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $userPrivacyPreference = User_Privacy_preferences::findOrFail($id);
        $userPrivacyPreference -> delete();

        return response()->json([
            'Message' => 'user privacy preference deleted successfully.'
        ]);
    }
}
