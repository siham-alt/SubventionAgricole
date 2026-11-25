import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home').then(m => m.Home) },
  { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register').then(m => m.Register) },
  { path: 'programmes', loadComponent: () => import('./features/public/programmes-public').then(m => m.ProgrammesPublic) },
  { path: 'guide', loadComponent: () => import('./features/public/guide').then(m => m.Guide) },
  { path: 'faq', loadComponent: () => import('./features/public/faq').then(m => m.Faq) },
  { path: 'contact', loadComponent: () => import('./features/public/contact').then(m => m.Contact) },

  // ===== ESPACE AGRICULTEUR =====
  {
    path: 'agriculteur',
    loadComponent: () => import('./layouts/agriculteur-layout').then(m => m.AgriculteurLayout),
    canActivate: [authGuard, roleGuard(['agriculteur'])],
    children: [
      { path: '', loadComponent: () => import('./features/agriculteur/tableau-bord').then(m => m.TableauBord) },
      { path: 'demandes', loadComponent: () => import('./features/agriculteur/demandes-liste').then(m => m.DemandesListe) },
      { path: 'demandes/nouvelle', loadComponent: () => import('./features/agriculteur/demande-nouvelle').then(m => m.DemandeNouvelle) },
      { path: 'demandes/:id', loadComponent: () => import('./features/agriculteur/demande-detail').then(m => m.DemandeDetail) },
      { path: 'programmes', loadComponent: () => import('./features/agriculteur/programmes-vue').then(m => m.ProgrammesVue) },
      { path: 'documents', loadComponent: () => import('./features/agriculteur/documents-ged').then(m => m.DocumentsGed) },
      { path: 'notifications', loadComponent: () => import('./features/agriculteur/notifications-page').then(m => m.NotificationsPage) },
      { path: 'profil', loadComponent: () => import('./features/agriculteur/profil-page').then(m => m.ProfilPage) },
      { path: 'parametres', loadComponent: () => import('./features/agriculteur/parametres-page').then(m => m.ParametresPage) },
    ],
  },

  // ===== ESPACE AGENT =====
  {
    path: 'agent',
    loadComponent: () => import('./layouts/agent-layout').then(m => m.AgentLayout),
    canActivate: [authGuard, roleGuard(['agent'])],
    children: [
      { path: '', loadComponent: () => import('./features/agent/agent-dashboard').then(m => m.AgentDashboard) },
      { path: 'dossiers', loadComponent: () => import('./features/agent/agent-dossiers-liste').then(m => m.AgentDossiersListe) },
      { path: 'dossiers/:id', loadComponent: () => import('./features/agent/agent-dossier-traitement').then(m => m.AgentDossierTraitement) },
      { path: 'statistiques', loadComponent: () => import('./features/agent/agent-statistiques').then(m => m.AgentStatistiques) },
      { path: 'messages', loadComponent: () => import('./features/messagerie/messages-contact').then(m => m.MessagesContact) },
    ],
  },

  // ===== ESPACE ADMIN =====
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout').then(m => m.AdminLayout),
    canActivate: [authGuard, roleGuard(['administrateur'])],
    children: [
      { path: '', loadComponent: () => import('./features/admin/admin-dashboard').then(m => m.AdminDashboard) },
      { path: 'utilisateurs', loadComponent: () => import('./features/admin/admin-utilisateurs').then(m => m.AdminUtilisateurs) },
      { path: 'programmes', loadComponent: () => import('./features/admin/admin-programmes').then(m => m.AdminProgrammes) },
      { path: 'dossiers/:id', loadComponent: () => import('./features/agent/agent-dossier-traitement').then(m => m.AgentDossierTraitement) },
      { path: 'dossiers', loadComponent: () => import('./features/admin/admin-dossiers').then(m => m.AdminDossiers) },
      { path: 'messages', loadComponent: () => import('./features/messagerie/messages-contact').then(m => m.MessagesContact) },
      { path: 'notifications', loadComponent: () => import('./features/admin/admin-notifications').then(m => m.AdminNotifications) },
      { path: 'rapports', loadComponent: () => import('./features/admin/admin-rapports').then(m => m.AdminRapports) },
      { path: 'parametres', loadComponent: () => import('./features/admin/admin-parametres').then(m => m.AdminParametres) },
    ],
  },

  { path: '**', redirectTo: '' },
];