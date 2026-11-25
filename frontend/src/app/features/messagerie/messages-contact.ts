import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { environment } from '../../../environments/environment';

interface MessageContact {
  id: number;
  nom: string;
  email: string;
  numero_dossier?: string;
  dossier_id?: number;
  sujet?: string;
  message: string;
  statut: 'nouveau' | 'en_cours' | 'traite';
  reponse?: string;
  assigne_a_id?: number;
  assigneA?: { id: number; name: string };
  created_at: string;
}

@Component({
  selector: 'app-messages-contact',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './messages-contact.html',
  styleUrl: './messages-contact.scss',
})
export class MessagesContact implements OnInit {
  private http = inject(HttpClient);
  auth = inject(Auth);

  messages = signal<MessageContact[]>([]);
  loading = signal(true);
  filtreStatut = signal<'tous' | 'nouveau' | 'traite'>('tous');
  agents = signal<{ id: number; name: string }[]>([]);

  messageOuvert = signal<MessageContact | null>(null);
  texteReponse = signal('');
  envoiEnCours = signal(false);

  ngOnInit(): void {
    this.charger();
    if (this.auth.hasRole('administrateur')) {
      this.chargerAgents();
    }
  }

  get isAdmin(): boolean {
    return this.auth.hasRole('administrateur');
  }

  charger(): void {
    this.loading.set(true);
    this.http.get<{ data: MessageContact[] }>(`${environment.apiUrl}/api/messages-contact`).subscribe({
      next: (res) => {
        this.messages.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  chargerAgents(): void {
    this.http.get<{ id: number; name: string }[]>(`${environment.apiUrl}/api/agents-disponibles`).subscribe({
      next: (data) => this.agents.set(data),
    });
  }

  get messagesFiltres(): MessageContact[] {
    if (this.filtreStatut() === 'tous') return this.messages();
    if (this.filtreStatut() === 'traite') return this.messages().filter(m => m.statut === 'traite');
    return this.messages().filter(m => m.statut !== 'traite');
  }

  ouvrirMessage(msg: MessageContact): void {
    this.messageOuvert.set(msg);
    this.texteReponse.set(msg.reponse ?? '');
  }

  fermerMessage(): void {
    this.messageOuvert.set(null);
    this.texteReponse.set('');
  }

  envoyerReponse(): void {
    if (!this.messageOuvert() || !this.texteReponse().trim()) return;
    this.envoiEnCours.set(true);

    this.http.post<MessageContact>(
      `${environment.apiUrl}/api/messages-contact/${this.messageOuvert()!.id}/repondre`,
      { reponse: this.texteReponse() }
    ).subscribe({
      next: () => {
        this.envoiEnCours.set(false);
        this.fermerMessage();
        this.charger();
      },
      error: () => this.envoiEnCours.set(false),
    });
  }

  reassigner(msg: MessageContact, agentId: string): void {
    const id = agentId ? Number(agentId) : null;
    this.http.post(`${environment.apiUrl}/api/messages-contact/${msg.id}/reassigner`, {
      assigne_a_id: id,
    }).subscribe(() => this.charger());
  }
}