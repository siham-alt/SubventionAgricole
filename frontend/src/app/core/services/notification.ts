import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { NotificationInterne } from '../models/dossier.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationApi {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api`;

  nonLuesCount = signal(0);

  getNotifications(): Observable<{ data: NotificationInterne[] }> {
    return this.http.get<{ data: NotificationInterne[] }>(`${this.apiUrl}/notifications`);
  }

  chargerNonLues(): void {
    this.http.get<{ count: number }>(`${this.apiUrl}/notifications/non-lues`).subscribe({
      next: (res) => this.nonLuesCount.set(res.count),
    });
  }

  marquerLu(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/notifications/${id}/lu`, {}).pipe(
      tap(() => this.chargerNonLues())
    );
  }

  marquerToutesLues(): Observable<any> {
    return this.http.post(`${this.apiUrl}/notifications/tout-lire`, {}).pipe(
      tap(() => this.nonLuesCount.set(0))
    );
  }
}