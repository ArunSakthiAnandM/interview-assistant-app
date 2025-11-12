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
import { DashboardService } from '../../../services/dashboard.service';
import { RecruiterService } from '../../../services/recruiter.service';
import { VerificationStatus } from '../../../models';

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
  contactEmail?: string;
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
  private dashboardService = inject(DashboardService);
  private recruiterService = inject(RecruiterService);
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
    // Load admin dashboard stats from API
    this.dashboardService.getAdminDashboard().subscribe({
      next: (data) => {
        this.stats = {
          totalRecruiters: data.stats.totalRecruiters,
          pendingRecruiters: data.stats.pendingRecruiters,
          totalUsers: data.stats.totalUsers,
          activeUsers: data.stats.totalUsers, // Assuming all are active
          totalInterviews: data.stats.totalInterviews,
          todayInterviews: 0, // Not in API response
          successRate: 0, // Calculate if needed
        };
      },
      error: (error) => {
        console.error('Failed to load dashboard stats', error);
        this.notificationStore.error('Failed to load dashboard statistics');
      },
    });

    this.loadPendingRecruiters();
    this.loadRecentActivity();
  }

  loadPendingRecruiters(): void {
    this.isLoadingRecruiters.set(true);

    // Fetch pending recruiters from API
    this.recruiterService.getAllRecruiters(VerificationStatus.PENDING, undefined, 0, 20).subscribe({
      next: (response) => {
        this.pendingRecruiters.set(
          response.content.map((recruiter) => ({
            id: recruiter.id || '',
            name: recruiter.name,
            email: recruiter.contactEmail,
            registrationDate: recruiter.createdAt || new Date(),
            contactEmail: recruiter.contactEmail,
          }))
        );
        this.isLoadingRecruiters.set(false);
      },
      error: (error) => {
        console.error('Failed to load pending recruiters', error);
        this.notificationStore.error('Failed to load pending recruiters');
        this.isLoadingRecruiters.set(false);
      },
    });
  }

  private loadRecentActivity(): void {
    // TODO: Implement API call to fetch recent activity when available
    // For now, keeping mock data
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
    // TODO: Navigate to recruiter detail view when component is created
    this.notificationStore.info(`Viewing recruiter ${recruiterId}`, 'Recruiter Details');
  }

  approveRecruiter(recruiterId: string): void {
    this.recruiterService.verifyRecruiter(recruiterId).subscribe({
      next: () => {
        this.notificationStore.success('Recruiter approved successfully');
        this.loadPendingRecruiters();
      },
      error: (error) => {
        console.error('Failed to approve recruiter', error);
        this.notificationStore.error('Failed to approve recruiter');
      },
    });
  }

  rejectRecruiter(recruiterId: string): void {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) {
      this.notificationStore.warning('Rejection cancelled - reason is required');
      return;
    }

    this.recruiterService.rejectRecruiter(recruiterId, reason).subscribe({
      next: () => {
        this.notificationStore.warning('Recruiter rejected');
        this.loadPendingRecruiters();
      },
      error: (error) => {
        console.error('Failed to reject recruiter', error);
        this.notificationStore.error('Failed to reject recruiter');
      },
    });
  }
}
