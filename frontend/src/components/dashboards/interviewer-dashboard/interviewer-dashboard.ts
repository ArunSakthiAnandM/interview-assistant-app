import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { InterviewerDashboardResponse } from '../../../models/dashboard.model';
import { ROUTES } from '../../../constants/routes';

@Component({
  selector: 'app-interviewer-dashboard',
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './interviewer-dashboard.html',
  styleUrl: './interviewer-dashboard.scss',
})
export class InterviewerDashboardComponent implements OnInit {
  protected router = inject(Router);
  protected ROUTES = ROUTES;
  protected stats = signal<Partial<InterviewerDashboardResponse>>({
    assignedInterviews: 0,
    pendingFeedback: 0,
    feedbackSubmittedCount: 0,
  });

  ngOnInit(): void {
    this.stats.set({
      interviewerId: '1',
      interviewerName: 'Interviewer',
      assignedInterviews: 12,
      pendingFeedback: 3,
      feedbackSubmittedCount: 28,
      averageRatingGiven: 7.5,
    });
  }

  protected navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
