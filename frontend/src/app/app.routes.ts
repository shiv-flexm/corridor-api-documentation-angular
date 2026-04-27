import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent)
  },
  {
    path: 'docs/:module/:endpoint',
    loadComponent: () => import('./pages/endpoint/endpoint.component').then((m) => m.EndpointComponent)
  },
  { path: '**', redirectTo: '' }
];
