import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentDossier } from '../models/dossier.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DocumentApi {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/documents`;

  remplacer(documentId: number, fichier: File): Observable<DocumentDossier> {
    const formData = new FormData();
    formData.append('fichier', fichier);
    return this.http.post<DocumentDossier>(`${this.base}/${documentId}/remplacer`, formData);
  }
}