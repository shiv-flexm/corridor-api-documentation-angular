import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _signedIn = signal<boolean>(true);
  readonly signedIn = this._signedIn.asReadonly();
  toggle() { this._signedIn.set(!this._signedIn()); }
  set(v: boolean) { this._signedIn.set(v); }
}
