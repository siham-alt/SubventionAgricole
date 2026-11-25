import { Component, signal, inject, OnInit,computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DossierApi } from '../../core/services/dossier';
import { Dossier, DocumentDossier } from '../../core/models/dossier.model';

interface DocumentAvecDossier extends DocumentDossier {
  dossier_numero?: string;
}

@Component({
  selector: 'app-documents-ged',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './documents-ged.html',
  styleUrl: './documents-ged.scss',
})
export class DocumentsGed implements OnInit {
  private dossierApi = inject(DossierApi);

  dossiers = signal<Dossier[]>([]);
  loading = signal(true);

  documentsLabels: Record<string, string> = {
    cin: 'CIN',
    titre_foncier: 'Titre foncier',
    devis: 'Devis',
    facture: 'Facture',
    attestation: 'Attestation',
    photo: 'Photo',
    releve_bancaire: 'Relevé bancaire',
    autre: 'Autre',
  };

  ngOnInit(): void {
    this.dossierApi.getDossiers().subscribe({
      next: (res) => {
        // Charge le détail (avec documents) de chaque dossier
        const dossiers = res.data;
        let chargesCount = 0;

        if (dossiers.length === 0) {
          this.loading.set(false);
          return;
        }

        dossiers.forEach((d, index) => {
          this.dossierApi.getDossier(d.id).subscribe({
            next: (detail) => {
              dossiers[index] = detail.dossier;
              chargesCount++;
              if (chargesCount === dossiers.length) {
                this.dossiers.set([...dossiers]);
                this.loading.set(false);
              }
            },
            error: () => {
              chargesCount++;
              if (chargesCount === dossiers.length) {
                this.dossiers.set([...dossiers]);
                this.loading.set(false);
              }
            },
          });
        });
      },
      error: () => this.loading.set(false),
    });
  }
  recherche = signal('');
filtreStatut = signal<'tous' | 'refuse' | 'en_attente' | 'valide'>('tous');

documentsAplatis = computed(() => {
  const tous: any[] = [];
  this.dossiers().forEach(d => {
    d.documents?.forEach(doc => {
      tous.push({ ...doc, dossier_numero: d.numero_dossier, dossier_id: d.id });
    });
  });
  return tous;
});

documentsFiltres = computed(() => {
  let liste = this.documentsAplatis();
  if (this.filtreStatut() !== 'tous') {
    liste = liste.filter(d => d.statut_verification === this.filtreStatut());
  }
  if (this.recherche()) {
    const q = this.recherche().toLowerCase();
    liste = liste.filter(d => d.nom_original.toLowerCase().includes(q) || d.dossier_numero.toLowerCase().includes(q));
  }
  return liste;
});

get documentsRefusesCount(): number {
  return this.documentsAplatis().filter(d => d.statut_verification === 'refuse').length;
}
}
