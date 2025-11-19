import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { UiStore } from '../../../stores/ui/ui.store';
import { Header } from '../../header/header';
import { Footer } from '../../footer/footer';
import { SidebarComponent } from '../sidebar';

/**
 * Main Layout Component
 *
 * Provides the main application layout with:
 * - Header (always visible)
 * - Sidebar (for authenticated users)
 * - Main content area
 * - Footer
 */
@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Footer, SidebarComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayoutComponent {
  protected authService = inject(AuthService);
  protected uiStore = inject(UiStore);

  protected isAuthenticated = this.authService.isAuthenticated;
  protected isSidebarOpen = this.uiStore.isSidebarOpen;
}
