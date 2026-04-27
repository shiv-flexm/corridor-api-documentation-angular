import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { ApiDocsService } from '../../services/api-docs.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header
      class="shrink-0 z-30 border-b px-6 md:px-10 py-3.5 flex items-center justify-between"
      style="background: var(--panel); border-color: var(--border)"
      data-testid="topbar"
    >
      <div class="flex items-center gap-3 text-sm">
        <span class="font-mono text-xs uppercase tracking-widest" style="color: var(--muted)">Reference</span>
        <span style="color: var(--muted)">/</span>
        <span class="font-semibold" style="color: var(--text)">{{ docs.version() }} Stable</span>
      </div>

      <div class="flex items-center gap-2">
        
        <button
          (click)="theme.toggle()"
          class="pill border w-9 h-9 inline-flex items-center justify-center transition-colors"
          style="color: var(--text); border-color: var(--border); background: var(--panel-2)"
          aria-label="toggle theme"
          data-testid="theme-toggle"
        >
          <svg *ngIf="theme.theme() === 'dark'" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
          </svg>
          <svg *ngIf="theme.theme() === 'light'" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z"/>
          </svg>
        </button>
      </div>
    </header>
  `
})
export class TopbarComponent {
  theme = inject(ThemeService);
  docs = inject(ApiDocsService);
}
