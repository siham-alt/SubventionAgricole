import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-parametres',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-parametres.html',
  styleUrl: './admin-parametres.scss',
})
export class AdminParametres implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  loadingParams = signal(false);
  loadingPassword = signal(false);
  successParams = signal('');
  successPassword = signal('');
  errorPassword = signal('');

  formParametres = this.fb.group({
    email_contact: [''],
    telephone_contact: [''],
    delai_legal_traitement_jours: [30],
    inscriptions_ouvertes: [true],
  });

  formPassword = this.fb.group({
    mot_de_passe_actuel: ['', Validators.required],
    nouveau_mot_de_passe: ['', [Validators.required, Validators.minLength(8)]],
    nouveau_mot_de_passe_confirmation: ['', Validators.required],
  });

  ngOnInit(): void {
    this.http.get<any>(`${environment.apiUrl}/api/parametres`).subscribe({
      next: (data) => this.formParametres.patchValue(data),
    });
  }

  enregistrerParametres(): void {
    this.loadingParams.set(true);
    this.successParams.set('');
    this.http.put(`${environment.apiUrl}/api/parametres`, this.formParametres.value).subscribe({
      next: () => {
        this.loadingParams.set(false);
        this.successParams.set('Paramètres enregistrés avec succès');
      },
      error: () => this.loadingParams.set(false),
    });
  }

  changerMotDePasse(): void {
    if (this.formPassword.invalid) {
      this.formPassword.markAllAsTouched();
      return;
    }
    if (this.formPassword.value.nouveau_mot_de_passe !== this.formPassword.value.nouveau_mot_de_passe_confirmation) {
      this.errorPassword.set('Les mots de passe ne correspondent pas');
      return;
    }

    this.loadingPassword.set(true);
    this.errorPassword.set('');
    this.successPassword.set('');

    this.http.post(`${environment.apiUrl}/api/profil/mot-de-passe`, this.formPassword.value).subscribe({
      next: () => {
        this.loadingPassword.set(false);
        this.successPassword.set('Mot de passe modifié avec succès');
        this.formPassword.reset();
      },
      error: (err) => {
        this.loadingPassword.set(false);
        this.errorPassword.set(err.error?.message || 'Erreur');
      },
    });
  }
}