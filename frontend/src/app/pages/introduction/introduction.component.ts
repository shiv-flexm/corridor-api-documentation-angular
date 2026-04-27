import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiDocsService } from '../../services/api-docs.service';
import { MethodBadgeComponent } from '../../components/method-badge/method-badge.component';

@Component({
  selector: 'app-introduction',
  standalone: true,
  imports: [CommonModule, RouterLink, MethodBadgeComponent],
  template: `
    <div class="max-w-5xl mx-auto px-6 md:px-10 py-14 lg:py-20 stagger" data-testid="introduction-page">
      <div class="flex items-center gap-2 text-xs font-mono mb-6" style="color: var(--muted)">
        <span class="pill px-2.5 py-1" style="background: var(--panel); border:1px solid var(--border)">Reference · {{ docs.version() }}</span>
        <span class="pill px-2.5 py-1" style="background: var(--panel); border:1px solid var(--border)">Updated Feb 2026</span>
      </div>

      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]" style="color: var(--text)">
        Build with <span style="color: var(--accent)">Relay</span>.<br/>
        Ship money like Stripe.
      </h1>
      <p class="mt-6 max-w-2xl text-base" style="color: var(--muted)">
        Relay is a developer-first platform for identity, payments, and realtime sync. This reference
        documents every public endpoint across four modules — <span style="color: var(--text)">Users</span>,
        <span style="color: var(--text)">Transactions</span>, <span style="color: var(--text)">Auth</span>,
        and <span style="color: var(--text)">Webhooks</span> — with live code samples in five languages,
        typed request and response schemas, and a safe sandbox for trying each call.
      </p>

      <div class="mt-10 flex flex-wrap gap-3">
        <a [routerLink]="['/docs','users','list-users']"
           class="pill px-5 py-3 text-sm font-mono uppercase tracking-wider transition-all hover:-translate-y-0.5"
           style="background: var(--accent); color: var(--accent-contrast)"
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

      <!-- Quick start blocks -->
      <div class="mt-14 grid md:grid-cols-3 gap-4" data-testid="quickstart-grid">
        <div class="p-5 rounded-2xl border" style="background: var(--panel); border-color: var(--border)">
          <div class="text-xs font-mono uppercase tracking-[0.18em] mb-2" style="color: var(--muted)">Step 1</div>
          <div class="text-lg font-semibold mb-1">Get an API key</div>
          <div class="text-sm" style="color: var(--muted)">Spin up a workspace and copy a test key from the dashboard.</div>
        </div>
        <div class="p-5 rounded-2xl border" style="background: var(--panel); border-color: var(--border)">
          <div class="text-xs font-mono uppercase tracking-[0.18em] mb-2" style="color: var(--muted)">Step 2</div>
          <div class="text-lg font-semibold mb-1">Call any endpoint</div>
          <div class="text-sm" style="color: var(--muted)">Every request is authed via <span class="font-mono">Authorization: Bearer</span>.</div>
        </div>
        <div class="p-5 rounded-2xl border" style="background: var(--panel); border-color: var(--border)">
          <div class="text-xs font-mono uppercase tracking-[0.18em] mb-2" style="color: var(--muted)">Step 3</div>
          <div class="text-lg font-semibold mb-1">Subscribe to webhooks</div>
          <div class="text-sm" style="color: var(--muted)">Receive signed events in realtime for every state change.</div>
        </div>
      </div>

      <!-- Modules overview -->
      <h2 class="mt-16 text-xs font-semibold uppercase tracking-[0.18em] mb-4" style="color: var(--muted)">Modules</h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <a *ngFor="let m of docs.filteredModules()"
           [routerLink]="['/docs', m.id, m.endpoints[0].id]"
           class="group p-5 rounded-2xl border transition-all hover:-translate-y-0.5"
           style="background: var(--panel); border-color: var(--border)"
           [attr.data-testid]="'intro-card-' + m.id">
          <div class="flex items-center gap-2 mb-3">
            <span class="w-1.5 h-1.5 rounded-full" style="background: var(--accent)"></span>
            <span class="font-mono text-[11px] uppercase tracking-widest" style="color: var(--muted)">{{ m.endpoints.length }} endpoints</span>
          </div>
          <div class="text-lg font-semibold mb-1" style="color: var(--text)">{{ m.name }}</div>
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

      <!-- Conventions -->
      <h2 class="mt-16 text-xs font-semibold uppercase tracking-[0.18em] mb-4" style="color: var(--muted)">Conventions</h2>
      <div class="rounded-2xl border divide-y" style="background: var(--panel); border-color: var(--border)">
        <div class="p-5 grid md:grid-cols-[200px_1fr] gap-4" style="border-color: var(--border)">
          <div class="text-sm font-semibold" style="color: var(--text)">Authentication</div>
          <div class="text-sm" style="color: var(--muted)">Every request uses a <span class="font-mono">Bearer</span> token. Test keys start with <span class="font-mono">sk_test_</span>, live keys with <span class="font-mono">sk_live_</span>.</div>
        </div>
        <div class="p-5 grid md:grid-cols-[200px_1fr] gap-4" style="border-color: var(--border)">
          <div class="text-sm font-semibold" style="color: var(--text)">Versioning</div>
          <div class="text-sm" style="color: var(--muted)">Endpoints are namespaced under <span class="font-mono">/api/v1</span> and <span class="font-mono">/api/v2</span>. Toggle the version from the sidebar.</div>
        </div>
        <div class="p-5 grid md:grid-cols-[200px_1fr] gap-4" style="border-color: var(--border)">
          <div class="text-sm font-semibold" style="color: var(--text)">Idempotency</div>
          <div class="text-sm" style="color: var(--muted)">Any write request accepts an <span class="font-mono">Idempotency-Key</span> header to safely retry without duplicates.</div>
        </div>
        <div class="p-5 grid md:grid-cols-[200px_1fr] gap-4" style="border-color: var(--border)">
          <div class="text-sm font-semibold" style="color: var(--text)">Errors</div>
          <div class="text-sm" style="color: var(--muted)">Errors return a consistent JSON envelope with <span class="font-mono">type</span>, <span class="font-mono">code</span>, <span class="font-mono">message</span> and <span class="font-mono">doc_url</span>.</div>
        </div>
      </div>
    </div>
  `
})
export class IntroductionComponent {
  docs = inject(ApiDocsService);
}
