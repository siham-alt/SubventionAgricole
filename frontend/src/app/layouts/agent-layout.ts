import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { Auth } from '../core/services/auth';

@Component({
  selector: 'app-agent-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './agent-layout.html',
  styleUrl: './agent-layout.scss',
})
export class AgentLayout {
  auth = inject(Auth);

  seDeconnecter(): void {
    this.auth.logout();
  }
}