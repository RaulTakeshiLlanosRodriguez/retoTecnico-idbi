<?php

namespace App\Repositories;

use App\Models\Movement;

class MovementRepository implements MovementRepositoryInterface
{
    public function getAll(int $userId, array $filtros = [])
    {
        $query = Movement::query()
            ->where('user_id', $userId)
            ->with('product');

        if (!empty($filtros['tipo'])) {
            $query->where('tipo', $filtros['tipo']);
        }

        if (!empty($filtros['fecha_inicio'])) {
            $query->where('fecha', '>=', $filtros['fecha_inicio']);
        }

        if (!empty($filtros['fecha_fin'])) {
            $query->where('fecha', '<=', $filtros['fecha_fin']);
        }

        return $query->orderByDesc('id')->get();
    }

    public function create(array $data)
    {
        return Movement::create($data);
    }
}
