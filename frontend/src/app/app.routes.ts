import { Routes } from '@angular/router';
import { MainLayoutComponent } from '../components/layout/main-layout/main-layout';
import { LoginComponent } from '../components/auth/login/login';
import { authGuard, guestGuard } from '../guards';
import { ROUTES } from '../constants/routes';
import { UserRole } from '../models/user.model';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      // Public routes
      {
        path: '',
        loadComponent: () => import('../components/home/home').then((m) => m.Home),
      },
      {
        path: ROUTES.LOGIN,
        component: LoginComponent,
        canActivate: [guestGuard],
      },
      {
        path: ROUTES.REGISTER,
        loadComponent: () =>
          import('../components/auth/register/register').then((m) => m.RegisterComponent),
        canActivate: [guestGuard],
      },
      {
        path: ROUTES.ORG_REGISTER,
        loadComponent: () =>
          import('../components/organisation/org-register/org-register').then(
            (m) => m.OrgRegisterComponent
          ),
        canActivate: [guestGuard],
      },

      // Admin routes
      {
        path: ROUTES.ADMIN.DASHBOARD,
        loadComponent: () =>
          import('../components/dashboards/admin-dashboard/admin-dashboard').then(
            (m) => m.AdminDashboardComponent
          ),
        canActivate: [authGuard],
        data: { roles: [UserRole.ADMIN] },
      },
      {
        path: ROUTES.ADMIN.ORGANISATIONS,
        loadComponent: () =>
          import('../components/organisation/org-list/org-list').then((m) => m.OrgListComponent),
        canActivate: [authGuard],
        data: { roles: [UserRole.ADMIN] },
      },
      {
        path: ROUTES.ADMIN.USERS,
        loadComponent: () =>
          import('../components/users/user-list/user-list').then((m) => m.UserListComponent),
        canActivate: [authGuard],
        data: { roles: [UserRole.ADMIN] },
      },
      {
        path: ROUTES.ADMIN.INTERVIEWS,
        loadComponent: () =>
          import('../components/interviews/interview-list/interview-list').then(
            (m) => m.InterviewListComponent
          ),
        canActivate: [authGuard],
        data: { roles: [UserRole.ADMIN] },
      },

      // Organisation Admin routes
      {
        path: ROUTES.ORGANISATION.DASHBOARD,
        loadComponent: () =>
          import('../components/dashboards/organisation-dashboard/organisation-dashboard').then(
            (m) => m.OrganisationDashboardComponent
          ),
        canActivate: [authGuard],
        data: { roles: [UserRole.ORGANISATION_ADMIN] },
      },
      {
        path: ROUTES.ORGANISATION.PROFILE,
        loadComponent: () =>
          import('../components/organisation/org-profile/org-profile').then(
            (m) => m.OrgProfileComponent
          ),
        canActivate: [authGuard],
        data: { roles: [UserRole.ORGANISATION_ADMIN] },
      },
      {
        path: ROUTES.ORGANISATION.INVITE,
        loadComponent: () =>
          import('../components/users/user-invite/user-invite').then((m) => m.UserInviteComponent),
        canActivate: [authGuard],
        data: { roles: [UserRole.ORGANISATION_ADMIN, UserRole.ADMIN] },
      },
      {
        path: ROUTES.ORGANISATION.INTERVIEWS,
        loadComponent: () =>
          import('../components/interviews/interview-list/interview-list').then(
            (m) => m.InterviewListComponent
          ),
        canActivate: [authGuard],
        data: { roles: [UserRole.ORGANISATION_ADMIN] },
      },

      // Recruiter routes
      {
        path: ROUTES.RECRUITER.DASHBOARD,
        loadComponent: () =>
          import('../components/dashboards/recruiter-dashboard/recruiter-dashboard').then(
            (m) => m.RecruiterDashboardComponent
          ),
        canActivate: [authGuard],
        data: { roles: [UserRole.RECRUITER] },
      },
      {
        path: ROUTES.RECRUITER.INTERVIEWS,
        loadComponent: () =>
          import('../components/interviews/interview-list/interview-list').then(
            (m) => m.InterviewListComponent
          ),
        canActivate: [authGuard],
        data: { roles: [UserRole.RECRUITER] },
      },
      {
        path: ROUTES.RECRUITER.INTERVIEW_CREATE,
        loadComponent: () =>
          import('../components/interviews/interview-create/interview-create').then(
            (m) => m.InterviewCreateComponent
          ),
        canActivate: [authGuard],
        data: { roles: [UserRole.RECRUITER] },
      },
      {
        path: ROUTES.RECRUITER.INTERVIEW_DETAIL,
        loadComponent: () =>
          import('../components/interviews/interview-detail/interview-detail').then(
            (m) => m.InterviewDetailComponent
          ),
        canActivate: [authGuard],
        data: { roles: [UserRole.RECRUITER] },
      },

      // Interviewer routes
      {
        path: ROUTES.INTERVIEWER.DASHBOARD,
        loadComponent: () =>
          import('../components/dashboards/interviewer-dashboard/interviewer-dashboard').then(
            (m) => m.InterviewerDashboardComponent
          ),
        canActivate: [authGuard],
        data: { roles: [UserRole.INTERVIEWER] },
      },
      {
        path: ROUTES.INTERVIEWER.INTERVIEWS,
        loadComponent: () =>
          import('../components/interviews/interview-list/interview-list').then(
            (m) => m.InterviewListComponent
          ),
        canActivate: [authGuard],
        data: { roles: [UserRole.INTERVIEWER] },
      },
      {
        path: ROUTES.INTERVIEWER.INTERVIEW_DETAIL,
        loadComponent: () =>
          import('../components/interviews/interview-detail/interview-detail').then(
            (m) => m.InterviewDetailComponent
          ),
        canActivate: [authGuard],
        data: { roles: [UserRole.INTERVIEWER] },
      },

      // Candidate routes
      {
        path: ROUTES.CANDIDATE.DASHBOARD,
        loadComponent: () =>
          import('../components/dashboards/candidate-dashboard/candidate-dashboard').then(
            (m) => m.CandidateDashboardComponent
          ),
        canActivate: [authGuard],
        data: { roles: [UserRole.CANDIDATE] },
      },
      {
        path: ROUTES.CANDIDATE.INTERVIEWS,
        loadComponent: () =>
          import('../components/interviews/interview-list/interview-list').then(
            (m) => m.InterviewListComponent
          ),
        canActivate: [authGuard],
        data: { roles: [UserRole.CANDIDATE] },
      },
      {
        path: ROUTES.CANDIDATE.INTERVIEW_DETAIL,
        loadComponent: () =>
          import('../components/interviews/interview-detail/interview-detail').then(
            (m) => m.InterviewDetailComponent
          ),
        canActivate: [authGuard],
        data: { roles: [UserRole.CANDIDATE] },
      },
      {
        path: ROUTES.CANDIDATE.PROFILE,
        loadComponent: () =>
          import('../components/shared/profile/profile').then((m) => m.ProfileComponent),
        canActivate: [authGuard],
        data: { roles: [UserRole.CANDIDATE] },
      },

      // Shared authenticated routes
      {
        path: ROUTES.PROFILE,
        loadComponent: () =>
          import('../components/shared/profile/profile').then((m) => m.ProfileComponent),
        canActivate: [authGuard],
      },
      {
        path: ROUTES.NOTIFICATIONS,
        loadComponent: () =>
          import('../components/shared/notifications/notifications').then(
            (m) => m.NotificationsComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: ROUTES.INVITATIONS,
        loadComponent: () =>
          import('../components/shared/invitations/invitations').then(
            (m) => m.InvitationsComponent
          ),
        canActivate: [authGuard],
      },

      // Error routes
      {
        path: ROUTES.UNAUTHORIZED,
        loadComponent: () => import('../components/home/home').then((m) => m.Home),
      },

      // Fallback
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
