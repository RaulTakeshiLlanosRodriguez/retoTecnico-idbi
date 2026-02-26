<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function register(array $data){
        return User::create($data);
    }

    public function login(array $data){
        $user = User::whereEmail($data['email'])->first();

        if(!$user || !Hash::check($data['password'], $user->password)){
            throw ValidationException::withMessages([
                'email' => 'Credenciales incorrectas.'
            ]);
        }

        return [
            'user' => $user,
            'access_token' => $user->createToken('new_user')->plainTextToken
        ];
    }
}
