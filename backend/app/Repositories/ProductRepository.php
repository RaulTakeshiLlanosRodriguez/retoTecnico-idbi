<?php

namespace App\Repositories;

use App\Models\Product;

class ProductRepository implements ProductRepositoryInterface
{
    public function getAllByUser(int $userId)
    {
        return Product::query()
        ->where('user_id', $userId)
        ->latest('id')
        ->get();
    }

    public function create(array $data)
    {
        return Product::create($data);
    }

    public function update(Product $product, array $data)
    {
        $product->update($data);
        return $product;
    }

    public function delete(Product $product)
    {
        $product->delete();
    }

    public function findById(int $id)
    {
        return Product::findOrFail($id);
    }
}
