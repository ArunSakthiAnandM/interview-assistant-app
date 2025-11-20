import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { OrganisationDashboardResponse } from '../../../models/dashboard.model';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { AuthService } from '../../../services/auth/auth.service';
import { NotificationStore } from '../../../stores/notification/notification.store';
import { ROUTES } from '../../../constants/routes';

/**
 * Organisation Admin Dashboard Component
 *
 * Dashboard for organisation administrators with team and interview statistics.
 */
@Component({
  selector: 'app-organisation-dashboard',
  imports: [
    DatePipe,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './organisation-dashboard.html',
  styleUrl: './organisation-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationDashboardComponent implements OnInit {
  protected router = inject(Router);
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);
  private notificationStore = inject(NotificationStore);

  protected readonly ROUTES = ROUTES;

  protected stats = signal<OrganisationDashboardResponse | null>(null);
  protected isLoading = signal(true);
  protected error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    const currentUser = this.authService.currentUser();
    if (!currentUser?.organisationId) {
      this.error.set('Organisation not found');
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.dashboardService.getOrganisationDashboard(currentUser.organisationId).subscribe({
      next: (data) => {
        this.stats.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load organisation dashboard:', err);
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
