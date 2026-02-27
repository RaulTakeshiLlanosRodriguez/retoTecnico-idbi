<?php

namespace App\Services;

use App\Models\Product;
use App\Repositories\MovementRepositoryInterface;

class StockService
{
    public function __construct(private MovementRepositoryInterface $repository)
    {
        
    }

    public function updateStock(Product $product){
        $entradas = $this->repository->sumProductsByTipo($product->id, 'entrada');
        $salidas = $this->repository->sumProductsByTipo($product->id, 'salida');

        $product->update([
            'stock_actual' => $entradas - $salidas
        ]);
    }
}
