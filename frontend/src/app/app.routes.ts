import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'introduction' },
  {
    path: 'introduction',
    loadComponent: () =>
      import('./pages/introduction/introduction.component').then((m) => m.IntroductionComponent)
  },
  {
    path: 'docs/:module/:endpoint',
    loadComponent: () =>
      import('./pages/endpoint/endpoint.component').then((m) => m.EndpointComponent)
  },
  { path: '**', redirectTo: 'introduction' }
];
