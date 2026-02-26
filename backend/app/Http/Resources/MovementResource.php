<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MovementResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'tipo'        => $this->tipo,
            'cantidad'    => $this->cantidad,
            'motivo'      => $this->motivo,
            'fecha'    => $this->fecha,
            'product'    => [
                'id'           => $this->product->id,
                'nombre'       => $this->product->nombre,
                'stock_actual' => $this->product->stock_actual
            ],
        ];
    }
}
