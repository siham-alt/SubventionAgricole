<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type_document' => 'required|in:cin,titre_foncier,devis,facture,attestation,photo,releve_bancaire,autre',
            'fichier_base64' => 'required|string',
            'nom_fichier' => 'required|string',
        ];
    }
}