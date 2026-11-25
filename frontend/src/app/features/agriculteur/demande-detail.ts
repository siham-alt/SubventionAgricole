import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DossierApi } from '../../core/services/dossier';
import { MessageApi, MessageItem } from '../../core/services/message';
import { Dossier, STATUTS_LABELS, STATUTS_COULEURS } from '../../core/models/dossier.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-demande-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './demande-detail.html',
  styleUrl: './demande-detail.scss',
})
export class DemandeDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private dossierApi = inject(DossierApi);
  private messageApi = inject(MessageApi);
  private http = inject(HttpClient);

  dossier = signal<Dossier | null>(null);
  loading = signal(true);
  statutsLabels = STATUTS_LABELS;
  statutsCouleurs = STATUTS_COULEURS;
  uploadEnCours = signal<number | null>(null);
  errorMessage = signal('');

  messages = signal<MessageItem[]>([]);
  nouveauMessage = signal('');
  envoiMessageEnCours = signal(false);

  documentsLabels: Record<string, string> = {
    cin: 'CIN',
    titre_foncier: 'Titre foncier',
    devis: 'Devis',
    facture: 'Facture',
    attestation: 'Attestation',
    photo: 'Photo',
    releve_bancaire: 'Relevé bancaire',
    autre: 'Autre',
  };

  documentsARefaire = computed(() =>
    this.dossier()?.documents?.filter(d => d.statut_verification === 'refuse') ?? []
  );

  aBesoinAction = computed(() => this.documentsARefaire().length > 0);

  enAttenteAgent = computed(() =>
    this.dossier()?.statut === 'complement_demande' && this.documentsARefaire().length === 0
  );

  historique = computed(() => this.dossier()?.historique ?? []);

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.dossierApi.getDossier(id).subscribe({
      next: (res) => {
        this.dossier.set(res.dossier);
        this.loading.set(false);
        this.chargerMessages(id);
      },
      error: () => this.loading.set(false),
    });
  }

  chargerMessages(dossierId: number): void {
    this.messageApi.getMessages(dossierId).subscribe(msgs => this.messages.set(msgs));
  }

  envoyerMessage(): void {
    if (!this.nouveauMessage().trim() || !this.dossier()) return;
    this.envoiMessageEnCours.set(true);
    this.messageApi.envoyerMessage(this.dossier()!.id, this.nouveauMessage()).subscribe({
      next: () => {
        this.nouveauMessage.set('');
        this.envoiMessageEnCours.set(false);
        this.chargerMessages(this.dossier()!.id);
      },
      error: () => this.envoiMessageEnCours.set(false),
    });
  }

  onFichierChoisi(event: Event, documentId: number): void {
    const input = event.target as HTMLInputElement;
    const fichier = input.files?.[0];
    if (!fichier) return;

    this.uploadEnCours.set(documentId);
    this.errorMessage.set('');

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;

      this.http.post(`${environment.apiUrl}/api/documents/${documentId}/remplacer`, {
        fichier_base64: base64,
        nom_fichier: fichier.name,
      }).subscribe({
        next: () => {
          this.uploadEnCours.set(null);
          this.charger();
        },
        error: (err) => {
          this.uploadEnCours.set(null);
          this.errorMessage.set(err.error?.message || 'Erreur lors du renvoi du document');
        },
      });
    };
    reader.onerror = () => {
      this.uploadEnCours.set(null);
      this.errorMessage.set('Erreur lors de la lecture du fichier');
    };
    reader.readAsDataURL(fichier);
  }

  getLabelDocument(type: string): string {
    return this.documentsLabels[type] || type;
  }

  getIconAction(action: string): string {
    const icons: Record<string, string> = {
      creation: '📝',
      ajout_document: '📎',
      remplacement_document: '🔄',
      changement_statut: '🔔',
    };
    return icons[action] || '•';
  }

  formatAction(action: string): string {
    const labels: Record<string, string> = {
      creation: 'Dossier créé',
      ajout_document: 'Document ajouté',
      remplacement_document: 'Document renvoyé',
      changement_statut: 'Changement de statut',
    };
    return labels[action] || action;
  }

  getStatutJuridique(d: Dossier): string {
    const labels: Record<string, string> = {
      physique: 'Personne physique',
      cooperative: 'Coopérative',
      gie: 'GIE',
      societe: 'Société agricole',
    };
    return d.statut_juridique ? (labels[d.statut_juridique] || d.statut_juridique) : '—';
  }

  getModeTenure(d: Dossier): string {
    const labels: Record<string, string> = {
      proprietaire: 'Propriétaire',
      locataire: 'Locataire',
      melk: 'Melk',
      collectif: 'Terrain collectif',
      domaine_etat: "Domaine de l'État",
    };
    return d.mode_tenure ? (labels[d.mode_tenure] || d.mode_tenure) : '—';
  }
}