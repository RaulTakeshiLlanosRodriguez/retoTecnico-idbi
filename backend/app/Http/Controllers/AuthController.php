<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\RegisterUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterUserRequest $request){
        User::create($request->validated());
        return response()->json([
            'message' => 'Registro creado exitosamente'
        ]);
    }

    public function login(LoginUserRequest $request){
        $user = User::whereEmail($request->email)->first();
        if(!$user || !Hash::check($request->password, $user->password)){
            return response()->json([
                'error' => 'Credenciales incorrectas'
            ]);
        }else{
            return response()->json([
                'user' => UserResource::make($user),
                'access_token' => $user->createToken('new_user')->plainTextToken,
                'message' => 'Login exitoso'
            ]);
        }
    }

    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'Sessión cerrado con éxito'
        ]);
    }
}
