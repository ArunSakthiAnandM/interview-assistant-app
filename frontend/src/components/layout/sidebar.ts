import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../../services/auth/auth.service';
import { UiStore } from '../../stores/ui/ui.store';
import { ROUTES } from '../../constants/routes';
import { UserRole } from '../../models/user.model';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  badge?: number;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

/**
 * Sidebar Component
 *
 * Role-based navigation sidebar for authenticated users.
 * Displays different menu items based on user role.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class SidebarComponent {
  protected authService = inject(AuthService);
  protected uiStore = inject(UiStore);

  protected userRole = this.authService.userRole;
  protected isSidebarOpen = this.uiStore.isSidebarOpen;
  protected isSidebarPinned = this.uiStore.isSidebarPinned;

  /**
   * Navigation sections based on user role
   */
  protected navSections = computed<NavSection[]>(() => {
    const role = this.userRole();
    if (!role) return [];

    switch (role) {
      case UserRole.ADMIN:
        return [
          {
            items: [{ label: 'Dashboard', route: ROUTES.ADMIN.DASHBOARD, icon: 'dashboard' }],
          },
          {
            title: 'Management',
            items: [
              { label: 'Organisations', route: ROUTES.ADMIN.ORGANISATIONS, icon: 'business' },
              { label: 'Users', route: ROUTES.ADMIN.USERS, icon: 'people' },
              { label: 'Interviews', route: ROUTES.ADMIN.INTERVIEWS, icon: 'event' },
            ],
          },
          {
            title: 'Settings',
            items: [
              { label: 'Analytics', route: ROUTES.ADMIN.ANALYTICS, icon: 'analytics' },
              { label: 'Profile', route: ROUTES.PROFILE, icon: 'settings' },
            ],
          },
        ];

      case UserRole.ORGANISATION_ADMIN:
        return [
          {
            items: [
              { label: 'Dashboard', route: ROUTES.ORGANISATION.DASHBOARD, icon: 'dashboard' },
            ],
          },
          {
            title: 'Organisation',
            items: [
              { label: 'Profile', route: ROUTES.ORGANISATION.PROFILE, icon: 'business' },
              { label: 'Verification', route: ROUTES.ORGANISATION.VERIFICATION, icon: 'verified' },
            ],
          },
          {
            title: 'Team',
            items: [
              { label: 'Recruiters', route: ROUTES.ORGANISATION.RECRUITERS, icon: 'person_add' },
              { label: 'Interviewers', route: ROUTES.ORGANISATION.INTERVIEWERS, icon: 'people' },
              { label: 'Invite User', route: ROUTES.ORGANISATION.INVITE, icon: 'email' },
            ],
          },
          {
            title: 'Interviews',
            items: [
              { label: 'All Interviews', route: ROUTES.ORGANISATION.INTERVIEWS, icon: 'event' },
            ],
          },
        ];

      case UserRole.RECRUITER:
        return [
          {
            items: [{ label: 'Dashboard', route: ROUTES.RECRUITER.DASHBOARD, icon: 'dashboard' }],
          },
          {
            title: 'Interviews',
            items: [
              { label: 'All Interviews', route: ROUTES.RECRUITER.INTERVIEWS, icon: 'event' },
              {
                label: 'Create Interview',
                route: ROUTES.RECRUITER.INTERVIEW_CREATE,
                icon: 'add_circle',
              },
            ],
          },
          {
            title: 'Management',
            items: [{ label: 'Candidates', route: ROUTES.RECRUITER.CANDIDATES, icon: 'person' }],
          },
        ];

      case UserRole.INTERVIEWER:
        return [
          {
            items: [{ label: 'Dashboard', route: ROUTES.INTERVIEWER.DASHBOARD, icon: 'dashboard' }],
          },
          {
            title: 'Interviews',
            items: [
              { label: 'My Interviews', route: ROUTES.INTERVIEWER.INTERVIEWS, icon: 'event' },
              {
                label: 'Pending Feedback',
                route: ROUTES.INTERVIEWER.FEEDBACK,
                icon: 'rate_review',
              },
            ],
          },
          {
            title: 'Availability',
            items: [
              {
                label: 'Manage Availability',
                route: ROUTES.INTERVIEWER.AVAILABILITY,
                icon: 'calendar_today',
              },
            ],
          },
          {
            title: 'Profile',
            items: [{ label: 'My Profile', route: ROUTES.PROFILE, icon: 'person' }],
          },
        ];

      case UserRole.CANDIDATE:
        return [
          {
            items: [{ label: 'Dashboard', route: ROUTES.CANDIDATE.DASHBOARD, icon: 'dashboard' }],
          },
          {
            title: 'Interviews',
            items: [{ label: 'My Interviews', route: ROUTES.CANDIDATE.INTERVIEWS, icon: 'event' }],
          },
          {
            title: 'Profile',
            items: [{ label: 'My Profile', route: ROUTES.CANDIDATE.PROFILE, icon: 'person' }],
          },
        ];

      default:
        return [];
    }
  });

  /**
   * Close sidebar (for mobile)
   */
  protected closeSidebar(): void {
    this.uiStore.closeSidebar();
  }

  /**
   * Toggle sidebar pin
   */
  protected togglePin(): void {
    this.uiStore.toggleSidebarPinned();
  }
}
