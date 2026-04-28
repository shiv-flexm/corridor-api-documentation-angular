import { Component, Input, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { buildCurl, buildNode, buildPython, buildTypeScript, toJson } from '../../utils/code-samples';
import { highlightCode, highlightJson } from '../../utils/highlight';

type Lang = 'curl' | 'json' | 'ts' | 'py' | 'node';

@Component({
  selector: 'app-code-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="terminal fade-up" [attr.data-testid]="'code-block-' + variant">
      <!-- Header: window dots + tabs -->
      <div class="flex items-center gap-3 px-4 py-2.5 border-b" style="border-color: rgba(255,255,255,0.06)">
        <div class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full" style="background:#FF5F56"></span>
          <span class="w-2.5 h-2.5 rounded-full" style="background:#FFBD2E"></span>
          <span class="w-2.5 h-2.5 rounded-full" style="background:#27C93F"></span>
        </div>
        <div class="flex items-center gap-1 ml-2 flex-wrap">
          <button
            *ngFor="let t of availableTabs"
            (click)="setLang(t.id)"
            class="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md"
            [style.color]="lang() === t.id ? '#E9EEF6' : '#8A94A6'"
            [style.background]="lang() === t.id ? 'rgba(61,230,210,0.14)' : 'transparent'"
            [attr.data-testid]="'tab-' + t.id"
          >
            {{ t.label }}
          </button>
        </div>
        <div class="ml-auto flex items-center gap-3">
          <span *ngIf="label" class="text-[11px] font-mono" style="color:#8A94A6">{{ label }}</span>
          <button
            (click)="copy()"
            class="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md"
            [style.color]="copied() ? '#3DE6D2' : '#8A94A6'"
            style="background: rgba(255,255,255,0.04)"
            [attr.data-testid]="'copy-btn-' + variant"
          >
            <svg *ngIf="!copied()" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>
            </svg>
            <svg *ngIf="copied()" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {{ copied() ? 'Copied' : 'Copy' }}
          </button>
        </div>
      </div>
      <!-- Body -->
      <pre
        class="font-mono text-[12.5px] leading-relaxed px-5 py-4 overflow-auto whitespace-pre"
        style="color:#D5DCE8;max-height: 520px"
      ><code [innerHTML]="rendered()"></code></pre>
    </div>
  `
})
export class CodeBlockComponent implements OnChanges {
  @Input() variant: 'request' | 'payload' | 'response' = 'request';
  @Input() endpoint: any | null = null;
  @Input() payload: unknown = null;
  @Input() label = '';

  lang = signal<Lang>('curl');
  copied = signal<boolean>(false);

  get availableTabs(): { id: Lang; label: string }[] {
    if (this.variant === 'request') {
      return [
        { id: 'curl', label: 'cURL' },
        { id: 'ts', label: 'TypeScript' },
        { id: 'node', label: 'Node.js' },
        { id: 'py', label: 'Python' },
        { id: 'json', label: 'JSON' }
      ];
    }
    return [{ id: 'json', label: 'JSON' }];
  }

  ngOnChanges(_: SimpleChanges) {
    if (this.variant !== 'request' && this.lang() !== 'json') this.lang.set('json');
  }

  setLang(l: Lang) { this.lang.set(l); }

  raw(): string {
    if (this.variant !== 'request') return toJson(this.payload ?? {});
    const ep = this.endpoint!;
    switch (this.lang()) {
      case 'curl': return buildCurl(ep);
      case 'ts': return buildTypeScript(ep);
      case 'node': return buildNode(ep);
      case 'py': return buildPython(ep);
      case 'json': return ep.requestBody ? toJson(ep.requestBody) : toJson({});
    }
  }

  rendered(): string {
    const r = this.raw();
    switch (this.lang()) {
      case 'json': return highlightJson(r);
      case 'curl': return highlightCode(r, 'bash');
      case 'py': return highlightCode(r, 'py');
      case 'ts': return highlightCode(r, 'ts');
      case 'node': return highlightCode(r, 'js');
    }
  }

  async copy() {
    try {
      await navigator.clipboard.writeText(this.raw());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1600);
    } catch {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1600);
    }
  }
}
