import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AdminDashboardResponse } from '../../../models/dashboard.model';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { NotificationStore } from '../../../stores/notification/notification.store';
import { ROUTES } from '../../../constants/routes';

/**
 * Admin Dashboard Component
 *
 * System administrator dashboard with platform-wide statistics and management tools.
 * Provides overview of all organisations, users, and system activity.
 */
@Component({
  selector: 'app-admin-dashboard',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements OnInit {
  protected router = inject(Router);
  private dashboardService = inject(DashboardService);
  private notificationStore = inject(NotificationStore);

  protected readonly ROUTES = ROUTES;

  // Signals for reactive state
  protected stats = signal<AdminDashboardResponse | null>(null);
  protected isLoading = signal(true);
  protected error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  /**
   * Load dashboard statistics and data
   */
  private loadDashboardData(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.dashboardService.getAdminDashboard().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load admin dashboard:', err);
        this.error.set('Failed to load dashboard data. Please try again.');
        this.notificationStore.error('Failed to load dashboard data');
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Navigate to specified route
   */
  protected navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
