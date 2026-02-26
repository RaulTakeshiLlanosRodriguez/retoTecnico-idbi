<?php

namespace App\Services;

use App\Models\Movement;
use App\Models\Product;
use App\Repositories\MovementRepositoryInterface;
use App\Repositories\ProductRepositoryInterface;
use Illuminate\Validation\ValidationException;

class MovementService
{

    public function __construct(private ProductRepositoryInterface $productRepository, private MovementRepositoryInterface $movementRepository) {}

    public function list(int $userId, array $filtros = [])
    {
        return $this->movementRepository->getAll($userId, $filtros);
    }

    public function create(array $data, int $userId)
    {
        $product = $this->productRepository->findById($data['product_id']);

        if ($data['tipo'] == 'salida' && $data['cantidad'] > $product->stock_actual) {
            throw ValidationException::withMessages([
                'cantidad' => "Stock insuficiente. Stock disponible: {$product->stock_actual}"
            ]);
        }

        return $this->movementRepository->create([
            ...$data,
            'user_id' => $userId
        ]);
    }
}
