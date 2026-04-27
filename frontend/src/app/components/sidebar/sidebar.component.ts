import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ApiDocsService } from '../../services/api-docs.service';
import { AuthService } from '../../services/auth.service';
import { MethodBadgeComponent } from '../method-badge/method-badge.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MethodBadgeComponent],
  template: `
    <aside
      class="w-[300px] shrink-0 h-screen flex flex-col border-r"
      style="background: var(--panel); border-color: var(--border)"
      data-testid="sidebar"
    >
      <!-- Brand -->
      <div class="px-5 pt-6 pb-4 flex items-center gap-3 shrink-0">
        <img src="assets/images/flexm-logo.png" class="w-22 h-16">
        
      </div>

      <!-- Search -->
      <div class="px-5 pb-3 shrink-0">
        <div class="relative">
          <input
            type="text"
            placeholder="Search endpoints…"
            [value]="docs.search()"
            (input)="onSearch($event)"
            class="w-full text-sm rounded-xl py-2.5 pl-9 pr-3 focus:outline-none"
            style="background: var(--panel-2); color: var(--text); border: 1px solid var(--border)"
            data-testid="sidebar-search"
          />
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="color: var(--muted)">
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
          </svg>
        </div>
      </div>

      <!-- Version selector -->
      <div class="px-5 pb-3 flex items-center gap-1.5 shrink-0" data-testid="version-switch">
        <span class="text-[10px] uppercase tracking-wider mr-1" style="color: var(--muted)">Version</span>
        <button
          *ngFor="let v of ['v1','v2']"
          (click)="setVersion(v)"
          class="text-xs font-mono px-2.5 py-1 pill transition-all"
          [style.background]="docs.version() === v ? 'var(--accent)' : 'transparent'"
          [style.color]="docs.version() === v ? 'var(--accent-contrast)' : 'var(--muted)'"
          [style.border]="'1px solid var(--border)'"
          [attr.data-testid]="'version-' + v"
        >{{ v }}</button>
      </div>

      <!-- Nav (scrollable area) -->
      <nav class="flex-1 overflow-y-auto px-3 pb-4" data-testid="sidebar-nav">
        <!-- Introduction -->
        <a
          [routerLink]="['/introduction']"
          routerLinkActive
          #introActive="routerLinkActive"
          [routerLinkActiveOptions]="{ exact: true }"
          class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors mt-1"
          [style.color]="introActive.isActive ? 'var(--text)' : 'var(--muted)'"
          [style.background]="introActive.isActive ? 'color-mix(in oklab, var(--accent) 12%, transparent)' : 'transparent'"
          [style.boxShadow]="introActive.isActive ? 'inset 3px 0 0 var(--accent)' : 'none'"
          data-testid="nav-introduction"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>
          </svg>
          <span class="font-medium">Introduction</span>
        </a>

        <div class="my-3 mx-3 h-px" style="background: var(--border)"></div>

        <ng-container *ngFor="let mod of docs.filteredModules()">
          <div class="mt-2">
            <button
              (click)="toggle(mod.id)"
              class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs uppercase tracking-[0.12em] transition-colors"
              [style.color]="'var(--muted)'"
              [attr.data-testid]="'module-' + mod.id"
            >
              <span class="font-semibold">{{ mod.name }}</span>
              <svg class="w-3 h-3 transition-transform" [class.rotate-90]="isOpen(mod.id)" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
            <ul *ngIf="isOpen(mod.id)" class="mt-1 space-y-0.5">
              <li *ngFor="let ep of visibleEndpoints(mod)">
                <a
                  [routerLink]="['/docs', mod.id, ep.id]"
                  routerLinkActive
                  #rla="routerLinkActive"
                  class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors"
                  [style.color]="rla.isActive ? 'var(--text)' : 'var(--muted)'"
                  [style.background]="rla.isActive ? 'color-mix(in oklab, var(--accent) 12%, transparent)' : 'transparent'"
                  [style.boxShadow]="rla.isActive ? 'inset 3px 0 0 var(--accent)' : 'none'"
                  [attr.data-testid]="'nav-' + mod.id + '-' + ep.id"
                >
                  <app-method-badge [method]="ep.method"></app-method-badge>
                  <span class="truncate">{{ ep.name }}</span>
                  <span *ngIf="ep.requiresAuth && !auth.signedIn()" class="ml-auto text-[10px]" style="color: var(--muted)">🔒</span>
                </a>
              </li>
            </ul>
          </div>
        </ng-container>
        <div *ngIf="docs.filteredModules().length === 0" class="px-3 py-6 text-sm" style="color: var(--muted)" data-testid="no-results">
          No endpoints match "{{ docs.search() }}".
        </div>
      </nav>

      <!-- Auth gate -->
      <div class="px-5 py-4 border-t shrink-0" style="border-color: var(--border)">
        <button
          (click)="auth.toggle()"
          class="w-full text-xs font-mono px-3 py-2 pill flex items-center justify-between transition-colors"
          style="background: var(--panel-2); color: var(--text); border: 1px solid var(--border)"
          data-testid="auth-toggle"
        >
          <span>{{ auth.signedIn() ? 'Signed in' : 'Anonymous' }}</span>
          <span class="w-2 h-2 rounded-full"
            [style.background]="auth.signedIn() ? '#3DE6D2' : '#FF7A7A'"></span>
        </button>
      </div>
    </aside>
  `,
  styles: [`:host{display:flex}`]
})
export class SidebarComponent {
  docs = inject(ApiDocsService);
  auth = inject(AuthService);

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

  onSearch(ev: Event) {
    const v = (ev.target as HTMLInputElement).value;
    this.docs.setSearch(v);
  }

  setVersion(v: string) {
    this.docs.setVersion(v as 'v1' | 'v2');
  }
}
