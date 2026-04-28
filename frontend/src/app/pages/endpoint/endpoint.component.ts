import { Component, inject, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiDocsService } from '../../services/api-docs.service';
import { AuthService } from '../../services/auth.service';
import { CodeBlockComponent } from '../../components/code-block/code-block.component';
import { MethodBadgeComponent } from '../../components/method-badge/method-badge.component';
import { TryItComponent } from '../../components/try-it/try-it.component';

@Component({
  selector: 'app-endpoint',
  standalone: true,
  imports: [CommonModule, CodeBlockComponent, MethodBadgeComponent, TryItComponent],
  templateUrl: 'endpoint.component.html',
})
export class EndpointComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  docs = inject(ApiDocsService);
  auth = inject(AuthService);

  // Reactive params → updates whenever route params change
  private params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });

  moduleId = computed(() => this.params().get('module') ?? '');
  endpointId = computed(() => this.params().get('endpoint') ?? '');

  resolved = computed(() => this.docs.findEndpoint(this.moduleId(), this.endpointId()));

  gated = computed(() => {
    const r = this.resolved();
    if (!r) return false;
    return r.endpoint.requiresAuth && !this.auth.signedIn();
  });

  constructor() {
    // When version changes and current endpoint no longer exists in that version, redirect
    effect(() => {
      const r = this.resolved();
      if (!r) return;
      const v = this.docs.version();
      if (!r.endpoint.versions.includes(v)) {
        this.router.navigateByUrl(this.docs.firstEndpointPath());
      }
    });

    // Scroll main to top on every navigation
    effect(() => {
      // touch signals so effect re-runs on nav
      this.moduleId();
      this.endpointId();
      queueMicrotask(() => {
        const main = document.getElementById('main-scroll');
        if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  statusTint(code: number): { bg: string; fg: string } {
    if (code >= 500) return { bg: 'rgba(255,122,122,0.12)', fg: '#FF7A7A' };
    if (code >= 400) return { bg: 'rgba(255,181,71,0.14)', fg: '#FFB547' };
    if (code >= 300) return { bg: 'rgba(139,157,255,0.14)', fg: '#8B9DFF' };
    if (code >= 200) return { bg: 'rgba(38,132,255,0.12)', fg: '#2684ff' };
    return { bg: 'rgba(255,255,255,0.06)', fg: '#8A94A6' };
  }
}
