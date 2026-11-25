import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DossierApi } from '../../core/services/dossier';
import { Dossier, STATUTS_LABELS, STATUTS_COULEURS } from '../../core/models/dossier.model';

type PresetDate = 'tous' | 'aujourdhui' | 'semaine' | 'mois' | 'personnalise';

interface FiltreActif {
  cle: string;
  label: string;
}

@Component({
  selector: 'app-agent-dossiers-liste',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './agent-dossiers-liste.html',
  styleUrl: './agent-dossiers-liste.scss',
})
export class AgentDossiersListe implements OnInit {
  private dossierApi = inject(DossierApi);

  dossiers = signal<Dossier[]>([]);
  loading = signal(true);
  vue = signal<'actifs' | 'historique'>('actifs');

  // ===== Filtres =====
  recherche = signal('');
  filtreStatut = signal<string>('tous');
  filtreProgramme = signal<string>('tous');
  filtreRegion = signal<string>('tous');
  presetDate = signal<PresetDate>('tous');
  dateDebut = signal<string>('');
  dateFin = signal<string>('');
  montantMin = signal<number | null>(null);
  montantMax = signal<number | null>(null);
  tri = signal<'recent' | 'ancien' | 'montant_desc' | 'montant_asc'>('recent');

  statutsLabels = STATUTS_LABELS;
  statutsCouleurs = STATUTS_COULEURS;

// agent-dossiers-liste.ts
statutsActifs = ['en_attente_agent', 'soumis', 'en_cours_verification', 'complement_demande', 'en_validation_agent'];  statutsHistorique = ['approuve', 'refuse', 'paye'];

  programmesDisponibles = computed(() => {
    const noms = new Set<string>();
    this.dossiers().forEach(d => { if (d.type_subvention?.nom_fr) noms.add(d.type_subvention.nom_fr); });
    return Array.from(noms).sort();
  });

  regionsDisponibles = computed(() => {
    const noms = new Set<string>();
    this.dossiers().forEach(d => { if (d.exploitation?.region) noms.add(d.exploitation.region); });
    return Array.from(noms).sort();
  });

  // ===== Chips des filtres actifs (pour affichage + suppression individuelle) =====
  filtresActifs = computed<FiltreActif[]>(() => {
    const chips: FiltreActif[] = [];
    if (this.recherche()) chips.push({ cle: 'recherche', label: `"${this.recherche()}"` });
    if (this.filtreStatut() !== 'tous') chips.push({ cle: 'statut', label: this.statutsLabels[this.filtreStatut()] });
    if (this.filtreProgramme() !== 'tous') chips.push({ cle: 'programme', label: this.filtreProgramme() });
    if (this.filtreRegion() !== 'tous') chips.push({ cle: 'region', label: this.filtreRegion() });
    if (this.presetDate() !== 'tous') chips.push({ cle: 'date', label: this.labelPresetDate() });
    if (this.montantMin() != null) chips.push({ cle: 'montantMin', label: `Min ${this.montantMin()} DH` });
    if (this.montantMax() != null) chips.push({ cle: 'montantMax', label: `Max ${this.montantMax()} DH` });
    return chips;
  });

  labelPresetDate(): string {
    switch (this.presetDate()) {
      case 'aujourdhui': return "Aujourd'hui";
      case 'semaine': return 'Cette semaine';
      case 'mois': return 'Ce mois-ci';
      case 'personnalise': return `${this.dateDebut() || '…'} → ${this.dateFin() || '…'}`;
      default: return '';
    }
  }

  ngOnInit(): void {
    this.charger();
  }

  changerVue(v: 'actifs' | 'historique'): void {
    this.vue.set(v);
    this.filtreStatut.set('tous');
    this.charger();
  }

  charger(): void {
    this.loading.set(true);
    const params = this.vue() === 'historique' ? { vue: 'historique' } : {};
    this.dossierApi.getDossiers(params).subscribe({
      next: (res) => { this.dossiers.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  // ===== Gestion des presets de date =====
  choisirPresetDate(preset: PresetDate): void {
    this.presetDate.set(preset);
    if (preset !== 'personnalise') {
      this.dateDebut.set('');
      this.dateFin.set('');
    }
  }

  private plageDateActive(): { debut: Date | null; fin: Date | null } {
    const maintenant = new Date();
    switch (this.presetDate()) {
      case 'aujourdhui': {
        const debut = new Date(maintenant); debut.setHours(0, 0, 0, 0);
        return { debut, fin: null };
      }
      case 'semaine': {
        const debut = new Date(maintenant);
        debut.setDate(maintenant.getDate() - maintenant.getDay());
        debut.setHours(0, 0, 0, 0);
        return { debut, fin: null };
      }
      case 'mois': {
        const debut = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
        return { debut, fin: null };
      }
      case 'personnalise': {
        return {
          debut: this.dateDebut() ? new Date(this.dateDebut()) : null,
          fin: this.dateFin() ? new Date(this.dateFin() + 'T23:59:59') : null,
        };
      }
      default:
        return { debut: null, fin: null };
    }
  }

  // ===== Suppression individuelle d'un filtre via sa chip =====
  retirerFiltre(cle: string): void {
    switch (cle) {
      case 'recherche': this.recherche.set(''); break;
      case 'statut': this.filtreStatut.set('tous'); break;
      case 'programme': this.filtreProgramme.set('tous'); break;
      case 'region': this.filtreRegion.set('tous'); break;
      case 'date': this.presetDate.set('tous'); this.dateDebut.set(''); this.dateFin.set(''); break;
      case 'montantMin': this.montantMin.set(null); break;
      case 'montantMax': this.montantMax.set(null); break;
    }
  }

  reinitialiserFiltres(): void {
    this.recherche.set('');
    this.filtreStatut.set('tous');
    this.filtreProgramme.set('tous');
    this.filtreRegion.set('tous');
    this.presetDate.set('tous');
    this.dateDebut.set('');
    this.dateFin.set('');
    this.montantMin.set(null);
    this.montantMax.set(null);
    this.tri.set('recent');
  }

  get statutsDisponibles(): string[] {
    return this.vue() === 'actifs' ? this.statutsActifs : this.statutsHistorique;
  }

  get dossiersFiltres(): Dossier[] {
    let liste = this.dossiers();

    if (this.recherche()) {
      const q = this.recherche().toLowerCase();
      liste = liste.filter(d =>
        d.numero_dossier.toLowerCase().includes(q) ||
        d.type_subvention?.nom_fr.toLowerCase().includes(q) ||
        d.user?.name?.toLowerCase().includes(q)
      );
    }

    if (this.filtreStatut() !== 'tous') {
      liste = liste.filter(d => d.statut === this.filtreStatut());
    }

    if (this.filtreProgramme() !== 'tous') {
      liste = liste.filter(d => d.type_subvention?.nom_fr === this.filtreProgramme());
    }

    if (this.filtreRegion() !== 'tous') {
      liste = liste.filter(d => d.exploitation?.region === this.filtreRegion());
    }

    if (this.presetDate() !== 'tous') {
      const { debut, fin } = this.plageDateActive();
      liste = liste.filter(d => {
        const date = new Date(d.created_at);
        if (debut && date < debut) return false;
        if (fin && date > fin) return false;
        return true;
      });
    }

    if (this.montantMin() != null) {
      liste = liste.filter(d => d.montant_demande >= this.montantMin()!);
    }
    if (this.montantMax() != null) {
      liste = liste.filter(d => d.montant_demande <= this.montantMax()!);
    }

   liste = [...liste].sort((a, b) => {
  const aRenvoye = this.aDesDocumentsRenvoyes(a);
  const bRenvoye = this.aDesDocumentsRenvoyes(b);
  if (aRenvoye && !bRenvoye) return -1;
  if (bRenvoye && !aRenvoye) return 1;

  switch (this.tri()) {
    case 'recent': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    case 'ancien': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    case 'montant_desc': return b.montant_demande - a.montant_demande;
    case 'montant_asc': return a.montant_demande - b.montant_demande;
    default: return 0;
  }
});

    return liste;
  
}
aDesDocumentsRenvoyes(d: Dossier): boolean {
  return d.documents?.some(doc => doc.version > 1 && doc.statut_verification === 'en_attente') ?? false;
}
}