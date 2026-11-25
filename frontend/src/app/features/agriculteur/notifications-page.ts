import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationApi } from '../../core/services/notification';
import { NotificationInterne } from '../../core/models/dossier.model';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notifications-page.html',
  styleUrl: './notifications-page.scss',
})
export class NotificationsPage implements OnInit {
  private notificationApi = inject(NotificationApi);

  notifications = signal<NotificationInterne[]>([]);
  loading = signal(true);

  iconesParType: Record<string, string> = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    danger: '❌',
  };

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.notificationApi.getNotifications().subscribe({
      next: (res) => {
        this.notifications.set(res.data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des notifications', err);
        this.loading.set(false);
      },
    });
  }

  marquerLu(notif: NotificationInterne): void {
    if (notif.lu) return;

    // Mise à jour optimiste : l'UI réagit tout de suite au clic,
    // sans attendre la réponse serveur.
    this.notifications.update(list =>
      list.map(n => (n.id === notif.id ? { ...n, lu: true } : n))
    );

    this.notificationApi.marquerLu(notif.id).subscribe({
      next: () => {
        // déjà mis à jour de façon optimiste, rien à faire ici
      },
      error: (err) => {
        console.error('Erreur lors du marquage comme lu', err);
        // on annule la mise à jour optimiste si l'appel a échoué
        this.notifications.update(list =>
          list.map(n => (n.id === notif.id ? { ...n, lu: false } : n))
        );
      },
    });
  }

  toutMarquerLu(): void {
    const previous = this.notifications();
    this.notifications.update(list => list.map(n => ({ ...n, lu: true })));

    this.notificationApi.marquerToutesLues().subscribe({
      next: () => {
        // déjà mis à jour de façon optimiste
      },
      error: (err) => {
        console.error('Erreur lors du marquage global comme lu', err);
        this.notifications.set(previous);
      },
    });
  }
}