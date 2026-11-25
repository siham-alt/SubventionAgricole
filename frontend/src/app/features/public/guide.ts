import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
// Adapte le chemin selon l'emplacement réel de shared/header/ dans ton projet
import { Navbar } from '../../shared/navbar';

interface EtapeGuide {
  numero: string;
  titre: string;
  description: string;
  points: string[];
  statutLie?: string;
}

@Component({
  selector: 'app-guide',
  standalone: true,
  imports: [CommonModule, RouterLink, Navbar],
  templateUrl: './guide.html',
  styleUrl: './guide.scss',
})
export class Guide {
  etapeOuverte = signal<number>(0);

  etapes: EtapeGuide[] = [
    {
      numero: '01',
      titre: 'Créez votre dossier',
      description:
        'Choisissez le programme de subvention correspondant à votre projet (équipement, irrigation, plantation, élevage…) et renseignez les informations de votre exploitation.',
      points: [
        'Identité juridique (personne physique, coopérative, GIE, société)',
        'Localisation de l\u2019exploitation : région, province, commune, douar',
        'Description du projet et coût total estimé',
      ],
      statutLie: 'brouillon',
    },
    {
      numero: '02',
      titre: 'Réunissez vos documents',
      description:
        'Chaque programme précise la liste des pièces à fournir. Préparez des fichiers lisibles (PDF ou photo nette) avant de les téléverser.',
      points: [
        'Carte d\u2019identité nationale et, selon le cas, titre foncier ou attestation de tenure',
        'Devis ou factures liés au projet',
        'Relevé d\u2019identité bancaire (RIB) à votre nom',
      ],
    },
    {
      numero: '03',
      titre: 'Soumettez votre demande',
      description:
        'Une fois le dossier complet, déposez-le en ligne. Un numéro de dossier vous est attribué immédiatement pour le suivi.',
      points: [
        'Vérifiez chaque champ avant l\u2019envoi : aucune modification n\u2019est possible après soumission',
        'Vous recevez une confirmation avec la référence de votre dossier',
      ],
      statutLie: 'soumis',
    },
    {
      numero: '04',
      titre: 'Suivez la vérification',
      description:
        'Un agent examine la conformité de vos pièces. Si un document manque ou est illisible, un complément vous est demandé directement dans votre espace.',
      points: [
        'Statut « En cours de vérification » : votre dossier est en cours d\u2019analyse',
        'Statut « Complément demandé » : une action de votre part est nécessaire',
        'Vous êtes notifié à chaque changement de statut',
      ],
      statutLie: 'en_cours_verification',
    },
    {
      numero: '05',
      titre: 'Validation et décision',
      description:
        'Le dossier passe successivement par la validation de l\u2019agent instructeur puis du responsable habilité, qui prononce la décision finale.',
      points: [
        'Approuvé : le montant accordé est confirmé',
        'Refusé : le motif du refus est indiqué dans votre dossier',
      ],
      statutLie: 'en_validation_responsable',
    },
    {
      numero: '06',
      titre: 'Recevez le versement',
      description:
        'Après approbation, le montant est versé sur le compte bancaire renseigné dans votre dossier.',
      points: [
        'Le versement suit les délais du programme concerné',
        'Le statut passe à « Payé » une fois l\u2019opération effectuée',
      ],
      statutLie: 'paye',
    },
  ];

  toggle(index: number): void {
    this.etapeOuverte.set(this.etapeOuverte() === index ? -1 : index);
  }
}