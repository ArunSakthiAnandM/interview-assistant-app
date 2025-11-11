import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { AuthStore } from '../../store/auth.store';
import { AuthService } from '../../services/auth.service';
import { APP_ROUTES } from '../../constants';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  authStore = inject(AuthStore);
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly APP_ROUTES = APP_ROUTES;

  /**
   * Navigate to user profile
   */
  goToProfile(): void {
    this.router.navigate([APP_ROUTES.PROFILE]);
  }

  /**
   * Navigate to user's dashboard based on role
   */
  goToDashboard(): void {
    const role = this.authStore.userRole();
    switch (role) {
      case 'ADMIN':
        this.router.navigate([APP_ROUTES.DASHBOARD.ADMIN]);
        break;
      case 'RECRUITER':
        this.router.navigate([APP_ROUTES.DASHBOARD.RECRUITER]);
        break;
      case 'INTERVIEWER':
        this.router.navigate([APP_ROUTES.DASHBOARD.INTERVIEWER]);
        break;
      case 'CANDIDATE':
        this.router.navigate([APP_ROUTES.DASHBOARD.CANDIDATE]);
        break;
      default:
        this.router.navigate([APP_ROUTES.HOME]);
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    this.authService.logout();
  }
}
