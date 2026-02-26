<?php

namespace App\Listeners;

use App\Events\MovementCreated;
use App\Services\StockService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class UpdateStockListener
{
    /**
     * Create the event listener.
     */
    public function __construct(private StockService $service)
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(MovementCreated $event): void
    {
        
    }
}
