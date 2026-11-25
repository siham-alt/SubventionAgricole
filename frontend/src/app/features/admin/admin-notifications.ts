import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-notifications.html',
  styleUrl: './admin-notifications.scss',
})
export class AdminNotifications implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  loading = signal(false);
  successMessage = signal('');
  historique = signal<any[]>([]);

  form = this.fb.group({
    titre: ['', Validators.required],
    message: ['', Validators.required],
    type: ['info', Validators.required],
    cible: ['tous', Validators.required],
  });

  ngOnInit(): void {
    this.chargerHistorique();
  }

  chargerHistorique(): void {
    this.http.get<any[]>(`${environment.apiUrl}/api/notifications/historique-envois`).subscribe({
      next: (data) => this.historique.set(data),
    });
  }

  envoyer(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.successMessage.set('');

    this.http.post<{ message: string }>(`${environment.apiUrl}/api/notifications/envoyer-globale`, this.form.value).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.successMessage.set(res.message);
        this.form.reset({ type: 'info', cible: 'tous' });
        this.chargerHistorique();
      },
      error: () => this.loading.set(false),
    });
  }
}