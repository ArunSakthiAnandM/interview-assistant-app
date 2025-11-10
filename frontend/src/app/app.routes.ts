import { Routes } from '@angular/router';
import {
  authGuard,
  guestGuard,
  adminGuard,
  orgAdminGuard,
  interviewerGuard,
  candidateGuard,
  canManageInterviewsGuard,
  canViewInterviewsGuard,
} from '../guards';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('../components/home/home').then((m) => m.Home),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('../components/login/login').then((m) => m.Login),
  },
  {
    path: 'register/organisation',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('../components/register/organisation/organisation').then((m) => m.Organisation),
  },
  {
    path: 'register/interviewer',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('../components/register/interviewer/interviewer').then((m) => m.Interviewer),
  },
  {
    path: 'register/candidate',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('../components/register/candidate/candidate').then((m) => m.Candidate),
  },

  // Dashboard routes with guards
  {
    path: 'dashboard/admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('../components/dashboard/admin/admin-dashboard').then((m) => m.AdminDashboard),
  },
  {
    path: 'dashboard/organisation',
    canActivate: [authGuard, orgAdminGuard],
    loadComponent: () =>
      import('../components/dashboard/organisation/organisation-dashboard').then(
        (m) => m.OrganisationDashboard
      ),
  },
  {
    path: 'dashboard/interviewer',
    canActivate: [authGuard, interviewerGuard],
    loadComponent: () =>
      import('../components/dashboard/interviewer/interviewer-dashboard').then(
        (m) => m.InterviewerDashboard
      ),
  },
  {
    path: 'dashboard/candidate',
    canActivate: [authGuard, candidateGuard],
    loadComponent: () =>
      import('../components/dashboard/candidate/candidate-dashboard').then(
        (m) => m.CandidateDashboard
      ),
  },

  // Interview routes
  {
    path: 'interviews',
    canActivate: [authGuard, canViewInterviewsGuard],
    loadComponent: () =>
      import('../components/interview/interview-list').then((m) => m.InterviewList),
  },
  {
    path: 'interviews/create',
    canActivate: [authGuard, orgAdminGuard],
    loadComponent: () =>
      import('../components/interview/interview-create').then((m) => m.InterviewCreate),
  },
  {
    path: 'interviews/:id',
    canActivate: [authGuard, canViewInterviewsGuard],
    loadComponent: () =>
      import('../components/interview/interview-detail').then((m) => m.InterviewDetail),
  },
  {
    path: 'interviews/:id/feedback',
    canActivate: [authGuard, canManageInterviewsGuard],
    loadComponent: () =>
      import('../components/interview/interview-feedback').then((m) => m.InterviewFeedback),
  },

  // Profile route
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('../components/profile/profile').then((m) => m.Profile),
  },

  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
