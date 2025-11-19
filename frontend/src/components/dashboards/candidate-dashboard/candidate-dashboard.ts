import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CandidateDashboardResponse } from '../../../models/dashboard.model';
import { ROUTES } from '../../../constants/routes';

@Component({
  selector: 'app-candidate-dashboard',
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './candidate-dashboard.html',
  styleUrl: './candidate-dashboard.scss',
})
export class CandidateDashboardComponent implements OnInit {
  protected router = inject(Router);
  protected ROUTES = ROUTES;
  protected stats = signal<Partial<CandidateDashboardResponse>>({
    appliedInterviews: 0,
  });
  protected roundStatuses = signal({
    pending: 0,
    scheduled: 0,
    completed: 0,
    selected: 0,
    rejected: 0,
  });

  ngOnInit(): void {
    this.stats.set({
      candidateId: '1',
      candidateName: 'Candidate',
      appliedInterviews: 5,
    });
    this.roundStatuses.set({
      pending: 2,
      scheduled: 1,
      completed: 3,
      selected: 1,
      rejected: 1,
    });
  }

  protected navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
