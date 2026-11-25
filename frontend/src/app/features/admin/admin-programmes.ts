import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DossierApi } from '../../core/services/dossier';
import { AdminApi } from '../../core/services/admin';
import { TypeSubvention } from '../../core/models/dossier.model';

@Component({
  selector: 'app-admin-programmes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-programmes.html',
  styleUrl: './admin-programmes.scss',
})
export class AdminProgrammes implements OnInit {
  private fb = inject(FormBuilder);
  private dossierApi = inject(DossierApi);
  private adminApi = inject(AdminApi);

  programmes = signal<TypeSubvention[]>([]);
  loading = signal(true);
  modalOuvert = signal(false);
  modeEdition = signal(false);
  programmeEnEdition = signal<TypeSubvention | null>(null);

  documentsDisponibles = ['cin', 'titre_foncier', 'devis', 'facture', 'attestation', 'photo', 'releve_bancaire', 'autre'];
  documentsLabels: Record<string, string> = {
    cin: 'CIN', titre_foncier: 'Titre foncier', devis: 'Devis',
    facture: 'Facture', attestation: 'Attestation', photo: 'Photo',
    releve_bancaire: 'Relevé bancaire', autre: 'Autre',
  };

  form = this.fb.group({
    nom_fr: ['', Validators.required],
    description_fr: [''],
    montant_max: [0, Validators.required],
    taux_subvention: [0, [Validators.required, Validators.max(100)]],
    documents_requis: this.fb.array(this.documentsDisponibles.map(() => this.fb.control(false))),
  });

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.dossierApi.getTypesSubvention().subscribe({
      next: (data) => {
        this.programmes.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  ouvrirCreation(): void {
    this.modeEdition.set(false);
    this.programmeEnEdition.set(null);
    this.form.reset({ montant_max: 0, taux_subvention: 0 });
    this.form.setControl('documents_requis', this.fb.array(this.documentsDisponibles.map(() => this.fb.control(false))));
    this.modalOuvert.set(true);
  }

  ouvrirEdition(programme: TypeSubvention): void {
    this.modeEdition.set(true);
    this.programmeEnEdition.set(programme);
    this.form.patchValue({
      nom_fr: programme.nom_fr,
      description_fr: programme.description_fr,
      montant_max: programme.montant_max,
      taux_subvention: programme.taux_subvention,
    });
    this.form.setControl('documents_requis', this.fb.array(
      this.documentsDisponibles.map(doc => this.fb.control(programme.documents_requis?.includes(doc) ?? false))
    ));
    this.modalOuvert.set(true);
  }

  fermerModal(): void {
    this.modalOuvert.set(false);
  }

  enregistrer(): void {
    const valeurs = this.form.value;
    const documentsChoisis = this.documentsDisponibles.filter((_, i) => valeurs.documents_requis![i]);

    const payload = {
      nom_fr: valeurs.nom_fr,
      description_fr: valeurs.description_fr,
      montant_max: valeurs.montant_max,
      taux_subvention: valeurs.taux_subvention,
      documents_requis: documentsChoisis,
    };

    if (this.modeEdition() && this.programmeEnEdition()) {
      this.adminApi.modifierProgramme(this.programmeEnEdition()!.id, payload).subscribe(() => {
        this.fermerModal();
        this.charger();
      });
    } else {
      this.adminApi.creerProgramme(payload).subscribe(() => {
        this.fermerModal();
        this.charger();
      });
    }
  }

  supprimer(programme: TypeSubvention): void {
    if (!confirm(`Supprimer le programme "${programme.nom_fr}" ?`)) return;
    this.adminApi.supprimerProgramme(programme.id).subscribe(() => this.charger());
  }
}