import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dossier, Exploitation, TypeSubvention, DocumentDossier } from '../models/dossier.model';
import { environment } from '../../../environments/environment';
import { DossierDetailResponse } from '../models/dossier.model';

@Injectable({ providedIn: 'root' })
export class DossierApi {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api`;

  // Exploitations
  getExploitations(): Observable<Exploitation[]> {
    return this.http.get<Exploitation[]>(`${this.apiUrl}/exploitations`);
  }

  creerExploitation(data: Partial<Exploitation>): Observable<{ exploitation: Exploitation }> {
    return this.http.post<{ exploitation: Exploitation }>(`${this.apiUrl}/exploitations`, data);
  }

  // Types de subvention
  getTypesSubvention(): Observable<TypeSubvention[]> {
    return this.http.get<TypeSubvention[]>(`${this.apiUrl}/types-subvention`);
  }

  // Dossiers
  getDossiers(params?: any): Observable<{ data: Dossier[]; total: number }> {
    return this.http.get<{ data: Dossier[]; total: number }>(`${this.apiUrl}/dossiers`, { params });
  }

  getDossier(id: number): Observable<DossierDetailResponse> {
  return this.http.get<DossierDetailResponse>(`${this.apiUrl}/dossiers/${id}`);
}

  creerDossier(data: any): Observable<{ dossier: Dossier }> {
    return this.http.post<{ dossier: Dossier }>(`${this.apiUrl}/dossiers`, data);
  }

  soumettreDossier(id: number): Observable<{ dossier: Dossier }> {
    return this.http.post<{ dossier: Dossier }>(`${this.apiUrl}/dossiers/${id}/soumettre`, {});
  }

uploadDocument(dossierId: number, typeDocument: string, fichier: File): Observable<any> {
  return new Observable(observer => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;

      this.http.post(`${this.apiUrl}/dossiers/${dossierId}/documents`, {
        type_document: typeDocument,
        fichier_base64: base64,
        nom_fichier: fichier.name,
      }).subscribe({
        next: (res) => { observer.next(res); observer.complete(); },
        error: (err) => observer.error(err),
      });
    };

    reader.onerror = (err) => observer.error(err);
    reader.readAsDataURL(fichier); // génère "data:image/png;base64,...."
  });
}
  getDocuments(dossierId: number): Observable<DocumentDossier[]> {
    return this.http.get<DocumentDossier[]>(`${this.apiUrl}/dossiers/${dossierId}/documents`);
  }

  supprimerDocument(documentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/documents/${documentId}`);
  }
  validerDocument(documentId: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/documents/${documentId}/valider`, {});
}

refuserDocument(documentId: number, commentaire: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/documents/${documentId}/refuser`, { commentaire });
}

}