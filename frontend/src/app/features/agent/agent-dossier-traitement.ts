import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DossierApi } from '../../core/services/dossier';
import { MessageApi, MessageItem } from '../../core/services/message';
import { Dossier, STATUTS_LABELS, STATUTS_COULEURS, STATUT_JURIDIQUE_LABELS,
  MODE_TENURE_LABELS, } from '../../core/models/dossier.model';
import { environment } from '../../../environments/environment';

type ActionModale = 'valider-doc' | 'refuser-doc' | 'complement' | 'refuser-dossier' | 'valider-dossier' | null;

@Component({
  selector: 'app-agent-dossier-traitement',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './agent-dossier-traitement.html',
  styleUrl: './agent-dossier-traitement.scss',
})
export class AgentDossierTraitement implements OnInit {
  private route = inject(ActivatedRoute);
  private dossierApi = inject(DossierApi);
  private messageApi = inject(MessageApi);
  private http = inject(HttpClient);

  dossier = signal<Dossier | null>(null);
  loading = signal(true);
  actionEnCours = signal(false);
  montantAccorde = signal<number | null>(null);
  statutsLabels = STATUTS_LABELS;
  statutsCouleurs = STATUTS_COULEURS;
statutJuridiqueLabels = STATUT_JURIDIQUE_LABELS;
modeTenureLabels = MODE_TENURE_LABELS;
  // Modales
  modaleActive = signal<ActionModale>(null);
  documentCible = signal<number | null>(null);
  texteMotif = signal('');

  // Messagerie
  messages = signal<MessageItem[]>([]);
  nouveauMessage = signal('');
  envoiMessageEnCours = signal(false);

  documentsLabels: Record<string, string> = {
    cin: 'CIN', titre_foncier: 'Titre foncier', devis: 'Devis',
    facture: 'Facture', attestation: 'Attestation', photo: 'Photo',
    releve_bancaire: 'Relevé bancaire', autre: 'Autre',
  };

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.dossierApi.getDossier(id).subscribe({
      next: (res) => {
        this.dossier.set(res.dossier);
        this.montantAccorde.set(res.dossier.montant_demande);
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

  get tousDocumentsVerifies(): boolean {
    return this.dossier()?.documents?.every(d => d.statut_verification !== 'en_attente') ?? false;
  }

  get documentsEnAttenteCount(): number {
    return this.dossier()?.documents?.filter(d => d.statut_verification === 'en_attente').length ?? 0;
  }

  consulterDocument(url: string | undefined): void {
    if (url) window.open(url, '_blank');
  }

  // ===== Ouverture des modales =====
  ouvrirValidationDoc(documentId: number): void {
    this.documentCible.set(documentId);
    this.modaleActive.set('valider-doc');
  }

  ouvrirRefusDoc(documentId: number): void {
    this.documentCible.set(documentId);
    this.texteMotif.set('');
    this.modaleActive.set('refuser-doc');
  }


  ouvrirRefusDossier(): void {
    this.texteMotif.set('');
    this.modaleActive.set('refuser-dossier');
  }

  ouvrirValidationDossier(): void {
    this.modaleActive.set('valider-dossier');
  }

  fermerModale(): void {
    this.modaleActive.set(null);
    this.documentCible.set(null);
    this.texteMotif.set('');
  }

  // ===== Actions confirmées =====
  confirmerValidationDoc(): void {
    if (!this.documentCible()) return;
    this.actionEnCours.set(true);
    this.http.post(`${environment.apiUrl}/api/documents/${this.documentCible()}/verifier`, {
      statut_verification: 'valide',
    }).subscribe({
      next: () => { this.actionEnCours.set(false); this.fermerModale(); this.charger(); },
      error: () => this.actionEnCours.set(false),
    });
  }

  confirmerRefusDoc(): void {
    if (!this.documentCible() || !this.texteMotif().trim()) return;
    this.actionEnCours.set(true);
    this.http.post(`${environment.apiUrl}/api/documents/${this.documentCible()}/verifier`, {
      statut_verification: 'refuse',
      commentaire_agent: this.texteMotif(),
    }).subscribe({
      next: () => { this.actionEnCours.set(false); this.fermerModale(); this.charger(); },
      error: () => this.actionEnCours.set(false),
    });
  }

 
  confirmerRefusDossier(): void {
    if (!this.texteMotif().trim() || !this.dossier()) return;
    this.actionEnCours.set(true);
    this.http.post(`${environment.apiUrl}/api/dossiers/${this.dossier()!.id}/statut`, {
      statut: 'refuse',
      commentaire: this.texteMotif(),
    }).subscribe({
      next: () => { this.actionEnCours.set(false); this.fermerModale(); this.charger(); },
      error: () => this.actionEnCours.set(false),
    });
  }

  confirmerValidationDossier(): void {
    if (!this.dossier()) return;
    this.actionEnCours.set(true);
    this.http.post(`${environment.apiUrl}/api/dossiers/${this.dossier()!.id}/statut`, {
      statut: 'approuve',
      montant_accorde: this.montantAccorde(),
    }).subscribe({
      next: () => { this.actionEnCours.set(false); this.fermerModale(); this.charger(); },
      error: () => this.actionEnCours.set(false),
    });
  }

  passerEnVerification(): void {
    if (!this.dossier()) return;
    this.actionEnCours.set(true);
    this.http.post(`${environment.apiUrl}/api/dossiers/${this.dossier()!.id}/statut`, {
      statut: 'en_cours_verification',
    }).subscribe({
      next: () => { this.actionEnCours.set(false); this.charger(); },
      error: () => this.actionEnCours.set(false),
    });
  }
  getStatutJuridique(d: Dossier): string {
  return this.statutJuridiqueLabels[d.statut_juridique ?? ''] ?? '—';
}

getModeTenure(d: Dossier): string {
  return this.modeTenureLabels[d.mode_tenure ?? ''] ?? '—';
}
}