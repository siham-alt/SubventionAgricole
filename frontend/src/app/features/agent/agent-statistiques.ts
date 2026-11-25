import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatistiqueApi } from '../../core/services/statistique';
import { STATUTS_LABELS } from '../../core/models/dossier.model';

@Component({
  selector: 'app-agent-statistiques',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './agent-statistiques.html',
  styleUrl: './agent-statistiques.scss',
})
export class AgentStatistiques implements OnInit {
  private statistiqueApi = inject(StatistiqueApi);

  stats = signal<any>(null);
  loading = signal(true);
  statutsLabels = STATUTS_LABELS;

  maxActivite = 1;
  maxStatut = 1;

  ngOnInit(): void {
    this.statistiqueApi.getStatsAgentPersonnel().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.maxActivite = Math.max(...data.activite_7_jours.map((a: any) => a.total), 1);
        this.maxStatut = Math.max(...data.par_statut.map((s: any) => s.total), 1);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  hauteurActivite(total: number): number {
    return (total / this.maxActivite) * 120 + 8;
  }

  pourcentageStatut(total: number): number {
    return (total / this.maxStatut) * 100;
  }

  joursDepuisSoumission(date: string): number {
    if (!date) return 0;
    const diff = Date.now() - new Date(date).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
}