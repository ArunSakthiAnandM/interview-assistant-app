import { Component, OnInit, signal, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthStore } from '../../../store/auth.store';
import { NotificationStore } from '../../../store/notification.store';

interface DashboardStats {
  totalOrganisations: number;
  pendingOrganisations: number;
  totalUsers: number;
  activeUsers: number;
  totalInterviews: number;
  todayInterviews: number;
  successRate: number;
}

interface PendingOrganisation {
  id: string;
  name: string;
  email: string;
  registrationDate: Date;
}

interface Activity {
  id: string;
  icon: string;
  title: string;
  description: string;
  timestamp: Date;
}

interface SystemHealth {
  apiResponseTime: number;
  databaseStatus: string;
  activeSessions: number;
  uptime: string;
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    DatePipe,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit {
  private authStore = inject(AuthStore);
  private notificationStore = inject(NotificationStore);
  private router = inject(Router);

  stats: DashboardStats = {
    totalOrganisations: 0,
    pendingOrganisations: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalInterviews: 0,
    todayInterviews: 0,
    successRate: 0,
  };

  systemHealth: SystemHealth = {
    apiResponseTime: 0,
    databaseStatus: 'Healthy',
    activeSessions: 0,
    uptime: '0d 0h',
  };

  isLoadingOrgs = signal<boolean>(false);
  pendingOrganisations = signal<PendingOrganisation[]>([]);
  recentActivity = signal<Activity[]>([]);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // TODO: Implement API call to fetch dashboard statistics
    // GET /api/v1/admin/dashboard/stats
    this.stats = {
      totalOrganisations: 45,
      pendingOrganisations: 8,
      totalUsers: 234,
      activeUsers: 189,
      totalInterviews: 567,
      todayInterviews: 12,
      successRate: 78.5,
    };

    // TODO: Implement API call to fetch system health metrics
    // GET /api/v1/admin/system/health
    this.systemHealth = {
      apiResponseTime: 145,
      databaseStatus: 'Healthy',
      activeSessions: 42,
      uptime: '15d 7h',
    };

    this.loadPendingOrganisations();
    this.loadRecentActivity();
  }

  loadPendingOrganisations(): void {
    this.isLoadingOrgs.set(true);

    // TODO: Implement API call to fetch pending organisations
    // GET /api/v1/admin/organisations/pending
    setTimeout(() => {
      this.pendingOrganisations.set([
        {
          id: '1',
          name: 'Tech Innovations Inc.',
          email: 'admin@techinnovations.com',
          registrationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          id: '2',
          name: 'Global Solutions Ltd.',
          email: 'contact@globalsolutions.com',
          registrationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
      ]);
      this.isLoadingOrgs.set(false);
    }, 1000);
  }

  private loadRecentActivity(): void {
    // TODO: Implement API call to fetch recent activity
    // GET /api/v1/admin/activity/recent
    this.recentActivity.set([
      {
        id: '1',
        icon: 'business',
        title: 'New Organisation Registration',
        description: 'DataCorp Technologies registered',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
      },
      {
        id: '2',
        icon: 'person_add',
        title: 'New Candidate',
        description: 'John Doe completed registration',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: '3',
        icon: 'event',
        title: 'Interview Completed',
        description: 'Frontend Developer interview completed',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
    ]);
  }

  viewOrganisation(orgId: string): void {
    // TODO: Navigate to organisation detail view
    // this.router.navigate(['/admin/organisations', orgId]);
    this.notificationStore.info(`Viewing organisation ${orgId}`, 'Organisation Details');
  }

  approveOrganisation(orgId: string): void {
    // TODO: Implement API call to approve organisation
    // POST /api/v1/admin/organisations/{orgId}/approve
    this.notificationStore.success('Organisation approved successfully', 'Approval');
    this.loadPendingOrganisations();
  }

  rejectOrganisation(orgId: string): void {
    // TODO: Implement API call to reject organisation
    // POST /api/v1/admin/organisations/{orgId}/reject
    // Should include rejection reason dialog
    this.notificationStore.warning('Organisation rejected', 'Rejection');
    this.loadPendingOrganisations();
  }
}
