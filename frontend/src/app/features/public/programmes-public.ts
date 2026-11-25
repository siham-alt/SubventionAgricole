import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../shared/navbar';
// Adapte ces chemins selon l'emplacement réel des fichiers dans ton projet
import { TYPES_DOCUMENTS_LABELS } from '../../core/models/dossier.model';
import { ProgrammeApi } from '../../core/services/programme';
import { Programme } from '../../core/models/programme.model';

@Component({
  selector: 'app-programmes-public',
  standalone: true,
  imports: [CommonModule, RouterLink, Navbar],
  templateUrl: './programmes-public.html',
  styleUrl: './programmes-public.scss',
})
export class ProgrammesPublic implements OnInit {
  private programmeApi = inject(ProgrammeApi);

  loading = signal(true);
  programmes = signal<Programme[]>([]);
  recherche = signal('');
  documentsLabels = TYPES_DOCUMENTS_LABELS;

  programmesFiltres = computed(() => {
    const terme = this.recherche().trim().toLowerCase();
    if (!terme) return this.programmes();
    return this.programmes().filter(p =>
      p.nom_fr.toLowerCase().includes(terme) ||
      (p.description_fr ?? '').toLowerCase().includes(terme)
    );
  });

  ngOnInit(): void {
    this.programmeApi.getProgrammes().subscribe({
      next: (res) => {
        this.programmes.set(res); // res est déjà Programme[], pas { data: ... }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  miseAJourRecherche(valeur: string): void {
    this.recherche.set(valeur);
  }
}