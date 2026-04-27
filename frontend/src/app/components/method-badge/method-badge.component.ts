import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpMethod } from '../../data/api-data';

@Component({
  selector: 'app-method-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="inline-flex items-center font-mono text-[10px] font-semibold tracking-wider uppercase pill px-2.5 py-1 border"
      [class.bg-signal-get]="method === 'GET'"
      [class.text-black]="method === 'GET' || method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE'"
      [style.background]="bg()"
      [style.borderColor]="border()"
      [attr.data-testid]="'method-badge-' + method"
    >
      {{ method }}
    </span>
  `,
  styles: [`:host{display:inline-flex}`]
})
export class MethodBadgeComponent {
  @Input({ required: true }) method!: HttpMethod;

  bg(): string {
    const m: Record<HttpMethod, string> = {
      GET: '#3DE6D2',
      POST: '#FFB547',
      PUT: '#8B9DFF',
      PATCH: '#D78BFF',
      DELETE: '#FF7A7A'
    };
    return m[this.method];
  }
  border(): string {
    return 'rgba(0,0,0,0.2)';
  }
}
