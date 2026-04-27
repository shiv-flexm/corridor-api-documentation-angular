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
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          class="hidden md:inline-flex items-center gap-2 text-xs font-mono px-3 py-2 pill transition-colors"
          style="color: var(--muted); border: 1px solid var(--border)"
          data-testid="github-link"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.73.5.67 5.56.67 11.83c0 5 3.24 9.22 7.73 10.72.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.1-3.15.68-3.81-1.34-3.81-1.34-.52-1.31-1.27-1.66-1.27-1.66-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.73-1.53-2.51-.29-5.15-1.26-5.15-5.6 0-1.23.44-2.24 1.17-3.03-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.16a10.9 10.9 0 0 1 5.73 0c2.18-1.47 3.14-1.16 3.14-1.16.63 1.57.24 2.73.12 3.02.73.79 1.17 1.8 1.17 3.03 0 4.35-2.65 5.3-5.17 5.59.41.35.78 1.04.78 2.09 0 1.51-.01 2.73-.01 3.1 0 .3.21.66.79.55A11.34 11.34 0 0 0 23.33 11.83C23.33 5.56 18.27.5 12 .5Z"/></svg>
          github.com/relay
        </a>
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
