import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DossierApi } from '../../core/services/dossier';
import { Exploitation, TypeSubvention } from '../../core/models/dossier.model';
import { REGIONS_MAROC } from '../../core/data/regions-maroc';

@Component({
  selector: 'app-demande-nouvelle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './demande-nouvelle.html',
  styleUrl: './demande-nouvelle.scss',
})
export class DemandeNouvelle implements OnInit {
  private fb = inject(FormBuilder);
  private dossierApi = inject(DossierApi);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  etapeActuelle = signal(1);
  loading = signal(false);
  errorMessage = signal('');
  glisserActif = signal(false);

  typesSubvention = signal<TypeSubvention[]>([]);
  typeSelectionne = signal<TypeSubvention | null>(null);
  exploitations = signal<Exploitation[]>([]);
  dossierId = signal<number | null>(null);

  documentsUploades = signal<Record<string, { nom: string; ok: boolean }>>({});
  uploadingType = signal<string | null>(null);

  documentsLabels: Record<string, string> = {
    cin: 'Carte d\'identité nationale (CIN)',
    titre_foncier: 'Titre foncier',
    devis: 'Devis',
    facture: 'Facture',
    attestation: 'Attestation',
    photo: 'Photo de l\'exploitation',
    releve_bancaire: 'Relevé bancaire',
    autre: 'Autre document',
  };

  regions = REGIONS_MAROC;

  // Étape 2 : infos exploitation / projet
  formInfos = this.fb.group({
    exploitation_id: [null as number | null],
    nom_exploitation: ['', Validators.required],
    type_exploitation: ['cereales', Validators.required],
    superficie_hectares: [0, [Validators.required, Validators.min(0.1)]],
    region: ['', Validators.required],
    province: ['', Validators.required],
    commune: ['', Validators.required],
    montant_demande: [0, [Validators.required, Validators.min(1)]],
    description_projet: [''],

    // Identité juridique
    statut_juridique: ['physique', Validators.required],
    numero_immatriculation: [''],
    numero_cnss: [''],
    nom_representant_legal: [''],

    // Statut foncier
    mode_tenure: ['proprietaire', Validators.required],
    numero_titre_foncier: [''],

    // Détails techniques
    nombre_unites: [null as number | null],
    type_equipement: [''],
    cout_total_projet: [null as number | null, Validators.required],
    apport_personnel: [null as number | null, Validators.required],
    date_debut_prevue: [''],
    date_fin_prevue: [''],

    // Bancaire
    rib: ['', [Validators.required, Validators.pattern(/^[0-9]{24}$/)]],
    nom_banque: ['', Validators.required],
    agence_bancaire: [''],

    // Antécédents
    a_deja_beneficie: [false],
    reference_subvention_precedente: [''],

    // Contact projet
    telephone_contact_projet: [''],
    email_contact_projet: ['', Validators.email],
  });

  get afficherRepresentantLegal(): boolean {
    const statut = this.formInfos.get('statut_juridique')?.value;
    return statut !== 'physique';
  }

  documentsRequis = computed(() => this.typeSelectionne()?.documents_requis ?? []);
  tousDocumentsUploades = computed(() => {
    const requis = this.documentsRequis();
    const uploades = this.documentsUploades();
    return requis.length > 0 && requis.every(doc => uploades[doc]?.ok);
  });

  get availableProvinces() {
    const regionNom = this.formInfos.get('region')?.value;
    const region = this.regions.find(r => r.nom === regionNom);
    return region ? region.provinces : [];
  }

  get availableCommunes(): string[] {
    const provinceNom = this.formInfos.get('province')?.value;
    const province = this.availableProvinces.find(p => p.nom === provinceNom);
    return province ? province.communes : [];
  }

  onRegionChange(): void {
    this.formInfos.patchValue({ province: '', commune: '' });
  }

  onProvinceChange(): void {
    this.formInfos.patchValue({ commune: '' });
  }

  ngOnInit(): void {
    this.dossierApi.getExploitations().subscribe(data => this.exploitations.set(data));
    this.dossierApi.getTypesSubvention().subscribe(data => {
      this.typesSubvention.set(data);

      const dossierIdParam = this.route.snapshot.queryParamMap.get('dossier');
      if (dossierIdParam) {
        this.reprendreBrouillon(Number(dossierIdParam), data);
      }
    });
  }

  // ===== Reprise d'un brouillon existant =====
  private reprendreBrouillon(id: number, typesDisponibles: TypeSubvention[]): void {
    this.dossierApi.getDossier(id).subscribe({
      next: (res) => {
        const d = res.dossier;

        if (d.statut !== 'brouillon') {
          this.router.navigate(['/agriculteur/demandes', d.id]);
          return;
        }

        this.dossierId.set(d.id);

        const type = typesDisponibles.find(t => t.id === d.type_subvention?.id);
        if (type) this.typeSelectionne.set(type);

        this.formInfos.patchValue({
          exploitation_id: d.exploitation?.id ?? null,
          nom_exploitation: d.exploitation?.nom_exploitation,
          type_exploitation: d.exploitation?.type_exploitation,
          superficie_hectares: d.exploitation?.superficie_hectares,
          region: d.exploitation?.region,
          province: d.exploitation?.province,
          commune: d.exploitation?.commune,
          montant_demande: d.montant_demande,
          description_projet: d.description_projet,
          statut_juridique: d.statut_juridique,
          numero_immatriculation: d.numero_immatriculation,
          numero_cnss: d.numero_cnss,
          nom_representant_legal: d.nom_representant_legal,
          mode_tenure: d.mode_tenure,
          numero_titre_foncier: d.numero_titre_foncier,
          nombre_unites: d.nombre_unites,
          type_equipement: d.type_equipement,
          cout_total_projet: d.cout_total_projet,
          apport_personnel: d.apport_personnel,
          date_debut_prevue: d.date_debut_prevue,
          date_fin_prevue: d.date_fin_prevue,
          rib: d.rib,
          nom_banque: d.nom_banque,
          agence_bancaire: d.agence_bancaire,
          a_deja_beneficie: d.a_deja_beneficie,
          reference_subvention_precedente: d.reference_subvention_precedente,
          telephone_contact_projet: d.telephone_contact_projet,
          email_contact_projet: d.email_contact_projet,
        });

        const docsExistants: Record<string, { nom: string; ok: boolean }> = {};
        (d.documents ?? []).forEach(doc => {
          docsExistants[doc.type_document] = { nom: doc.nom_original, ok: true };
        });
        this.documentsUploades.set(docsExistants);

        // Le dossier existe déjà avec ses infos → direct à l'étape Documents
        this.etapeActuelle.set(3);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger ce brouillon.');
      },
    });
  }

  // ===== Étape 1 : choix subvention =====
  selectionnerType(type: TypeSubvention): void {
    this.typeSelectionne.set(type);
  }

  passerEtape2(): void {
    if (!this.typeSelectionne()) {
      this.errorMessage.set('Veuillez choisir un programme de subvention');
      return;
    }
    this.errorMessage.set('');
    this.etapeActuelle.set(2);
  }

  // ===== Étape 2 : infos =====
  choisirExploitation(id: number): void {
    const exp = this.exploitations().find(e => e.id === id);
    if (exp) {
      this.formInfos.patchValue({
        exploitation_id: exp.id,
        nom_exploitation: exp.nom_exploitation,
        type_exploitation: exp.type_exploitation,
        superficie_hectares: exp.superficie_hectares,
        region: exp.region,
        province: exp.province,
        commune: exp.commune,
      });
    }
  }

  private construireDonneesDossier(exploitationId: number) {
    const v = this.formInfos.value;
    return {
      exploitation_id: exploitationId,
      type_subvention_id: this.typeSelectionne()!.id,
      montant_demande: v.montant_demande,
      description_projet: v.description_projet,

      statut_juridique: v.statut_juridique,
      numero_immatriculation: v.numero_immatriculation,
      numero_cnss: v.numero_cnss,
      nom_representant_legal: v.nom_representant_legal,

      mode_tenure: v.mode_tenure,
      numero_titre_foncier: v.numero_titre_foncier,

      nombre_unites: v.nombre_unites,
      type_equipement: v.type_equipement,
      cout_total_projet: v.cout_total_projet,
      apport_personnel: v.apport_personnel,
      date_debut_prevue: v.date_debut_prevue || null,
      date_fin_prevue: v.date_fin_prevue || null,

      rib: v.rib,
      nom_banque: v.nom_banque,
      agence_bancaire: v.agence_bancaire,

      a_deja_beneficie: v.a_deja_beneficie,
      reference_subvention_precedente: v.reference_subvention_precedente,

      telephone_contact_projet: v.telephone_contact_projet,
      email_contact_projet: v.email_contact_projet,
    };
  }

  passerEtape3(): void {
    if (this.formInfos.invalid) {
      this.formInfos.markAllAsTouched();
      this.errorMessage.set('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const valeurs = this.formInfos.value;

    if (valeurs.exploitation_id) {
      this.dossierApi.creerDossier(this.construireDonneesDossier(valeurs.exploitation_id)).subscribe({
        next: (res) => {
          this.loading.set(false);
          this.dossierId.set(res.dossier.id);
          this.etapeActuelle.set(3);
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.error?.message || 'Erreur lors de la création');
        },
      });
    } else {
      this.dossierApi.creerExploitation({
        nom_exploitation: valeurs.nom_exploitation!,
        type_exploitation: valeurs.type_exploitation!,
        superficie_hectares: valeurs.superficie_hectares!,
        region: valeurs.region!,
        province: valeurs.province!,
        commune: valeurs.commune!,
      }).subscribe({
        next: (resExp) => {
          this.dossierApi.creerDossier(this.construireDonneesDossier(resExp.exploitation.id)).subscribe({
            next: (resDossier) => {
              this.loading.set(false);
              this.dossierId.set(resDossier.dossier.id);
              this.etapeActuelle.set(3);
            },
            error: (err) => {
              this.loading.set(false);
              this.errorMessage.set(err.error?.message || 'Erreur lors de la création du dossier');
            },
          });
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.error?.message || "Erreur lors de la création de l'exploitation");
        },
      });
    }
  }

  // ===== Étape 3 : documents (drag & drop) =====
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.glisserActif.set(true);
  }

  onDragLeave(): void {
    this.glisserActif.set(false);
  }

  onDrop(event: DragEvent, typeDocument: string): void {
    event.preventDefault();
    this.glisserActif.set(false);
    const fichier = event.dataTransfer?.files?.[0];
    if (fichier) this.uploaderFichier(fichier, typeDocument);
  }

  onFichierSelectionne(event: Event, typeDocument: string): void {
    const input = event.target as HTMLInputElement;
    const fichier = input.files?.[0];
    if (fichier) this.uploaderFichier(fichier, typeDocument);
  }

  private uploaderFichier(fichier: File, typeDocument: string): void {
    if (!this.dossierId()) return;

    this.uploadingType.set(typeDocument);

    this.dossierApi.uploadDocument(this.dossierId()!, typeDocument, fichier).subscribe({
      next: () => {
        this.uploadingType.set(null);
        this.documentsUploades.update(docs => ({
          ...docs,
          [typeDocument]: { nom: fichier.name, ok: true },
        }));
      },
      error: (err) => {
        this.uploadingType.set(null);
        this.errorMessage.set(err.error?.message || 'Erreur lors du téléversement');
      },
    });
  }

  passerEtape4(): void {
    if (!this.tousDocumentsUploades()) {
      this.errorMessage.set('Veuillez téléverser tous les documents requis');
      return;
    }
    this.errorMessage.set('');
    this.etapeActuelle.set(4);
  }

  // ===== Étape 4 : résumé + soumission =====
  soumettreDossier(): void {
    if (!this.dossierId()) return;

    this.loading.set(true);
    this.errorMessage.set('');

    this.dossierApi.soumettreDossier(this.dossierId()!).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/agriculteur/demandes', this.dossierId()]);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Erreur lors de la soumission');
      },
    });
  }

  retourEtape(etape: number): void {
    this.etapeActuelle.set(etape);
  }
}