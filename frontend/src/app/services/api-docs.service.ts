import { Injectable, signal, computed } from '@angular/core';
import { API_MODULES, ApiModule, Endpoint } from '../data/api-data';

@Injectable({ providedIn: 'root' })
export class ApiDocsService {
  private readonly _modules = signal<ApiModule[]>(API_MODULES);
  private readonly _version = signal<'v1' | 'v2'>('v1');
  private readonly _search = signal<string>('');

  readonly version = this._version.asReadonly();
  readonly search = this._search.asReadonly();

  readonly filteredModules = computed<ApiModule[]>(() => {
    const q = this._search().trim().toLowerCase();
    const v = this._version();
    return this._modules()
      .map((m) => ({
        ...m,
        endpoints: m.endpoints.filter((e) => {
          if (!e.versions.includes(v)) return false;
          if (!q) return true;
          return (
            e.name.toLowerCase().includes(q) ||
            e.route.toLowerCase().includes(q) ||
            e.method.toLowerCase().includes(q) ||
            m.name.toLowerCase().includes(q)
          );
        })
      }))
      .filter((m) => m.endpoints.length > 0);
  });

  setVersion(v: 'v1' | 'v2') { this._version.set(v); }
  setSearch(q: string) { this._search.set(q); }

  findEndpoint(moduleId: string, endpointId: string): { module: ApiModule; endpoint: Endpoint } | null {
    const m = this._modules().find((x) => x.id === moduleId);
    if (!m) return null;
    const e = m.endpoints.find((x) => x.id === endpointId);
    if (!e) return null;
    return { module: m, endpoint: e };
  }

  firstEndpointPath(): string {
    const m = this.filteredModules()[0] ?? this._modules()[0];
    const e = m.endpoints[0];
    return `/docs/${m.id}/${e.id}`;
  }
}
