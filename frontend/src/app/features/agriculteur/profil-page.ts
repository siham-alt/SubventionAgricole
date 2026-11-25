import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../core/services/auth';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profil-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profil-page.html',
  styleUrl: './profil-page.scss',
})
export class ProfilPage {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  auth = inject(Auth);

  loading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  form = this.fb.group({
    name: [this.auth.currentUser()?.name ?? '', Validators.required],
    telephone: [this.auth.currentUser()?.telephone ?? '', Validators.required],
    adresse: [this.auth.currentUser()?.adresse ?? ''],
    region: [this.auth.currentUser()?.region ?? '', Validators.required],
    province: [this.auth.currentUser()?.province ?? '', Validators.required],
    commune: [this.auth.currentUser()?.commune ?? '', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    this.http.put(`${environment.apiUrl}/api/profil`, this.form.value).subscribe({
      next: (res: any) => {
        this.loading.set(false);
        this.successMessage.set('Profil mis à jour avec succès');
        this.auth.currentUser.set(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Erreur lors de la mise à jour');
      },
    });
  }
  onPhotoSelectionnee(event: Event): void {
  const input = event.target as HTMLInputElement;
  const fichier = input.files?.[0];
  if (!fichier) return;

  const reader = new FileReader();
  reader.onload = () => {
    const base64 = reader.result as string;
    this.http.post<any>(`${environment.apiUrl}/api/profil/photo`, { photo_base64: base64 }).subscribe({
      next: (res) => {
        this.auth.currentUser.set(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
      },
    });
  };
  reader.readAsDataURL(fichier);
}
photoUrl(): string {
  const chemin = this.auth.currentUser()?.photo_profil;
  return chemin ? `${environment.apiUrl}/storage/${chemin}` : '';
}
}