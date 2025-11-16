import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { RecruiterDashboardResponse } from '../../../models/dashboard.model';
import { ROUTES } from '../../../constants/routes';

/**
 * Recruiter Dashboard Component
 *
 * Displays recruiter-specific metrics and quick actions for managing interviews
 */
@Component({
  selector: 'app-recruiter-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './recruiter-dashboard.html',
  styleUrl: './recruiter-dashboard.scss',
})
export class RecruiterDashboardComponent implements OnInit {
  protected router = inject(Router);
  protected ROUTES = ROUTES;
  protected stats = signal<Partial<RecruiterDashboardResponse>>({
    interviewsCreated: 0,
    candidatesInPipeline: 0,
    pendingDecisions: 0,
  });

  ngOnInit(): void {
    // Mock data - replace with actual API call
    this.stats.set({
      recruiterId: '1',
      recruiterName: 'Recruiter',
      interviewsCreated: 24,
      candidatesInPipeline: 18,
      pendingDecisions: 5,
      completedThisMonth: 12,
      successRate: 75,
    });
  }

  protected navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
