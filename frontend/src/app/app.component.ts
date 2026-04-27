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
    <div class="grain h-screen flex overflow-hidden" [attr.data-theme]="theme.theme()">
      <!-- Fixed sidebar -->
      <app-sidebar class="hidden md:flex shrink-0" data-testid="app-sidebar"></app-sidebar>

      <!-- Right column: sticky header + scrollable main -->
      <div class="flex-1 min-w-0 flex flex-col relative z-10 overflow-hidden">
        <app-topbar data-testid="app-topbar"></app-topbar>

        <main
          id="main-scroll"
          class="flex-1 min-w-0 overflow-y-auto overflow-x-hidden scroll-smooth"
          data-testid="app-main"
        >
          <router-outlet></router-outlet>
          <footer class="px-8 py-6 text-xs" style="color: var(--muted)">
            <div class="max-w-5xl mx-auto flex items-center justify-between">
              <span>Built with Angular · Relay API Docs</span>
              <span class="font-mono">api.relay.dev</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  `
})
export class AppComponent {
  theme = inject(ThemeService);
}
