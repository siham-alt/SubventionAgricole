<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDossierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'exploitation_id' => 'required|exists:exploitations_agricoles,id',
            'type_subvention_id' => 'required|exists:types_subvention,id',
            'montant_demande' => 'required|numeric|min:0',
            'description_projet' => 'nullable|string',
        ];
    }
}