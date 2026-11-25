import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Programme } from '../models/programme.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProgrammeApi {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api`;

  getProgrammes(): Observable<Programme[]> {
    return this.http.get<Programme[]>(`${this.apiUrl}/types-subvention`);
  }
}