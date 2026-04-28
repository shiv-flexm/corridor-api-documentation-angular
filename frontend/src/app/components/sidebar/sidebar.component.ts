import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ApiDocsService } from '../../services/api-docs.service';
import { AuthService } from '../../services/auth.service';
import { CommandPaletteService } from '../../services/command-palette.service';
import { MethodBadgeComponent } from '../method-badge/method-badge.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MethodBadgeComponent],
  templateUrl: 'sidebar.component.html',

  styles: [`:host{display:flex}`]
})
export class SidebarComponent {
  docs = inject(ApiDocsService);
  auth = inject(AuthService);
  palette = inject(CommandPaletteService);

  readonly modKeyLabel = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl';

  openMap: Record<string, boolean> = {};

  isOpen(id: string): boolean {
    if (this.openMap[id] === undefined) this.openMap[id] = true;
    return this.openMap[id];
  }
  toggle(id: string) {
    this.openMap[id] = !this.isOpen(id);
  }

  visibleEndpoints(mod: { id: string; endpoints: Array<{ requiresAuth: boolean }> }) {
    const all = mod.endpoints as any[];
    return all.filter((e) => !e.requiresAuth || this.auth.signedIn());
  }

  openPalette() {
    this.palette.show();
  }
}
