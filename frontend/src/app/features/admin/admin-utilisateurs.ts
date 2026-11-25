import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminApi, UserStats } from '../../core/services/admin';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-admin-utilisateurs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-utilisateurs.html',
  styleUrl: './admin-utilisateurs.scss',
})
export class AdminUtilisateurs implements OnInit {
  private fb = inject(FormBuilder);
  private adminApi = inject(AdminApi);

  utilisateurs = signal<User[]>([]);
  stats = signal<UserStats | null>(null);
  loading = signal(true);
  filtreRole = signal('tous');
  recherche = signal('');

  modalOuvert = signal(false);
  modeEdition = signal(false);
  utilisateurEnEdition = signal<User | null>(null);
  errorMessage = signal('');

  detailOuvert = signal(false);
  utilisateurDetail = signal<any>(null);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    telephone: [''],
    role: ['agriculteur', Validators.required],
  });

  utilisateursFiltres = computed(() => {
    let liste = this.utilisateurs();
    if (this.recherche()) {
      const q = this.recherche().toLowerCase();
      liste = liste.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    return liste;
  });

  ngOnInit(): void {
    this.chargerStats();
    this.charger();
  }

  chargerStats(): void {
    this.adminApi.getUtilisateurStats().subscribe({
      next: (data) => this.stats.set(data),
    });
  }

  charger(): void {
    this.loading.set(true);
    const params: any = {};
    if (this.filtreRole() !== 'tous') params.role = this.filtreRole();

    this.adminApi.getUtilisateurs(params).subscribe({
      next: (res) => {
        this.utilisateurs.set(res.data ?? (res as any));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  changerFiltre(role: string): void {
    this.filtreRole.set(role);
    this.charger();
  }

  ouvrirCreation(): void {
    this.modeEdition.set(false);
    this.utilisateurEnEdition.set(null);
    this.errorMessage.set('');
    this.form.reset({ role: 'agriculteur' });
    this.form.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    this.form.get('password')?.updateValueAndValidity();
    this.modalOuvert.set(true);
  }

  ouvrirEdition(u: User): void {
    this.modeEdition.set(true);
    this.utilisateurEnEdition.set(u);
    this.errorMessage.set('');
    this.form.reset({
      name: u.name,
      email: u.email,
      telephone: u.telephone,
      role: u.roles?.[0]?.name ?? 'agriculteur',
    });
    this.form.get('password')?.clearValidators();
    this.form.get('password')?.updateValueAndValidity();
    this.modalOuvert.set(true);
  }

  fermerModal(): void {
    this.modalOuvert.set(false);
  }

  enregistrer(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valeurs: any = { ...this.form.value };
    if (!valeurs.password) delete valeurs.password;

    const action = this.modeEdition() && this.utilisateurEnEdition()
      ? this.adminApi.modifierUtilisateur(this.utilisateurEnEdition()!.id, valeurs)
      : this.adminApi.creerUtilisateur(valeurs);

    action.subscribe({
      next: () => {
        this.fermerModal();
        this.charger();
        this.chargerStats();
      },
      error: (err) => this.errorMessage.set(err.error?.message || 'Erreur lors de l\'enregistrement'),
    });
  }

  voirDetail(u: User): void {
    this.adminApi.getUtilisateurDetail(u.id).subscribe({
      next: (data) => {
        this.utilisateurDetail.set(data);
        this.detailOuvert.set(true);
      },
    });
  }

  fermerDetail(): void {
    this.detailOuvert.set(false);
  }

  toggleActif(u: User): void {
    this.adminApi.toggleActif(u.id).subscribe(() => {
      this.charger();
      this.chargerStats();
    });
  }

  supprimer(u: User): void {
    if (!confirm(`Supprimer définitivement ${u.name} ? Cette action est irréversible.`)) return;
    this.adminApi.supprimerUtilisateur(u.id).subscribe(() => {
      this.charger();
      this.chargerStats();
    });
  }
}