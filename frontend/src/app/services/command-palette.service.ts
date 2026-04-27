import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CommandPaletteService {
  private readonly _open = signal<boolean>(false);
  readonly open = this._open.asReadonly();

  toggle() { this._open.set(!this._open()); }
  show() { this._open.set(true); }
  hide() { this._open.set(false); }
}
