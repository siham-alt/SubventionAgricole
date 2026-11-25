<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'cin' => 'required|string|unique:users,cin|max:20',
            'telephone' => 'required|string|max:20',
            'region' => 'required|string',
            'province' => 'required|string',
            'commune' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'Cet email est déjà utilisé.',
            'cin.unique' => 'Ce numéro CIN est déjà enregistré.',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
        ];
    }
}