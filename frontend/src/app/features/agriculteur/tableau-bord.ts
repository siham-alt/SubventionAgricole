import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { DossierApi } from '../../core/services/dossier';
import { Dossier, STATUTS_LABELS, STATUTS_COULEURS } from '../../core/models/dossier.model';

interface EtapeTimeline {
  cle: string;
  label: string;
  fait: boolean;
  actuel: boolean;
}

@Component({
  selector: 'app-tableau-bord',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tableau-bord.html',
  styleUrl: './tableau-bord.scss',
})
export class TableauBord implements OnInit {
  auth = inject(Auth);
  private dossierApi = inject(DossierApi);

  dossiers = signal<Dossier[]>([]);
  loading = signal(true);
  statutsLabels = STATUTS_LABELS;
  statutsCouleurs = STATUTS_COULEURS;

  private readonly ORDRE_ETAPES = ['depose', 'analyse', 'approuve'] as const;
  private readonly LABELS_ETAPES: Record<string, string> = {
    depose: 'Déposé',
    analyse: 'Analyse',
    approuve: 'Décision',
  };

// Correspondance entre les vrais statuts du dossier et l'étape de la timeline
private readonly STATUT_VERS_ETAPE: Record<string, typeof this.ORDRE_ETAPES[number]> = {
  brouillon: 'depose',
  soumis: 'depose',
  en_cours_verification: 'analyse',
  complement_demande: 'analyse',
  en_validation_agent: 'analyse',
  en_validation_responsable: 'analyse',
  approuve: 'approuve',
  paye: 'approuve',
};
  totalDemandes = computed(() => this.dossiers().length);
  demandesValidees = computed(() => this.dossiers().filter(d => d.statut === 'approuve' || d.statut === 'paye').length);
  demandesEnCours = computed(() => this.dossiers().filter(d =>
    !['approuve', 'refuse', 'paye', 'brouillon'].includes(d.statut)
  ).length);
  demandesRefusees = computed(() => this.dossiers().filter(d => d.statut === 'refuse').length);

  dernieresDemandes = computed(() => this.dossiers().slice(0, 5));

  activiteRecente = computed(() =>
    [...this.dossiers()]
      .sort((a, b) => new Date(b.updated_at ?? b.created_at).getTime() - new Date(a.updated_at ?? a.created_at).getTime())
      .slice(0, 6)
      .map(d => ({
        id: d.id,
        texte: `Dossier ${d.numero_dossier} — ${this.statutsLabels[d.statut]}`,
        date: d.updated_at ?? d.created_at,
      }))
  );

  premierPrenom = computed(() => this.auth.currentUser()?.name?.split(' ')[0] ?? '');

  ngOnInit(): void {
    this.dossierApi.getDossiers().subscribe({
      next: (res) => {
        this.dossiers.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

 etapesDossier(statut: string): EtapeTimeline[] {
  if (statut === 'refuse') {
    return [
      { cle: 'depose', label: 'Déposé', fait: true, actuel: false },
      { cle: 'analyse', label: 'Analyse', fait: true, actuel: false },
      { cle: 'refuse', label: 'Refusé', fait: false, actuel: true },
    ];
  }

  const etapeCorrespondante = this.STATUT_VERS_ETAPE[statut] ?? 'depose';
  const positionEffective = this.ORDRE_ETAPES.indexOf(etapeCorrespondante);
  const estFinal = statut === 'approuve' || statut === 'paye';

  return this.ORDRE_ETAPES.map((cle, i) => ({
    cle,
    label: this.LABELS_ETAPES[cle],
    fait: i < positionEffective || (i === positionEffective && estFinal),
    actuel: i === positionEffective && !estFinal,
  }));
}
}