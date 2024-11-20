<?php

namespace App\Http\Controllers;

use App\Models\uservisitURP;
use Illuminate\Http\Request;

class UservisitURPController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = uservisitURP::get();

        $data = $user->map(function($user){
            return [
                'id_user' => $user -> id_user,
                'name' => $user -> name,
                'lastName' => $user -> lastName,
                'email' => $user -> email,
                'rol' => $user -> rol,
                'username' => $user -> username,
                'password' => $user -> password,
                'fk_docType_id' => $user -> fk_docType_id,
                'docNumber' => $user -> docNumber,
                'phone' => $user -> phone
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
            'username' => ['required', 'string'],
            'email' => ['required', 'email']
        ]);

        $userName = uservisitURP::where('username', $request->username)->first();
        $email = uservisitURP::where('email', $request->email)->first();
        

        //si es que existe username
        if($userName)
        {
            if($email)
            {
                return response()->json([
                    'I´m sorry, username and email already exist.',
                ]);
            }
            else
            {
                return response()->json([
                    'I´m sorry, username already exist.',
                ]);
            }
        }
        //si es que NO existe username
        else
        {
            if($email)
            {
                return response()->json([
                    'I´m sorry, email already exist.',
                ]);
            }
            //no existe username ni email
            else
            {
                $request->validate([
                    'name' => ['required', 'max:100'],
                    'lastName' => ['required', 'max:200'],
                    'email' => ['required', 'email'],
                    'rol' => ['required', 'max:100'],
                    'username' => ['required', 'max:100'],
                    'password' => ['required', 'max:100'],
                    'fk_docType_id' => ['required', 'max:100'],
                    'docNumber' => ['required', 'max:100'],
                    'phone' => ['required', 'numeric', 'min:9']
                ]);
    
                $user = uservisitURP::create([
                    'name' => $request['name'],
                    'lastName' => $request['lastName'],
                    'email' => $request['email'],
                    'rol' => $request['rol'],
                    'username' => $request['username'],
                    'password' => $request['password'],
                    'fk_docType_id' => $request['fk_docType_id'],
                    'docNumber' => $request['docNumber'],
                    'phone' => $request['phone']
                ]);
    
                return response()->json([
                    $user
                ]);
            }
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $user = uservisitURP::findOrFail($id);
        return response()->json([
            $user
        ] 
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(uservisitURP $uservisitURP)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $userURP)
    {
        $request->validate([
            'name' => ['required', 'max:100'],
            'lastName' => ['required', 'max:200'],
            'email' => ['required', 'email'],
            'rol' => ['required', 'max:100'],
            'username' => ['required', 'max:100'],
            'password' => ['required', 'max:100'],
            'fk_docType_id' => ['required', 'max:100'],
            'docNumber' => ['required', 'max:100'],
            'phone' => ['required', 'numeric', 'min:9']
        ]);

        $userURP = uservisitURP::findOrFail($userURP);
        $userURP-> name = $request['name'];
        $userURP->lastName = $request['lastName'];
        $userURP-> email = $request['email'];
        $userURP-> rol = $request['rol'];
        $userURP-> username = $request['username'];
        $userURP-> fk_docType_id = $request['fk_docType_id'];
        $userURP-> docNumber = $request['docNumber'];
        $userURP-> phone = $request['phone'];
        $userURP-> save();

        return response()->json([
            'Message' => 'Data already updated.',
            'User: ' => $userURP
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $user = uservisitURP::findOrFail($id);
        $user -> delete();

        return response()->json([
            'Message' => 'User deleted successfully.'
        ]);
    }
}
