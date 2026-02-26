<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\RegisterUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function __construct(private AuthService $service) {}
    public function register(RegisterUserRequest $request)
    {
        $user = $this->service->register($request->validated());
        return UserResource::make($user)
            ->response()
            ->setStatusCode(201);
    }

    public function login(LoginUserRequest $request)
    {
        $result = $this->service->login($request->validated());
        return response()->json([
            'user' => UserResource::make($result['user']),
            'access_token' => $result['access_token'],
            'message' => 'Login exitoso'
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'Sessión cerrado con éxito'
        ]);
    }
}
