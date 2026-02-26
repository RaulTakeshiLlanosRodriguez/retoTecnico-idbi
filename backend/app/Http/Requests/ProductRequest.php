<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
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
        $skuRule = Rule::unique('products', 'sku');

        if($this->isMethod('PUT') || $this->isMethod('PATCH')){
            $skuRule->ignore($this->route('product'));
        }
        return [
            'nombre' => ['required', 'string', 'max:255'],
            'sku'    => ['required', 'string', 'max:255', $skuRule],
        ];
    }
}
