import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { OrganisationDashboardResponse } from '../../../models/dashboard.model';
import { ROUTES } from '../../../constants/routes';

/**
 * Organisation Admin Dashboard Component
 *
 * Dashboard for organisation administrators with team and interview statistics.
 */
@Component({
  selector: 'app-organisation-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule],
  templateUrl: './organisation-dashboard.html',
  styleUrl: './organisation-dashboard.scss',
})
export class OrganisationDashboardComponent implements OnInit {
  protected router = inject(Router);
  protected ROUTES = ROUTES;

  protected stats = signal<Partial<OrganisationDashboardResponse>>({
    organisationName: 'Loading...',
    totalRecruiters: 0,
    totalInterviewers: 0,
    totalCandidates: 0,
    interviewsInProgress: 0,
  });

  protected upcomingInterviews = signal<any[]>([]);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // TODO: Replace with actual API calls
    this.stats.set({
      organisationId: '1',
      organisationName: 'My Organisation',
      totalRecruiters: 8,
      totalInterviewers: 15,
      totalCandidates: 42,
      interviewsInProgress: 12,
      interviewsCompleted: 135,
      pendingDecisions: 5,
    });

    this.upcomingInterviews.set([]);
  }

  protected navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
