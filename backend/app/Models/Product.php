<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'user_id',
        'nombre',
        'sku',
        'stock_actual'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function movements()
    {
        return $this->hasMany(Movement::class);
    }

    public function updateStock()
    {
        $entradas = $this->movements()->where('tipo', 'entrada')->sum('cantidad');
        $salidas  = $this->movements()->where('tipo', 'salida')->sum('cantidad');

        $this->update([
            'stock_actual' => $entradas - $salidas
        ]);
    }
}
