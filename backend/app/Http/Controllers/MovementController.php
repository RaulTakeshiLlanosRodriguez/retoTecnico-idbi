<?php

namespace App\Http\Controllers;

use App\Http\Requests\MovementRequest;
use App\Http\Resources\MovementResource;
use App\Services\MovementService;
use Illuminate\Http\Request;

class MovementController extends Controller
{
    public function __construct(private MovementService $service)
    {
        
    }

    public function index(Request $request){
        $movements = $this->service->list($request->user()->id);
        return MovementResource::collection($movements)
        ->response()
        ->setStatusCode(200);
        
    }

    public function store(MovementRequest $request){
        $movement = $this->service->create(
            $request->validated(),
            $request->user()->id
        );

        return MovementResource::make($movement->load('product'))
        ->response()
        ->setStatusCode(201);
    }
}
