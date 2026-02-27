<?php

namespace App\Observers;

use App\Events\MovementCreated;
use App\Models\Movement;

class MovementObserver
{
    /**
     * Handle the Movement "created" event.
     */
    public function created(Movement $movement): void
    {
        MovementCreated::dispatch($movement);
    }
}
