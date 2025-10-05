import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('../components/home/home').then((m) => m.Home),
  },
  {
    path: 'login',
    loadComponent: () => import('../components/login/login').then((m) => m.Login),
  },
  {
    path: 'enroll',
    loadComponent: () => import('../components/enroll/enroll').then((m) => m.Enroll),
  },
  // {
  //   path: 'create-organisation',
  //   loadComponent: () =>
  //     import('./pages/create-organisation/create-organisation.component').then(
  //       (m) => m.CreateOrganisationComponent
  //     ),
  // },
  // {
  //   path: 'organisation/:organisationId',
  //   loadComponent: () =>
  //     import('./pages/organisation/organisation.component').then((m) => m.OrganisationComponent),
  // },
  // {
  //   path: 'organisation/:organisationId/create-interview',
  //   loadComponent: () =>
  //     import('./pages/create-interview/create-interview.component').then(
  //       (m) => m.CreateInterviewComponent
  //     ),
  // },
  // {
  //   path: 'organisation/:organisationId/interview/:interviewId',
  //   loadComponent: () =>
  //     import('./pages/interview/interview.component').then((m) => m.InterviewComponent),
  // },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
