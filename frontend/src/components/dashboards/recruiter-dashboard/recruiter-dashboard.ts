import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { RecruiterDashboardResponse } from '../../../models/dashboard.model';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { AuthService } from '../../../services/auth/auth.service';
import { NotificationStore } from '../../../stores/notification/notification.store';
import { ROUTES } from '../../../constants/routes';

/**
 * Recruiter Dashboard Component
 *
 * Displays recruiter-specific metrics and quick actions for managing interviews
 */
@Component({
  selector: 'app-recruiter-dashboard',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './recruiter-dashboard.html',
  styleUrl: './recruiter-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecruiterDashboardComponent implements OnInit {
  protected router = inject(Router);
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);
  private notificationStore = inject(NotificationStore);

  protected readonly ROUTES = ROUTES;

  protected stats = signal<RecruiterDashboardResponse | null>(null);
  protected isLoading = signal(true);
  protected error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    const currentUser = this.authService.currentUser();
    if (!currentUser?.id) {
      this.error.set('User not found');
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.dashboardService.getRecruiterDashboard(currentUser.id).subscribe({
      next: (data) => {
        this.stats.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load recruiter dashboard:', err);
        this.error.set('Failed to load dashboard data. Please try again.');
        this.notificationStore.error('Failed to load dashboard data');
        this.isLoading.set(false);
      },
    });
  }

  protected navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
