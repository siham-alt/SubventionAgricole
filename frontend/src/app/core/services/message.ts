import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MessageItem {
  id: number;
  contenu: string;
  expediteur_id: number;
  destinataire_id: number;
  lu: boolean;
  created_at: string;
  expediteur?: { id: number; name: string };
}

@Injectable({ providedIn: 'root' })
export class MessageApi {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api`;

  getMessages(dossierId: number): Observable<MessageItem[]> {
    return this.http.get<MessageItem[]>(`${this.apiUrl}/dossiers/${dossierId}/messages`);
  }

  envoyerMessage(dossierId: number, contenu: string): Observable<{ message: MessageItem }> {
    return this.http.post<{ message: MessageItem }>(`${this.apiUrl}/dossiers/${dossierId}/messages`, { contenu });
  }
}