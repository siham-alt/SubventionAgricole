import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
// Adapte le chemin selon l'emplacement réel de shared/header/ dans ton projet
import { Navbar } from '../../shared/navbar';

interface Question {
  q: string;
  r: string;
}

interface Categorie {
  cle: string;
  titre: string;
  questions: Question[];
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterLink, Navbar],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq {
  categorieActive = signal<string>('avant');
  questionOuverte = signal<string | null>(null);

  categories: Categorie[] = [
    {
      cle: 'avant',
      titre: 'Avant de déposer',
      questions: [
        {
          q: 'Qui peut déposer une demande de subvention agricole ?',
          r: 'Toute personne physique exploitant une terre agricole, ainsi que les coopératives, groupements d\u2019intérêt économique (GIE) et sociétés agricoles régulièrement constitués, peuvent déposer une demande, selon les conditions propres à chaque programme.',
        },
        {
          q: 'Puis-je déposer plusieurs demandes pour différents projets ?',
          r: 'Oui, vous pouvez ouvrir un dossier par projet et par programme de subvention, du moment que chaque projet correspond à une exploitation et des pièces justificatives distinctes.',
        },
        {
          q: 'Comment savoir quel programme correspond à mon projet ?',
          r: 'La page Programmes liste les subventions actives avec leur objet, le taux de subvention et le montant maximal accordé. Chaque fiche précise les critères d\u2019éligibilité avant que vous ne commenciez votre dossier.',
        },
      ],
    },
    {
      cle: 'documents',
      titre: 'Documents',
      questions: [
        {
          q: 'Quels documents dois-je fournir ?',
          r: 'La liste exacte dépend du programme choisi, mais elle inclut généralement une carte d\u2019identité nationale, un justificatif de tenure (titre foncier, melk ou attestation), un devis ou une facture, et un relevé d\u2019identité bancaire.',
        },
        {
          q: 'Quel format de fichier est accepté ?',
          r: 'Les documents sont acceptés en PDF, JPG ou PNG. Veillez à ce que le texte soit net et entièrement lisible : un document flou peut entraîner une demande de complément.',
        },
        {
          q: 'Puis-je remplacer un document après l\u2019avoir téléversé ?',
          r: 'Oui, tant que le dossier n\u2019a pas été soumis. Une fois soumis, seul un complément demandé par l\u2019agent instructeur permet de mettre à jour une pièce.',
        },
      ],
    },
    {
      cle: 'suivi',
      titre: 'Délais et statuts',
      questions: [
        {
          q: 'Combien de temps prend le traitement d\u2019un dossier ?',
          r: 'Le délai varie selon le programme et la complexité du projet. Chaque changement d\u2019étape est notifié, et l\u2019avancement est visible en temps réel dans votre espace, dossier par dossier.',
        },
        {
          q: 'Que signifie le statut « Complément demandé » ?',
          r: 'L\u2019agent instructeur a besoin d\u2019une pièce supplémentaire ou d\u2019une correction pour poursuivre l\u2019examen. Le détail de ce qui est attendu est indiqué directement sur votre dossier.',
        },
        {
          q: 'Quelle différence entre validation agent et validation responsable ?',
          r: 'La validation agent correspond à l\u2019examen technique du dossier. La validation responsable est l\u2019étape finale de décision, qui confirme l\u2019approbation ou le refus.',
        },
      ],
    },
    {
      cle: 'apres',
      titre: 'Paiement et suite',
      questions: [
        {
          q: 'Quand et comment le montant est-il versé ?',
          r: 'Une fois le dossier approuvé, le montant accordé est viré sur le compte bancaire renseigné lors du dépôt. Le statut de votre dossier passe alors à « Payé ».',
        },
        {
          q: 'Ma demande a été refusée, que faire ?',
          r: 'Le motif du refus est consultable dans le détail de votre dossier. Selon le motif, vous pouvez déposer une nouvelle demande en tenant compte des observations formulées.',
        },
        {
          q: 'Puis-je redéposer une demande après un refus ?',
          r: 'Oui. Rien n\u2019empêche de soumettre un nouveau dossier, à condition de répondre aux critères d\u2019éligibilité et de corriger les points ayant motivé le refus précédent.',
        },
      ],
    },
  ];

  get categorieCourante(): Categorie {
    return this.categories.find(c => c.cle === this.categorieActive()) ?? this.categories[0];
  }

  choisirCategorie(cle: string): void {
    this.categorieActive.set(cle);
    this.questionOuverte.set(null);
  }

  toggleQuestion(q: string): void {
    this.questionOuverte.set(this.questionOuverte() === q ? null : q);
  }
}