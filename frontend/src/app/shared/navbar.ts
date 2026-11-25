import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
// Adapte ce chemin selon l'emplacement réel de shared/header/ dans ton projet
import { Auth } from '../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  auth = inject(Auth);
  private router = inject(Router);

  menuUtilisateurOuvert = signal(false);
  menuMobileOuvert = signal(false);

  initiales = computed(() => {
    const nom = this.auth.currentUser()?.name ?? '';
    return nom
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(mot => mot[0]?.toUpperCase())
      .join('');
  });

  toggleMenuUtilisateur(): void {
    this.menuUtilisateurOuvert.update(v => !v);
  }

  toggleMenuMobile(): void {
    this.menuMobileOuvert.update(v => !v);
  }

  allerVersEspace(): void {
    // Adapte la cible selon le rôle de l'utilisateur si nécessaire
    this.router.navigateByUrl('/agriculteur/tableau-bord');
  }

  deconnexion(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }

  // Ferme le menu utilisateur si on clique en dehors
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.menuUtilisateurOuvert()) return;
    const cible = event.target as HTMLElement;
    if (!cible.closest('.user-menu')) {
      this.menuUtilisateurOuvert.set(false);
    }
  }
}