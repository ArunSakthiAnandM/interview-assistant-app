import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth/auth.service';
import { ROUTES } from '../../constants/routes';
import { UserRole } from '../../models/user.model';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface RoleInfo {
  role: UserRole;
  title: string;
  description: string;
  features: string[];
  icon: string;
  color: string;
}

/**
 * Home Component (Landing Page)
 *
 * Public landing page explaining the application and role-based features.
 * Provides navigation to login and registration based on user type.
 */
@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected router = inject(Router);
  protected authService = inject(AuthService);

  // Check if user is authenticated
  protected isAuthenticated = this.authService.isAuthenticated;
  protected currentUser = this.authService.currentUser;

  // Application features
  protected features: Feature[] = [
    {
      icon: 'business',
      title: 'Organisation Management',
      description:
        'Register and manage your organisation with complete verification and profile management.',
    },
    {
      icon: 'people',
      title: 'User Management',
      description: 'Invite users, assign roles, and manage permissions across your organization.',
    },
    {
      icon: 'event',
      title: 'Interview Scheduling',
      description:
        'Schedule interviews with progressive rounds, assign interviewers, and track availability.',
    },
    {
      icon: 'rate_review',
      title: 'Feedback System',
      description: 'Collect structured feedback with visibility controls and decision tracking.',
    },
    {
      icon: 'notifications',
      title: 'Smart Notifications',
      description:
        'Stay informed with real-time notifications for interviews, feedback, and updates.',
    },
    {
      icon: 'folder',
      title: 'Document Management',
      description: 'Upload, manage, and share resumes and KYC documents securely.',
    },
  ];

  // Role-specific information
  protected roles: RoleInfo[] = [
    {
      role: UserRole.ADMIN,
      title: 'System Administrator',
      description: 'Full system access for platform management',
      features: [
        'Manage all organisations and users',
        'Configure system settings',
        'Monitor platform analytics',
        'Handle escalations and support',
      ],
      icon: 'admin_panel_settings',
      color: '#f44336',
    },
    {
      role: UserRole.ORGANISATION_ADMIN,
      title: 'Organisation Admin',
      description: 'Manage your organisation and team members',
      features: [
        'Organisation profile management',
        'Invite and manage users',
        'Configure organisation settings',
        'View analytics and reports',
      ],
      icon: 'business_center',
      color: '#2196f3',
    },
    {
      role: UserRole.RECRUITER,
      title: 'Recruiter',
      description: 'Schedule and coordinate interviews',
      features: [
        'Create and manage interviews',
        'Schedule interview rounds',
        'Assign interviewers',
        'Track interview progress',
      ],
      icon: 'person_search',
      color: '#4caf50',
    },
    {
      role: UserRole.INTERVIEWER,
      title: 'Interviewer',
      description: 'Conduct interviews and provide feedback',
      features: [
        'View assigned interviews',
        'Manage availability',
        'Submit feedback',
        'Track interview history',
      ],
      icon: 'psychology',
      color: '#ff9800',
    },
    {
      role: UserRole.CANDIDATE,
      title: 'Candidate',
      description: 'Track your interview journey',
      features: [
        'View interview schedule',
        'Upload documents',
        'Receive notifications',
        'Track application status',
      ],
      icon: 'person',
      color: '#9c27b0',
    },
  ];

  /**
   * Navigate to login page
   */
  protected goToLogin(): void {
    this.router.navigate([ROUTES.LOGIN]);
  }

  /**
   * Navigate to registration page
   */
  protected goToRegister(): void {
    this.router.navigate([ROUTES.REGISTER]);
  }

  /**
   * Navigate to organisation registration
   */
  protected goToOrgRegister(): void {
    this.router.navigate([ROUTES.ORG_REGISTER]);
  }

  /**
   * Navigate to user's dashboard based on role
   */
  protected goToDashboard(): void {
    const user = this.currentUser();
    if (!user) return;

    switch (user.role) {
      case UserRole.ADMIN:
        this.router.navigate([ROUTES.ADMIN.DASHBOARD]);
        break;
      case UserRole.ORGANISATION_ADMIN:
        this.router.navigate([ROUTES.ORGANISATION.DASHBOARD]);
        break;
      case UserRole.RECRUITER:
        this.router.navigate([ROUTES.RECRUITER.DASHBOARD]);
        break;
      case UserRole.INTERVIEWER:
        this.router.navigate([ROUTES.INTERVIEWER.DASHBOARD]);
        break;
      case UserRole.CANDIDATE:
        this.router.navigate([ROUTES.CANDIDATE.DASHBOARD]);
        break;
    }
  }
}
