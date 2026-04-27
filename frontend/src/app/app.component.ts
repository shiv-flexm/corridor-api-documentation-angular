import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div class="grain min-h-screen flex" [attr.data-theme]="theme.theme()">
      <app-sidebar class="hidden md:flex" data-testid="app-sidebar"></app-sidebar>
      <div class="flex-1 min-w-0 flex flex-col relative z-10">
        <app-topbar data-testid="app-topbar"></app-topbar>
        <main class="flex-1 min-w-0" data-testid="app-main">
          <router-outlet></router-outlet>
        </main>
        <footer class="px-8 py-6 text-xs" style="color: var(--muted)">
          <div class="max-w-5xl mx-auto flex items-center justify-between">
            <span>Built with Angular · Relay API Docs</span>
            <span class="font-mono">api.relay.dev</span>
          </div>
        </footer>
      </div>
    </div>
  `
})
export class AppComponent {
  theme = inject(ThemeService);
}
