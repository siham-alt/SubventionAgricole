import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

export interface UserStats {
  total: number;
  agriculteurs: number;
  agents: number;
  responsables: number;
  actifs: number;
  inactifs: number;
}

@Injectable({ providedIn: 'root' })
export class AdminApi {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api`;

  getUtilisateurs(params?: any): Observable<{ data: User[]; total: number }> {
    return this.http.get<{ data: User[]; total: number }>(`${this.apiUrl}/utilisateurs`, { params });
  }

  getUtilisateurStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.apiUrl}/utilisateurs-stats`);
  }

  getUtilisateurDetail(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/utilisateurs/${id}`);
  }

  getAgentsAvecStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/agents-stats`);
  }

  creerUtilisateur(data: any): Observable<{ user: User }> {
    return this.http.post<{ user: User }>(`${this.apiUrl}/utilisateurs`, data);
  }

  modifierUtilisateur(id: number, data: any): Observable<{ user: User }> {
    return this.http.put<{ user: User }>(`${this.apiUrl}/utilisateurs/${id}`, data);
  }

  toggleActif(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/utilisateurs/${id}/toggle-actif`, {});
  }

  supprimerUtilisateur(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/utilisateurs/${id}`);
  }

  getRegions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/regions`);
  }

  creerRegion(data: { nom: string; code?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/regions`, data);
  }

  supprimerRegion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/regions/${id}`);
  }

  creerProgramme(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/types-subvention`, data);
  }

  modifierProgramme(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/types-subvention/${id}`, data);
  }

  supprimerProgramme(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/types-subvention/${id}`);
  }
}