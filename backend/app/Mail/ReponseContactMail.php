<?php
namespace App\Mail;

use App\Models\MessageContact;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReponseContactMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public MessageContact $messageContact) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Réponse à votre message : ' . ($this->messageContact->sujet ?? 'Votre demande'),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.reponse-contact',
        );
    }
}