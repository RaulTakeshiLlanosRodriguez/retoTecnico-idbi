<?php

use App\Http\Controllers\AuthController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
Route::middleware('auth:sanctum')->group(function(){
    Route::get('user', function(Request $request){
        return [
            'user' => UserResource::make($request->user()),
            'access_token' => $request->bearerToken()
        ];
    });
    Route::post('logout', [AuthController::class, 'logout']);
});
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
