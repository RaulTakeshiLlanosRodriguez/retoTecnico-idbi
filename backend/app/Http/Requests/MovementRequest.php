<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MovementRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'tipo'       => ['required', 'string', 'in:entrada,salida'],
            'cantidad'   => ['required', 'integer', 'min:1'],
            'motivo'     => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'El producto es obligatorio.',
            'product_id.exists'   => 'El producto no existe.',
            'tipo.required'       => 'El tipo de movimiento es obligatorio.',
            'tipo.in'             => 'El tipo debe ser "entrada" o "salida".',
            'cantidad.required'   => 'La cantidad es obligatoria.',
            'cantidad.min'        => 'La cantidad debe ser mayor a 0.',
        ];
    }
}
