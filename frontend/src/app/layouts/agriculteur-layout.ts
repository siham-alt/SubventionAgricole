import { Component, inject, signal, effect, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, RouterLinkActive, Router } from '@angular/router';
import { Auth } from '../core/services/auth';
import { NotificationApi } from '../core/services/notification';

@Component({
  selector: 'app-agriculteur-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './agriculteur-layout.html',
  styleUrl: './agriculteur-layout.scss',
})
export class AgriculteurLayout implements OnInit, OnDestroy {
  private notificationApi = inject(NotificationApi);
  private previousCount = 0;
  private pollingInterval?: ReturnType<typeof setInterval>;

  auth = inject(Auth);
  private router = inject(Router);

  menuOuvert = signal(false);
  animerCloche = signal(false);

  // Le compteur vit dans le service (partagé dans toute l'appli) — on le lit directement ici.
  notificationsNonLues = this.notificationApi.nonLuesCount;

  constructor() {
    // Réagit à chaque changement du signal du service, où qu'il soit déclenché
    effect(() => {
      const compteActuel = this.notificationsNonLues();
      if (compteActuel > this.previousCount) {
        this.declencherAlerte();
      }
      this.previousCount = compteActuel;
    });
  }

  ngOnInit(): void {
    this.notificationApi.chargerNonLues();
    // Polling toutes les 25s (à remplacer par un push WebSocket/Echo plus tard)
    this.pollingInterval = setInterval(() => this.notificationApi.chargerNonLues(), 25000);
  }

  ngOnDestroy(): void {
    clearInterval(this.pollingInterval);
  }

  private declencherAlerte(): void {
    this.animerCloche.set(true);
    setTimeout(() => this.animerCloche.set(false), 700);
  }

  toggleMenu(): void {
    this.menuOuvert.update((v) => !v);
  }

  seDeconnecter(): void {
    this.auth.logout();
  }
}