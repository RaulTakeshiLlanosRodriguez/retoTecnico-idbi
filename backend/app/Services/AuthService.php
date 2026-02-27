<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(private UserRepositoryInterface $repository)
    {
        
    }
    public function register(array $data){
        return $this->repository->create($data);
    }

    public function login(array $data){
        $user = $this->repository->findByEmail($data['email']);

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
