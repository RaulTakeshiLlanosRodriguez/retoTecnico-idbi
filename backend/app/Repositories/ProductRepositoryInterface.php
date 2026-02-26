<?php

namespace App\Repositories;

use App\Models\Product;

interface ProductRepositoryInterface{
    public function getAllByUser(int $userId);
    public function create(array $data);
    public function update(Product $product, array $data);
    public function delete(Product $product);
    public function findById(int $id);
}