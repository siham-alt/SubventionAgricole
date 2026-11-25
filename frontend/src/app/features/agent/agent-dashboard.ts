import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { StatistiqueApi } from '../../core/services/statistique';
import { StatsAgent } from '../../core/models/statistique.model';
import { STATUTS_LABELS } from '../../core/models/dossier.model';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './agent-dashboard.html',
  styleUrl: './agent-dashboard.scss',
})
export class AgentDashboard implements OnInit {
  auth = inject(Auth);
  private statistiqueApi = inject(StatistiqueApi);

  stats = signal<StatsAgent | null>(null);
  loading = signal(true);
  statutsLabels = STATUTS_LABELS;

  maxParStatut = 1;

  premierPrenom(): string {
    return this.auth.currentUser()?.name?.split(' ')[0] ?? '';
  }

  ngOnInit(): void {
    this.statistiqueApi.getStatsAgent().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.maxParStatut = Math.max(...data.par_statut.map(s => s.total), 1);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  pourcentageBarre(total: number): number {
    return (total / this.maxParStatut) * 100;
  }

  joursDepuisSoumission(date: string | null): number | null {
    if (!date) return null;
    const diff = Date.now() - new Date(date).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
}