import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { AdminDashboardResponse } from '../../../models/dashboard.model';
import { ROUTES } from '../../../constants/routes';

/**
 * Admin Dashboard Component
 *
 * System administrator dashboard with platform-wide statistics and management tools.
 * Provides overview of all organisations, users, and system activity.
 */
@Component({
  selector: 'app-admin-dashboard',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatTableModule, MatChipsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboardComponent implements OnInit {
  protected router = inject(Router);
  protected ROUTES = ROUTES;

  // Signals for reactive state
  protected stats = signal<Partial<AdminDashboardResponse>>({
    totalOrganisations: 0,
    totalUsers: 0,
    activeInterviews: 0,
    verifiedOrganisations: 0,
  });

  protected recentOrganisations = signal<any[]>([]);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  /**
   * Load dashboard statistics and data
   */
  private loadDashboardData(): void {
    // TODO: Replace with actual API calls
    this.stats.set({
      totalOrganisations: 45,
      totalUsers: 1250,
      activeInterviews: 89,
      verifiedOrganisations: 38,
    });

    this.recentOrganisations.set([
      {
        id: '1',
        name: 'Tech Corp Solutions',
        email: 'admin@techcorp.com',
        verified: true,
      },
      {
        id: '2',
        name: 'Innovation Labs',
        email: 'contact@innovationlabs.com',
        verified: false,
      },
      {
        id: '3',
        name: 'Digital Ventures',
        email: 'info@digitalventures.com',
        verified: true,
      },
    ]);
  }

  /**
   * Navigate to specified route
   */
  protected navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
