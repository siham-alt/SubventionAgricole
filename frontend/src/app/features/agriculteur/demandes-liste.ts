import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DossierApi } from '../../core/services/dossier';
import { Dossier, STATUTS_LABELS, STATUTS_COULEURS } from '../../core/models/dossier.model';

@Component({
  selector: 'app-demandes-liste',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './demandes-liste.html',
  styleUrl: './demandes-liste.scss',
})
export class DemandesListe implements OnInit {
  private dossierApi = inject(DossierApi);

  dossiers = signal<Dossier[]>([]);
  loading = signal(true);
  filtreStatut = signal<string>('tous');
  recherche = signal('');
  statutsLabels = STATUTS_LABELS;
  statutsCouleurs = STATUTS_COULEURS;

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.loading.set(true);
    this.dossierApi.getDossiers().subscribe({
      next: (res) => {
        this.dossiers.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  get dossiersFiltres(): Dossier[] {
    let liste = this.dossiers();
    if (this.filtreStatut() !== 'tous') {
      liste = liste.filter(d => d.statut === this.filtreStatut());
    }
    if (this.recherche()) {
      const q = this.recherche().toLowerCase();
      liste = liste.filter(d => d.numero_dossier.toLowerCase().includes(q));
    }
    return liste;
  }
}