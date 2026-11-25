import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DossierApi } from '../../core/services/dossier';
import { TypeSubvention, STATUTS_LABELS } from '../../core/models/dossier.model';
import { environment } from '../../../environments/environment';
import { REGIONS_MAROC } from '../../core/data/regions-maroc';

@Component({
  selector: 'app-admin-rapports',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-rapports.html',
  styleUrl: './admin-rapports.scss',
})
export class AdminRapports implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private dossierApi = inject(DossierApi);

  telechargementEnCours = signal<string | null>(null);
  typesSubvention = signal<TypeSubvention[]>([]);
  regions = REGIONS_MAROC; // ← liste statique, plus besoin d'API ni de signal

  statutsLabels = STATUTS_LABELS;
  statutsKeys = Object.keys(STATUTS_LABELS);

  form = this.fb.group({
    mois: [''],
    statut: [''],
    region: [''],
    type_subvention_id: [''],
    date_debut: [''],
    date_fin: [''],
  });

  ngOnInit(): void {
    this.dossierApi.getTypesSubvention().subscribe(data => this.typesSubvention.set(data));
    // ← suppression de l'appel this.adminApi.getRegions(), plus nécessaire
  }

  private construireParams(): HttpParams {
    let params = new HttpParams();
    const valeurs = this.form.value;
    Object.keys(valeurs).forEach(cle => {
      const val = (valeurs as any)[cle];
      if (val) params = params.set(cle, val);
    });
    return params;
  }

  telecharger(format: 'excel' | 'pdf'): void {
    this.telechargementEnCours.set(format);
    const params = this.construireParams();

    this.http.get(`${environment.apiUrl}/api/rapports/${format}`, {
      responseType: 'blob',
      params,
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rapport-dossiers.${format === 'excel' ? 'xlsx' : 'pdf'}`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.telechargementEnCours.set(null);
      },
      error: () => this.telechargementEnCours.set(null),
    });
  }

  reinitialiser(): void {
    this.form.reset();
  }
}