import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { CommandPaletteComponent } from './components/command-palette/command-palette.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, CommandPaletteComponent],
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
        </main>

        <footer
          class="shrink-0 border-t px-6 md:px-10 py-3 text-xs flex items-center justify-center"
          style="background: var(--panel); border-color: var(--border); color: var(--muted)"
          data-testid="app-footer"
        >
          <span>Copyright &copy; All Rights Reserved | Powered By <a href="https://flexm.com" target="_blank" class="underline" style="color: #2684ff;">FlexM</a></span>
        </footer>
      </div>

      <!-- Global Cmd/Ctrl+K palette -->
      <app-command-palette></app-command-palette>
    </div>
  `
})
export class AppComponent {
  theme = inject(ThemeService);
}
