<?php

namespace App\Repositories;

interface MovementRepositoryInterface{
    public function getAll(int $userId, array $filtros = []);
    public function create(array $data);
}