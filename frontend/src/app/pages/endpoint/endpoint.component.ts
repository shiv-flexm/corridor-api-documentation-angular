import { Component, inject, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiDocsService } from '../../services/api-docs.service';
import { AuthService } from '../../services/auth.service';
import { CodeBlockComponent } from '../../components/code-block/code-block.component';
import { MethodBadgeComponent } from '../../components/method-badge/method-badge.component';
import { TryItComponent } from '../../components/try-it/try-it.component';

@Component({
  selector: 'app-endpoint',
  standalone: true,
  imports: [CommonModule, CodeBlockComponent, MethodBadgeComponent, TryItComponent],
  template: `
    <ng-container *ngIf="resolved() as r; else notFound">
      <ng-container *ngIf="!gated(); else authGate">
        <div class="max-w-5xl mx-auto px-6 md:px-10 py-10 lg:py-14 stagger" data-testid="endpoint-page">
          <!-- Breadcrumbs -->
          <div class="flex items-center gap-2 text-xs font-mono mb-6" style="color: var(--muted)">
            <span>Reference</span><span>›</span>
            <span>{{ r.module.name }}</span><span>›</span>
            <span style="color: var(--text)">{{ r.endpoint.name }}</span>
          </div>

          <!-- Title -->
          <div class="flex items-start justify-between gap-6 mb-4">
            <div class="min-w-0">
              <h1 class="font-display italic text-5xl lg:text-6xl tracking-tight leading-[1.02]" style="color: var(--text)">
                {{ r.endpoint.name }}
              </h1>
              <p class="mt-4 max-w-3xl text-base" style="color: var(--muted)" data-testid="endpoint-description">
                {{ r.endpoint.description }}
              </p>
            </div>
            <div *ngIf="r.endpoint.requiresAuth" class="shrink-0 text-[10px] font-mono uppercase tracking-[0.18em] pill px-3 py-1.5"
                 style="background: var(--panel-2); color: var(--muted); border:1px solid var(--border)">
              Auth required
            </div>
          </div>

          <!-- Route card -->
          <div class="mt-6 flex items-center gap-3 px-4 py-3 rounded-xl border"
               style="background: var(--panel); border-color: var(--border)" data-testid="endpoint-route">
            <app-method-badge [method]="r.endpoint.method"></app-method-badge>
            <span class="font-mono text-sm md:text-base" style="color: var(--text)">{{ r.endpoint.route }}</span>
            <span class="ml-auto text-[10px] uppercase tracking-widest" style="color: var(--muted)">{{ docs.version() }}</span>
          </div>

          <!-- Grid: left content, right sticky code -->
          <div class="mt-10 grid lg:grid-cols-[1fr_460px] gap-10">
            <div class="min-w-0 space-y-12">

              <!-- Headers -->
              <section id="headers" class="anchor-offset" data-testid="section-headers">
                <h2 class="text-xs font-semibold uppercase tracking-[0.18em] mb-3" style="color: var(--muted)">Headers</h2>
                <div class="rounded-xl overflow-hidden border" style="border-color: var(--border)">
                  <table class="w-full text-sm">
                    <thead>
                      <tr style="background: var(--panel-2); color: var(--muted)">
                        <th class="text-left font-normal px-4 py-2.5 text-xs uppercase tracking-wider">Key</th>
                        <th class="text-left font-normal px-4 py-2.5 text-xs uppercase tracking-wider">Type</th>
                        <th class="text-left font-normal px-4 py-2.5 text-xs uppercase tracking-wider">Description</th>
                      </tr>
                    </thead>
                    <tbody style="background: var(--panel)">
                      <tr *ngFor="let h of r.endpoint.headers" class="border-t" style="border-color: var(--border)">
                        <td class="px-4 py-3 font-mono text-[13px]" style="color: var(--text)">
                          {{ h.name }}
                          <span *ngIf="h.required" class="ml-1 text-[10px] font-mono" style="color:#FF7A7A">required</span>
                        </td>
                        <td class="px-4 py-3 font-mono text-[13px]" style="color: var(--muted)">{{ h.type }}</td>
                        <td class="px-4 py-3" style="color: var(--muted)">{{ h.description }}</td>
                      </tr>
                      <tr *ngIf="r.endpoint.headers.length === 0">
                        <td colspan="3" class="px-4 py-3 text-sm italic" style="color: var(--muted)">No headers required.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <!-- Query params -->
              <section *ngIf="r.endpoint.queryParams.length > 0" id="query" class="anchor-offset" data-testid="section-query">
                <h2 class="text-xs font-semibold uppercase tracking-[0.18em] mb-3" style="color: var(--muted)">Query parameters</h2>
                <div class="rounded-xl overflow-hidden border" style="border-color: var(--border)">
                  <table class="w-full text-sm">
                    <thead>
                      <tr style="background: var(--panel-2); color: var(--muted)">
                        <th class="text-left font-normal px-4 py-2.5 text-xs uppercase tracking-wider">Key</th>
                        <th class="text-left font-normal px-4 py-2.5 text-xs uppercase tracking-wider">Type</th>
                        <th class="text-left font-normal px-4 py-2.5 text-xs uppercase tracking-wider">Description</th>
                      </tr>
                    </thead>
                    <tbody style="background: var(--panel)">
                      <tr *ngFor="let q of r.endpoint.queryParams" class="border-t" style="border-color: var(--border)">
                        <td class="px-4 py-3 font-mono text-[13px]" style="color: var(--text)">
                          {{ q.name }}
                          <span *ngIf="q.required" class="ml-1 text-[10px] font-mono" style="color:#FF7A7A">required</span>
                        </td>
                        <td class="px-4 py-3 font-mono text-[13px]" style="color: var(--muted)">{{ q.type }}</td>
                        <td class="px-4 py-3" style="color: var(--muted)">{{ q.description }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <!-- Request body -->
              <section *ngIf="r.endpoint.requestBody" id="body" class="anchor-offset" data-testid="section-body">
                <h2 class="text-xs font-semibold uppercase tracking-[0.18em] mb-3" style="color: var(--muted)">Request body</h2>
                <app-code-block variant="payload" [payload]="r.endpoint.requestBody" label="application/json"></app-code-block>
              </section>

              <!-- Success response -->
              <section id="success" class="anchor-offset" data-testid="section-success">
                <div class="flex items-center gap-2 mb-3">
                  <span class="w-1.5 h-1.5 rounded-full" style="background:#3DE6D2"></span>
                  <h2 class="text-xs font-semibold uppercase tracking-[0.18em]" style="color: var(--muted)">Success response</h2>
                </div>
                <app-code-block variant="response" [payload]="r.endpoint.successResponse" label="200 OK"></app-code-block>
              </section>

              <!-- Error response -->
              <section id="error" class="anchor-offset" data-testid="section-error">
                <div class="flex items-center gap-2 mb-3">
                  <span class="w-1.5 h-1.5 rounded-full" style="background:#FF7A7A"></span>
                  <h2 class="text-xs font-semibold uppercase tracking-[0.18em]" style="color: var(--muted)">Error response</h2>
                </div>
                <app-code-block variant="response" [payload]="r.endpoint.errorResponse" label="4xx / 5xx"></app-code-block>
              </section>

              <!-- Status codes -->
              <section id="status" class="anchor-offset" data-testid="section-status">
                <h2 class="text-xs font-semibold uppercase tracking-[0.18em] mb-3" style="color: var(--muted)">Status codes</h2>
                <ul class="rounded-xl overflow-hidden border divide-y" style="border-color: var(--border); background: var(--panel)">
                  <li *ngFor="let s of r.endpoint.statusCodes" class="px-4 py-3 flex items-start gap-4" style="border-color: var(--border)">
                    <span class="font-mono text-sm px-2 py-0.5 rounded-md"
                          [style.background]="statusTint(s.code).bg"
                          [style.color]="statusTint(s.code).fg">{{ s.code }}</span>
                    <div class="min-w-0">
                      <div class="text-sm font-medium" style="color: var(--text)">{{ s.label }}</div>
                      <div class="text-sm" style="color: var(--muted)">{{ s.description }}</div>
                    </div>
                  </li>
                </ul>
              </section>

              <!-- Try it -->
              <section id="try" class="anchor-offset" data-testid="section-try">
                <h2 class="text-xs font-semibold uppercase tracking-[0.18em] mb-3" style="color: var(--muted)">Try it out</h2>
                <app-try-it [endpoint]="r.endpoint"></app-try-it>
              </section>
            </div>

            <!-- Sticky code column -->
            <aside class="lg:sticky lg:top-24 h-max space-y-6">
              <div>
                <div class="text-[10px] uppercase tracking-[0.18em] mb-2" style="color: var(--muted)">Request</div>
                <app-code-block variant="request" [endpoint]="r.endpoint"></app-code-block>
              </div>
              <div>
                <div class="text-[10px] uppercase tracking-[0.18em] mb-2" style="color: var(--muted)">Response · 200</div>
                <app-code-block variant="response" [payload]="r.endpoint.successResponse"></app-code-block>
              </div>
            </aside>
          </div>
        </div>
      </ng-container>
    </ng-container>

    <ng-template #authGate>
      <div class="max-w-xl mx-auto px-6 py-24 text-center fade-up" data-testid="auth-gate">
        <div class="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-xl mb-4"
             style="background: var(--panel); border:1px solid var(--border)">🔒</div>
        <h2 class="font-display italic text-4xl mb-3">This endpoint is private.</h2>
        <p class="text-sm mb-6" style="color: var(--muted)">
          Sign in from the sidebar to unlock auth-gated endpoints like this one.
        </p>
      </div>
    </ng-template>

    <ng-template #notFound>
      <div class="max-w-xl mx-auto px-6 py-24 text-center">
        <h2 class="font-display italic text-4xl mb-3">Endpoint not found.</h2>
        <p class="text-sm" style="color: var(--muted)">Try searching in the sidebar.</p>
      </div>
    </ng-template>
  `
})
export class EndpointComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  docs = inject(ApiDocsService);
  auth = inject(AuthService);

  moduleId = computed(() => this.route.snapshot.paramMap.get('module') ?? '');
  endpointId = computed(() => this.route.snapshot.paramMap.get('endpoint') ?? '');

  resolved = computed(() => {
    this.route.params.subscribe(); // ensure subscription
    return this.docs.findEndpoint(this.moduleId(), this.endpointId());
  });

  gated = computed(() => {
    const r = this.resolved();
    if (!r) return false;
    return r.endpoint.requiresAuth && !this.auth.signedIn();
  });

  constructor() {
    // re-resolve on navigation
    this.route.params.subscribe(() => {
      // signals read inside template re-evaluate via route snapshot
    });
    effect(() => {
      const r = this.docs.findEndpoint(
        this.route.snapshot.paramMap.get('module') ?? '',
        this.route.snapshot.paramMap.get('endpoint') ?? ''
      );
      if (!r) return;
      const v = this.docs.version();
      if (!r.endpoint.versions.includes(v)) {
        // Version switch hides the endpoint → redirect to first match
        this.router.navigateByUrl(this.docs.firstEndpointPath());
      }
    });
  }

  statusTint(code: number): { bg: string; fg: string } {
    if (code >= 500) return { bg: 'rgba(255,122,122,0.12)', fg: '#FF7A7A' };
    if (code >= 400) return { bg: 'rgba(255,181,71,0.14)', fg: '#FFB547' };
    if (code >= 300) return { bg: 'rgba(139,157,255,0.14)', fg: '#8B9DFF' };
    if (code >= 200) return { bg: 'rgba(61,230,210,0.12)', fg: '#3DE6D2' };
    return { bg: 'rgba(255,255,255,0.06)', fg: '#8A94A6' };
  }
}
