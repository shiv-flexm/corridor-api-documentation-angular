import {
  Component, ElementRef, HostListener, ViewChild, AfterViewInit,
  computed, effect, inject, signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CommandPaletteService } from '../../services/command-palette.service';
import { ApiDocsService } from '../../services/api-docs.service';
import { AuthService } from '../../services/auth.service';
import { MethodBadgeComponent } from '../method-badge/method-badge.component';
import { API_MODULES } from '../../data/api-data';


@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule, MethodBadgeComponent],
  template: `
    <div
      *ngIf="palette.open()"
      class="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4"
      data-testid="cmdk-overlay"
      (click)="onOverlayClick($event)"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 backdrop-blur-md"
        style="background: rgba(5, 7, 10, 0.55); animation: cmdkFade 180ms ease-out both"
        aria-hidden="true"
      ></div>

      <!-- Dialog -->
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Global search"
        class="relative w-full max-w-[620px] rounded-2xl border overflow-hidden"
        style="background: var(--panel); border-color: var(--border); box-shadow: 0 30px 80px -20px rgba(0,0,0,0.5); animation: cmdkPop 200ms cubic-bezier(.2,.7,.2,1) both"
        data-testid="cmdk-dialog"
      >
        <!-- Input -->
        <div class="flex items-center gap-3 px-5 py-4 border-b" style="border-color: var(--border)">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="color: var(--muted)">
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
          </svg>
          <input
            #input
            type="text"
            [value]="query()"
            (input)="onInput($event)"
            (keydown)="onKey($event)"
            placeholder="Search endpoints, methods, routes…"
            class="flex-1 bg-transparent text-[16px] leading-7 outline-none py-1"
            style="color: var(--text)"
            data-testid="cmdk-input"
            autocomplete="off"
            spellcheck="false"
          />
          <kbd class="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border"
               style="color: var(--muted); border-color: var(--border); background: var(--panel-2)">Esc</kbd>
        </div>

        <!-- Results -->
        <div
          #list
          class="max-h-[380px] overflow-y-auto py-2"
          data-testid="cmdk-results"
        >
          <ng-container *ngIf="hits().length > 0; else empty">
            <ng-container *ngFor="let group of grouped(); let gi = index">
              <div class="px-4 pt-3 pb-1 text-[10px] font-mono uppercase tracking-[0.18em]" style="color: var(--muted)">
                {{ group.name }}
              </div>
              <button
                *ngFor="let hit of group.items; let i = index"
                type="button"
                (click)="go(hit)"
                (mouseenter)="setActive(flatIndex(group, i))"
                class="w-full flex items-center gap-3 px-4 py-2.5 text-left"
                [style.background]="active() === flatIndex(group, i) ? 'color-mix(in oklab, var(--accent) 14%, transparent)' : 'transparent'"
                [style.color]="active() === flatIndex(group, i) ? 'var(--text)' : 'var(--text)'"
                [attr.data-testid]="'cmdk-item-' + hit.module.id + '-' + hit.endpoint.id"
                [attr.data-active]="active() === flatIndex(group, i) ? 'true' : 'false'"
              >
                <app-method-badge [method]="hit.endpoint.method"></app-method-badge>
                <div class="min-w-0 flex-1">
                  <div class="text-[14px] font-medium truncate" [innerHTML]="highlight(hit.endpoint.name)"></div>
                  <div class="text-[12px] font-mono truncate" style="color: var(--muted)" [innerHTML]="highlight(hit.endpoint.route)"></div>
                </div>
                <span class="text-[10px] font-mono uppercase tracking-wider shrink-0"
                      style="color: var(--muted)">{{ hit.module.name }}</span>
                <svg *ngIf="active() === flatIndex(group, i)" class="w-4 h-4 shrink-0"
                     fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="color: var(--accent)">
                  <path d="M5 12h14M13 5l7 7-7 7"/>
                </svg>
              </button>
            </ng-container>
          </ng-container>
          <ng-template #empty>
            <div class="px-4 py-12 text-center text-sm" style="color: var(--muted)" data-testid="cmdk-empty">
              <div class="mb-1">No endpoints match "<span style="color: var(--text)">{{ query() }}</span>"</div>
              <div class="text-xs">Try a method (GET / POST), a path (/users), or a module name.</div>
            </div>
          </ng-template>
        </div>

        <!-- Footer hints -->
        <div class="flex items-center justify-between gap-3 px-4 py-2.5 border-t text-[11px] font-mono"
             style="border-color: var(--border); background: var(--panel-2); color: var(--muted)">
          <div class="flex items-center gap-3">
            <span class="inline-flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 rounded border" style="border-color: var(--border); background: var(--panel)">↑</kbd>
              <kbd class="px-1.5 py-0.5 rounded border" style="border-color: var(--border); background: var(--panel)">↓</kbd>
              navigate
            </span>
            <span class="inline-flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 rounded border" style="border-color: var(--border); background: var(--panel)">↵</kbd>
              open
            </span>
          </div>
          <span>{{ hits().length }} result<span *ngIf="hits().length !== 1">s</span></span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes cmdkFade { from { opacity: 0 } to { opacity: 1 } }
    @keyframes cmdkPop  { from { opacity: 0; transform: translateY(-8px) scale(0.98) }
                          to   { opacity: 1; transform: translateY(0) scale(1) } }
    kbd { font-family: 'JetBrains Mono', ui-monospace, monospace; line-height: 1; }
  `]
})
export class CommandPaletteComponent implements AfterViewInit {
  palette = inject(CommandPaletteService);
  private docs = inject(ApiDocsService);
  private auth = inject(AuthService);
  private router = inject(Router);

  @ViewChild('input') inputEl?: ElementRef<HTMLInputElement>;
  @ViewChild('list') listEl?: ElementRef<HTMLElement>;

  query = signal<string>('');
  active = signal<number>(0);

  hits = computed(() => {
    const q = this.query().trim().toLowerCase();
    const v = this.docs.version();
    const signedIn = this.auth.signedIn();
    const out = [];
    for (const m of API_MODULES) {
      for (const e of m.endpoints) {
        if (!e.versions.includes(v)) continue;
        if (e.requiresAuth && !signedIn) continue;
        if (!q || this.matches(e, m, q)) out.push({ module: m, endpoint: e });
      }
    }
    return out;
  });

  grouped = computed<{ id: string; name: string; items: any }[]>(() => {
    const map = new Map<string, { id: string; name: string; items: any }>();
    for (const h of this.hits()) {
      const key = h.module.id;
      if (!map.has(key)) map.set(key, { id: key, name: h.module.name, items: [] });
      map.get(key)!.items.push(h);
    }
    return [...map.values()];
  });

  constructor() {
    effect(() => {
      // reset cursor + scroll when query or open changes
      this.query();
      this.palette.open();
      this.active.set(0);
      setTimeout(() => this.scrollActiveIntoView(), 0);
    });

    effect(() => {
      if (this.palette.open()) {
        // Wait for *ngIf to render the input into the DOM
        setTimeout(() => this.inputEl?.nativeElement?.focus(), 30);
        if (typeof document !== 'undefined') document.body.style.overflow = 'hidden';
      } else {
        if (typeof document !== 'undefined') document.body.style.overflow = '';
        this.query.set('');
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.palette.open()) this.inputEl?.nativeElement.focus();
  }

  private matches(e: any, m: any, q: string): boolean {
    return (
      e.name.toLowerCase().includes(q) ||
      e.route.toLowerCase().includes(q) ||
      e.method.toLowerCase().includes(q) ||
      m.name.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q)
    );
  }

  flatIndex(group: { items: any }, i: number): number {
    let idx = 0;
    for (const g of this.grouped()) {
      if (g === group) return idx + i;
      idx += g.items.length;
    }
    return idx + i;
  }

  setActive(i: number) { this.active.set(i); }

  onInput(ev: Event) { this.query.set((ev.target as HTMLInputElement).value); }

  onKey(ev: KeyboardEvent) {
    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      const n = this.hits().length;
      if (n > 0) this.active.set((this.active() + 1) % n);
      this.scrollActiveIntoView();
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      const n = this.hits().length;
      if (n > 0) this.active.set((this.active() - 1 + n) % n);
      this.scrollActiveIntoView();
    } else if (ev.key === 'Enter') {
      ev.preventDefault();
      const hit = this.hits()[this.active()];
      if (hit) this.go(hit);
    } else if (ev.key === 'Escape') {
      ev.preventDefault();
      this.palette.hide();
    }
  }

  go(hit: any) {
    this.router.navigate(['/docs', hit.module.id, hit.endpoint.id]);
    this.palette.hide();
  }

  onOverlayClick(ev: MouseEvent) {
    if ((ev.target as HTMLElement).closest('[data-testid="cmdk-dialog"]')) return;
    this.palette.hide();
  }

  highlight(text: string): string {
    const q = this.query().trim();
    if (!q) return this.escape(text);
    const esc = this.escape(text);
    const escQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return esc.replace(new RegExp(`(${escQ})`, 'ig'),
      '<mark style="background: color-mix(in oklab, var(--accent) 30%, transparent); color: inherit; border-radius: 3px; padding: 0 2px">$1</mark>');
  }

  private escape(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  private scrollActiveIntoView() {
    const el = this.listEl?.nativeElement?.querySelector('[data-active="true"]') as HTMLElement | null;
    if (el) el.scrollIntoView({ block: 'nearest' });
  }

  // Global Ctrl/Cmd+K and Esc
  @HostListener('document:keydown', ['$event'])
  onDocKey(ev: KeyboardEvent) {
    const isK = (ev.key === 'k' || ev.key === 'K');
    if (isK && (ev.metaKey || ev.ctrlKey)) {
      ev.preventDefault();
      this.palette.toggle();
      return;
    }
    if (ev.key === 'Escape' && this.palette.open()) {
      ev.preventDefault();
      this.palette.hide();
    }
  }
}
