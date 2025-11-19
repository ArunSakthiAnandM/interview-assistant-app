import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../../services/auth/auth.service';
import { NotificationService } from '../../services/notification/notification.service';
import { UiStore } from '../../stores/ui/ui.store';
import { ROUTES } from '../../constants/routes';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected authService = inject(AuthService);
  protected notificationService = inject(NotificationService);
  protected uiStore = inject(UiStore);
  protected router = inject(Router);

  // Expose constants for template
  protected readonly ROUTES = ROUTES;
  protected readonly UserRole = UserRole;

  // Computed values
  protected user = this.authService.currentUser;
  protected isAuthenticated = this.authService.isAuthenticated;
  protected userRole = this.authService.userRole;
  protected unreadCount = this.notificationService.unreadCount;

  // Navigation items based on role
  protected navigationItems = computed(() => {
    const role = this.userRole();
    if (!role) return [];

    switch (role) {
      case UserRole.ADMIN:
        return [
          { label: 'Dashboard', route: ROUTES.ADMIN.DASHBOARD, icon: 'dashboard' },
          { label: 'Organisations', route: ROUTES.ADMIN.ORGANISATIONS, icon: 'business' },
          { label: 'Users', route: ROUTES.ADMIN.USERS, icon: 'people' },
          { label: 'Interviews', route: ROUTES.ADMIN.INTERVIEWS, icon: 'event' },
        ];
      case UserRole.ORGANISATION_ADMIN:
        return [
          { label: 'Dashboard', route: ROUTES.ORGANISATION.DASHBOARD, icon: 'dashboard' },
          { label: 'Profile', route: ROUTES.ORGANISATION.PROFILE, icon: 'business' },
          { label: 'Team', route: ROUTES.ORGANISATION.RECRUITERS, icon: 'people' },
          { label: 'Interviews', route: ROUTES.ORGANISATION.INTERVIEWS, icon: 'event' },
        ];
      case UserRole.RECRUITER:
        return [
          { label: 'Dashboard', route: ROUTES.RECRUITER.DASHBOARD, icon: 'dashboard' },
          { label: 'Interviews', route: ROUTES.RECRUITER.INTERVIEWS, icon: 'event' },
          { label: 'Candidates', route: ROUTES.RECRUITER.CANDIDATES, icon: 'person' },
        ];
      case UserRole.INTERVIEWER:
        return [
          { label: 'Dashboard', route: ROUTES.INTERVIEWER.DASHBOARD, icon: 'dashboard' },
          { label: 'Interviews', route: ROUTES.INTERVIEWER.INTERVIEWS, icon: 'event' },
          { label: 'Availability', route: ROUTES.INTERVIEWER.AVAILABILITY, icon: 'calendar_today' },
        ];
      case UserRole.CANDIDATE:
        return [
          { label: 'Dashboard', route: ROUTES.CANDIDATE.DASHBOARD, icon: 'dashboard' },
          { label: 'Interviews', route: ROUTES.CANDIDATE.INTERVIEWS, icon: 'event' },
          { label: 'Profile', route: ROUTES.CANDIDATE.PROFILE, icon: 'person' },
        ];
      default:
        return [];
    }
  });

  /**
   * Toggle sidebar
   */
  protected toggleSidebar(): void {
    this.uiStore.toggleSidebar();
  }

  /**
   * Navigate to notifications
   */
  protected goToNotifications(): void {
    this.router.navigate([ROUTES.NOTIFICATIONS]);
  }

  /**
   * Navigate to profile
   */
  protected goToProfile(): void {
    const role = this.userRole();
    switch (role) {
      case UserRole.ORGANISATION_ADMIN:
        this.router.navigate([ROUTES.ORGANISATION.PROFILE]);
        break;
      case UserRole.CANDIDATE:
        this.router.navigate([ROUTES.CANDIDATE.PROFILE]);
        break;
      default:
        this.router.navigate([ROUTES.PROFILE]);
    }
  }

  /**
   * Navigate to profile/settings
   */
  protected goToSettings(): void {
    this.router.navigate([ROUTES.PROFILE]);
  }

  /**
   * Logout user
   */
  protected logout(): void {
    this.authService.logout().subscribe();
  }

  /**
   * Get user initials for avatar
   */
  protected getUserInitials(): string {
    const name = this.user()?.name || '';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
}
