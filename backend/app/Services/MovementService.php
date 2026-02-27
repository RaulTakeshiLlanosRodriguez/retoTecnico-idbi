<?php

namespace App\Services;

use App\Exports\MovementsExport;
use App\Repositories\MovementRepositoryInterface;
use App\Repositories\ProductRepositoryInterface;
use Illuminate\Validation\ValidationException;
use Maatwebsite\Excel\Facades\Excel;

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

    public function export(int $userId, array $filtros = [])
    {
        $movements = $this->movementRepository->getAll($userId, $filtros);

        return Excel::download(
            new MovementsExport($movements),
            'reporte-movimientos.xlsx'
        );
    }
}
