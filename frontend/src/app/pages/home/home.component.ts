import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiDocsService } from '../../services/api-docs.service';
import { MethodBadgeComponent } from '../../components/method-badge/method-badge.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MethodBadgeComponent],
  template: `
    <div class="max-w-5xl mx-auto px-6 md:px-10 py-14 lg:py-20 stagger" data-testid="home-page">
      <div class="flex items-center gap-2 text-xs font-mono mb-6" style="color: var(--muted)">
        <span class="pill px-2.5 py-1" style="background: var(--panel); border:1px solid var(--border)">Reference · {{ docs.version() }}</span>
        <span class="pill px-2.5 py-1" style="background: var(--panel); border:1px solid var(--border)">Updated Feb 2026</span>
      </div>

      <h1 class="font-display italic text-6xl lg:text-7xl tracking-tight leading-[0.98]" style="color: var(--text)">
        Build with <span style="color: var(--accent)">Relay.</span><br/>Ship money like Stripe.
      </h1>
      <p class="mt-6 max-w-2xl text-lg" style="color: var(--muted)">
        A developer-first reference for Relay's REST API — tokens, transactions, webhooks, and everything
        in between. Every endpoint is versioned, typed, and ready for production.
      </p>

      <div class="mt-10 flex flex-wrap gap-3">
        <a [routerLink]="['/docs','users','list-users']"
           class="pill px-5 py-3 text-sm font-mono uppercase tracking-wider transition-all hover:-translate-y-0.5"
           style="background: var(--accent); color:#04120E"
           data-testid="cta-get-started">
          Start with /users →
        </a>
        <a [routerLink]="['/docs','auth','login']"
           class="pill px-5 py-3 text-sm font-mono uppercase tracking-wider transition-all hover:-translate-y-0.5"
           style="background: var(--panel); color: var(--text); border:1px solid var(--border)"
           data-testid="cta-auth">
          Authenticate →
        </a>
      </div>

      <div class="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <a *ngFor="let m of docs.filteredModules()"
           [routerLink]="['/docs', m.id, m.endpoints[0].id]"
           class="group p-5 rounded-2xl border transition-all hover:-translate-y-0.5"
           style="background: var(--panel); border-color: var(--border)"
           [attr.data-testid]="'home-card-' + m.id">
          <div class="flex items-center gap-2 mb-3">
            <span class="w-1.5 h-1.5 rounded-full" style="background: var(--accent)"></span>
            <span class="font-mono text-[11px] uppercase tracking-widest" style="color: var(--muted)">{{ m.endpoints.length }} endpoints</span>
          </div>
          <div class="font-display italic text-2xl mb-1">{{ m.name }}</div>
          <div class="text-sm mb-4" style="color: var(--muted)">{{ m.tagline }}</div>
          <div class="flex flex-wrap gap-1.5">
            <span *ngFor="let ep of m.endpoints.slice(0,3)"
                  class="inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-1 rounded-md"
                  style="background: var(--panel-2); border:1px solid var(--border)">
              <app-method-badge [method]="ep.method"></app-method-badge>
              <span style="color: var(--muted)">{{ ep.route }}</span>
            </span>
          </div>
        </a>
      </div>
    </div>
  `
})
export class HomeComponent {
  docs = inject(ApiDocsService);
  private router = inject(Router);
}
