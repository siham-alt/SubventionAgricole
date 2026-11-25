<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: sans-serif; color: #263238;">
    <div style="max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1B5E20;">Bonjour {{ $messageContact->nom }},</h2>

        <p>Voici la réponse à votre message @if($messageContact->numero_dossier) concernant le dossier <strong>{{ $messageContact->numero_dossier }}</strong> @endif :</p>

        <div style="background: #f8faf8; padding: 16px; border-radius: 8px; margin: 16px 0;">
            {{ $messageContact->reponse }}
        </div>

        <p style="font-size: 12px; color: #90a4ae;">
            Votre message initial : "{{ $messageContact->message }}"
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #90a4ae;">
            Ministère de l'Agriculture, de la Pêche Maritime, du Développement Rural et des Eaux et Forêts
        </p>
    </div>
</body>
</html>