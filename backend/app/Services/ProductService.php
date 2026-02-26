<?php

namespace App\Services;

use App\Models\Product;
use App\Repositories\ProductRepositoryInterface;

class ProductService
{
    public function __construct(private ProductRepositoryInterface $repository)
    {
        
    }
    public function list(int $userId){
        return $this->repository->getAllByUser($userId);
    }

    public function create(array $data, int $userId){
        return $this->repository->create([
            ...$data,
            'user_id' => $userId
        ]);
    }

    public function update(array $data, Product $product){
        return $this->repository->update($product, $data);
    }

    public function delete(Product $product){
        $this->repository->delete($product);
    }
}
