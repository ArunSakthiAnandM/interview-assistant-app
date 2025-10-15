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
    path: 'register/organisation',
    loadComponent: () =>
      import('../components/register/organisation/organisation').then((m) => m.Organisation),
  },
  {
    path: 'register/interviewer',
    loadComponent: () =>
      import('../components/register/interviewer/interviewer').then((m) => m.Interviewer),
  },
  {
    path: 'register/candidate',
    loadComponent: () =>
      import('../components/register/candidate/candidate').then((m) => m.Candidate),
  },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
