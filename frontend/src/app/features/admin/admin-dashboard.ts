import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatistiqueApi } from '../../core/services/statistique';
import { StatsAdmin } from '../../core/models/statistique.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit {
  private statistiqueApi = inject(StatistiqueApi);

  stats = signal<StatsAdmin | null>(null);
  loading = signal(true);
statsAgents = signal<any[]>([]);

  maxParRegion = 1;
  maxParMois = 1;

  ngOnInit(): void {
    this.statistiqueApi.getStatsAdmin().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.maxParRegion = Math.max(...data.par_region.map(r => r.total), 1);
        this.maxParMois = Math.max(...data.par_mois.map(m => m.total), 1);
        this.loading.set(false);
        this.statistiqueApi.getStatsParAgent().subscribe(data => this.statsAgents.set(data));
      },
      error: () => this.loading.set(false),
    });
  }

  pourcentageRegion(total: number): number {
    return (total / this.maxParRegion) * 100;
  }

  hauteurMois(total: number): number {
    return (total / this.maxParMois) * 140 + 10;
  }
}