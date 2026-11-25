import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StatsAgent, StatsAdmin } from '../models/statistique.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StatistiqueApi {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api`;

  getStatsAgent(): Observable<StatsAgent> {
    return this.http.get<StatsAgent>(`${this.apiUrl}/statistiques/agent`);
  }

  getStatsAdmin(): Observable<StatsAdmin> {
    return this.http.get<StatsAdmin>(`${this.apiUrl}/statistiques/admin`);
  }
  getStatsAgentPersonnel(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/statistiques/agent-personnel`);
}
getStatsParAgent(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/statistiques/par-agent`);
}
}