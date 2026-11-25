import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Navbar } from '../../shared/navbar';
import { environment } from '../../../environments/environment';

interface DirectionProvinciale {
  ville: string;
  region: string;
  telephone: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  private http = inject(HttpClient);

  envoi = signal<'idle' | 'envoi' | 'succes' | 'erreur'>('idle');
  messageErreur = signal('');

  formulaire = {
    nom: '',
    email: '',
    numeroDossier: '',
    sujet: '',
    message: '',
  };

  sujets = [
    'Question sur un document',
    'Suivi de dossier',
    'Problème technique',
    'Réclamation',
    'Autre',
  ];

  directions: DirectionProvinciale[] = [
    { ville: 'Rabat', region: 'Rabat-Salé-Kénitra', telephone: '05 37 00 00 00' },
    { ville: 'Fès', region: 'Fès-Meknès', telephone: '05 35 00 00 00' },
    { ville: 'Marrakech', region: 'Marrakech-Safi', telephone: '05 24 00 00 00' },
    { ville: 'Agadir', region: 'Souss-Massa', telephone: '05 28 00 00 00' },
    { ville: 'Oujda', region: 'Oriental', telephone: '05 36 00 00 00' },
    { ville: 'Tanger', region: 'Tanger-Tétouan-Al Hoceïma', telephone: '05 39 00 00 00' },
  ];

  soumettre(): void {
    if (!this.formulaire.nom || !this.formulaire.email || !this.formulaire.message) {
      this.envoi.set('erreur');
      this.messageErreur.set('Merci de renseigner votre nom, votre e-mail et votre message avant d\'envoyer.');
      return;
    }

    this.envoi.set('envoi');

    this.http.post(`${environment.apiUrl}/api/contact`, {
      nom: this.formulaire.nom,
      email: this.formulaire.email,
      numero_dossier: this.formulaire.numeroDossier || null,
      sujet: this.formulaire.sujet || null,
      message: this.formulaire.message,
    }).subscribe({
      next: () => {
        this.envoi.set('succes');
        this.formulaire = { nom: '', email: '', numeroDossier: '', sujet: '', message: '' };
      },
      error: (err) => {
        this.envoi.set('erreur');
        this.messageErreur.set(err.error?.message || 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
      },
    });
  }
}