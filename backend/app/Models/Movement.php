<?php

namespace App\Models;

use App\Observers\MovementObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy(MovementObserver::class)]
class Movement extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'product_id',
        'user_id',
        'tipo',
        'cantidad',
        'motivo'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
