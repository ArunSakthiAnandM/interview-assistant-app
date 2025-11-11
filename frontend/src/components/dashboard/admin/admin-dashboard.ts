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
  totalRecruiters: number;
  pendingRecruiters: number;
  totalUsers: number;
  activeUsers: number;
  totalInterviews: number;
  todayInterviews: number;
  successRate: number;
}

interface PendingRecruiter {
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
    totalRecruiters: 0,
    pendingRecruiters: 0,
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

  isLoadingRecruiters = signal<boolean>(false);
  pendingRecruiters = signal<PendingRecruiter[]>([]);
  recentActivity = signal<Activity[]>([]);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // TODO: Implement API call to fetch dashboard statistics
    // GET /api/v1/admin/dashboard/stats
    this.stats = {
      totalRecruiters: 45,
      pendingRecruiters: 8,
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

    this.loadPendingRecruiters();
    this.loadRecentActivity();
  }

  loadPendingRecruiters(): void {
    this.isLoadingRecruiters.set(true);

    // TODO: Implement API call to fetch pending recruiters
    // GET /api/v1/admin/recruiters/pending
    setTimeout(() => {
      this.pendingRecruiters.set([
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
      this.isLoadingRecruiters.set(false);
    }, 1000);
  }

  private loadRecentActivity(): void {
    // TODO: Implement API call to fetch recent activity
    // GET /api/v1/admin/activity/recent
    this.recentActivity.set([
      {
        id: '1',
        icon: 'business',
        title: 'New Recruiter Registration',
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

  viewRecruiter(recruiterId: string): void {
    // TODO: Navigate to recruiter detail view
    // this.router.navigate(['/admin/recruiters', recruiterId]);
    this.notificationStore.info(`Viewing recruiter ${recruiterId}`, 'Recruiter Details');
  }

  approveRecruiter(recruiterId: string): void {
    console.log('Approving recruiter:', recruiterId);
    // TODO: Implement API call to approve recruiter
    // PUT /api/v1/recruiters/{recruiterId}/verify
    this.notificationStore.success(`Recruiter approved successfully`);
    this.loadPendingRecruiters();
  }

  rejectRecruiter(recruiterId: string): void {
    console.log('Rejecting recruiter:', recruiterId);
    // TODO: Implement API call to reject recruiter
    // PUT /api/v1/recruiters/{recruiterId}/reject?reason={reason}
    this.notificationStore.warning(`Recruiter rejected`);
    this.loadPendingRecruiters();
  }
}
