import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _theme = signal<Theme>('dark');
  readonly theme = this._theme.asReadonly();

  constructor() {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('relay-theme') : null;
    if (saved === 'light' || saved === 'dark') this._theme.set(saved);
    effect(() => {
      const t = this._theme();
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', t === 'dark');
        document.documentElement.classList.toggle('light', t === 'light');
      }
      if (typeof localStorage !== 'undefined') localStorage.setItem('relay-theme', t);
    });
  }

  toggle() { this._theme.set(this._theme() === 'dark' ? 'light' : 'dark'); }
  set(t: Theme) { this._theme.set(t); }
}
