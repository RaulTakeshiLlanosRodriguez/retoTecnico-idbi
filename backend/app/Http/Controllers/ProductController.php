<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(private ProductService $service) {}
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $products = $this->service->list($request->user()->id);
        return ProductResource::collection($products)
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductRequest $request)
    {
        $product = $this->service->create(
            $request->validated(),
            $request->user()->id
        );

        return ProductResource::make($product)
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $this->authorize('view', $product);
        return ProductResource::make($product)
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductRequest $request, Product $product)
    {
        $this->authorize('update', $product);
        $productToUpdate = $this->service->update(
            $request->validated(),
            $product
        );
        return ProductResource::make($productToUpdate)
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $this->authorize('delete', $product);
        $this->service->delete($product);

        return response()->json([
            'message' => 'Producto eliminado correctamente.',
            'data'    => null,
        ]);
    }
}
