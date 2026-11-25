import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../core/services/auth';
import { ProgrammeApi } from '../core/services/programme';
import { Programme } from '../core/models/programme.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  auth = inject(Auth);
  private router = inject(Router);
  private programmeApi = inject(ProgrammeApi);

  programmes = signal<Programme[]>([]);
  menuMobileOuvert = signal(false);
  menuUtilisateurOuvert = signal(false);

  // Initiales calculées à partir du nom (ou de l'email à défaut) de l'utilisateur connecté
  initiales = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return '';

    if (user.name) {
      return user.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part: string) => part[0]?.toUpperCase())
        .join('');
    }

    return user.email?.[0]?.toUpperCase() ?? '?';
  });

  faqItems = [
    {
      question: 'Qui peut bénéficier des subventions agricoles ?',
      reponse:
        "Tout agriculteur possédant une exploitation agricole enregistrée peut déposer une demande, sous réserve de remplir les conditions spécifiques à chaque programme.",
      ouvert: signal(false),
    },
    {
      question: 'Quels documents sont nécessaires pour déposer une demande ?',
      reponse:
        "Les documents varient selon le programme choisi : CIN, titre foncier, devis, factures, attestations et photos de l'exploitation sont généralement demandés.",
      ouvert: signal(false),
    },
    {
      question: "Combien de temps prend le traitement d'un dossier ?",
      reponse:
        "Le délai moyen de traitement varie entre 15 et 45 jours selon le programme et la complexité du dossier, après vérification complète des pièces justificatives.",
      ouvert: signal(false),
    },
    {
      question: 'Comment suivre l\'état de ma demande ?',
      reponse:
        "Une fois connecté à votre espace, vous pouvez suivre en temps réel l'état d'avancement de votre dossier et recevoir des notifications à chaque étape.",
      ouvert: signal(false),
    },
  ];

  ngOnInit(): void {
    this.programmeApi
      .getProgrammes()
      .subscribe((data) => this.programmes.set(data.slice(0, 3)));
  }

  demanderSubvention(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/agriculteur/demandes/nouvelle']);
    } else {
      this.router.navigate(['/login'], {
        queryParams: { redirect: '/agriculteur/demandes/nouvelle' },
      });
    }
  }

  allerVersEspace(): void {
    if (this.auth.hasRole('agent')) {
      this.router.navigate(['/agent']);
    } else if (
      this.auth.hasRole('responsable') ||
      this.auth.hasRole('administrateur')
    ) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/agriculteur']);
    }
  }

  toggleFaq(item: any): void {
    item.ouvert.update((v: boolean) => !v);
  }

  toggleMenuMobile(): void {
    this.menuMobileOuvert.update((v) => !v);
  }

  toggleMenuUtilisateur(): void {
    this.menuUtilisateurOuvert.update((v) => !v);
  }

  deconnexion(): void {
    this.auth.logout();
    this.menuUtilisateurOuvert.set(false);
    this.router.navigate(['/']);
  }

  // Ferme le dropdown utilisateur si on clique en dehors
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      this.menuUtilisateurOuvert.set(false);
    }
  }
}