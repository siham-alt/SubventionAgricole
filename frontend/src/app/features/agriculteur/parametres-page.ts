import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-parametres-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './parametres-page.html',
  styleUrl: './parametres-page.scss',
})
export class ParametresPage {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  // ===== Mot de passe (inchangé) =====
  loading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  form = this.fb.group({
    mot_de_passe_actuel: ['', Validators.required],
    nouveau_mot_de_passe: ['', [Validators.required, Validators.minLength(8)]],
    nouveau_mot_de_passe_confirmation: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.value.nouveau_mot_de_passe !== this.form.value.nouveau_mot_de_passe_confirmation) {
      this.errorMessage.set('Les mots de passe ne correspondent pas');
      return;
    }

    this.loading.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    this.http.post(`${environment.apiUrl}/api/profil/mot-de-passe`, {
      mot_de_passe_actuel: this.form.value.mot_de_passe_actuel,
      nouveau_mot_de_passe: this.form.value.nouveau_mot_de_passe,
      nouveau_mot_de_passe_confirmation: this.form.value.nouveau_mot_de_passe_confirmation,
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Mot de passe modifié avec succès');
        this.form.reset();
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Erreur lors du changement de mot de passe');
      },
    });
  }

  // ===== Notifications & Langue (nouveau) =====
  notificationsEmail = signal(true);
  langue = signal<'fr' | 'ar'>('fr');
  loadingPreferences = signal(false);
 notifEmailNiveau = signal<'important' | 'tout'>('important');
messagePreferences = signal('');

ngOnInit(): void {
  this.http.get<{ notif_email_niveau: 'important' | 'tout' }>(
    `${environment.apiUrl}/api/profil/preferences`
  ).subscribe({
    next: (prefs) => this.notifEmailNiveau.set(prefs.notif_email_niveau),
  });
}

changerNiveauNotif(niveau: 'important' | 'tout'): void {
  this.notifEmailNiveau.set(niveau);
  this.http.put(`${environment.apiUrl}/api/profil/preferences`, {
    notif_email_niveau: niveau,
  }).subscribe({
    next: () => {
      this.messagePreferences.set('Préférences enregistrées');
      setTimeout(() => this.messagePreferences.set(''), 2500);
    },
  });
}

  toggleNotificationsEmail(): void {
    this.notificationsEmail.update(v => !v);
    this.sauvegarderPreferences();
  }

  changerLangue(langue: 'fr' | 'ar'): void {
    this.langue.set(langue);
    this.sauvegarderPreferences();
  }

  private sauvegarderPreferences(): void {
    this.loadingPreferences.set(true);
    this.http.put(`${environment.apiUrl}/api/profil/preferences`, {
      notifications_email: this.notificationsEmail(),
      langue: this.langue(),
    }).subscribe({
      next: () => {
        this.loadingPreferences.set(false);
        this.messagePreferences.set('Préférences enregistrées');
        setTimeout(() => this.messagePreferences.set(''), 2500);
      },
      error: () => this.loadingPreferences.set(false),
    });
  }
}