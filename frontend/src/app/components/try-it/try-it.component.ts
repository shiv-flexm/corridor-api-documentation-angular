import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Endpoint } from '../../data/api-data';
import { CodeBlockComponent } from '../code-block/code-block.component';
import { MethodBadgeComponent } from '../method-badge/method-badge.component';

@Component({
  selector: 'app-try-it',
  standalone: true,
  imports: [CommonModule, CodeBlockComponent, MethodBadgeComponent],
  template: `
    <div class="rounded-2xl overflow-hidden border fade-up"
         style="background: var(--panel); border-color: var(--border)"
         data-testid="try-it">
      <div class="px-5 py-3.5 border-b flex items-center justify-between gap-3"
           style="border-color: var(--border)">
        <div class="flex items-center gap-2.5 min-w-0">
          <span class="text-[10px] uppercase tracking-[0.18em]" style="color: var(--muted)">Try it</span>
          <app-method-badge [method]="endpoint.method"></app-method-badge>
          <span class="font-mono text-sm truncate" style="color: var(--text)">{{ endpoint.route }}</span>
        </div>
        <button
          (click)="run()"
          [disabled]="loading()"
          class="pill text-xs font-mono uppercase tracking-wider px-4 py-2 transition-all"
          style="background: var(--accent); color:#04120E"
          data-testid="try-it-run"
        >
          {{ loading() ? 'Sending…' : 'Send request' }}
        </button>
      </div>

      <div class="p-5 grid md:grid-cols-2 gap-5" style="background: var(--panel-2)">
        <div>
          <div class="text-[10px] uppercase tracking-[0.18em] mb-2" style="color: var(--muted)">Mock response · {{ status() }}</div>
          <app-code-block variant="response" [payload]="response()"></app-code-block>
        </div>
        <div>
          <div class="text-[10px] uppercase tracking-[0.18em] mb-2" style="color: var(--muted)">Latency</div>
          <div class="terminal p-5">
            <div class="font-mono text-sm" style="color:#D5DCE8">
              <div class="flex items-center justify-between mb-2"><span>HTTP</span><span class="tok-num">{{ status() }}</span></div>
              <div class="flex items-center justify-between mb-2"><span>took</span><span class="tok-num">{{ latency() }} ms</span></div>
              <div class="flex items-center justify-between mb-2"><span>region</span><span class="tok-str">"iad-02"</span></div>
              <div class="flex items-center justify-between"><span>trace</span><span class="tok-str">"trc_{{ traceId() }}"</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TryItComponent {
  @Input({ required: true }) endpoint!: Endpoint;

  loading = signal(false);
  response = signal<unknown>({ ready: true });
  status = signal<number>(200);
  latency = signal<number>(87);
  traceId = signal<string>('5d8fe');

  run() {
    this.loading.set(true);
    setTimeout(() => {
      const useError = Math.random() < 0.15;
      this.response.set(useError ? this.endpoint.errorResponse : this.endpoint.successResponse);
      this.status.set(useError ? (this.endpoint.statusCodes.find((s) => s.code >= 400)?.code ?? 400) : this.endpoint.statusCodes[0].code);
      this.latency.set(60 + Math.floor(Math.random() * 180));
      this.traceId.set(Math.random().toString(36).slice(2, 7));
      this.loading.set(false);
    }, 520);
  }
}
