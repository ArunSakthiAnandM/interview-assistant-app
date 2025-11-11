import { Component, OnInit, signal, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthStore } from '../../../store/auth.store';
import { InterviewStore } from '../../../store/interview.store';
import { NotificationStore } from '../../../store/notification.store';

interface DashboardStats {
  totalInterviewers: number;
  activeInterviewers: number;
  totalInterviews: number;
  scheduledInterviews: number;
  totalCandidates: number;
  selectedCandidates: number;
  successRate: number;
}

interface UpcomingInterview {
  id: string;
  position: string;
  candidateName: string;
  interviewerName: string;
  scheduledDate: Date;
  duration: number;
  status: string;
}

interface Interviewer {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
}

interface Analytics {
  thisWeek: number;
  completed: number;
  pending: number;
  cancelled: number;
}

@Component({
  selector: 'app-recruiter-dashboard',
  imports: [
    DatePipe,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatChipsModule,
    MatMenuModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './recruiter-dashboard.html',
  styleUrl: './recruiter-dashboard.scss',
})
export class RecruiterDashboard implements OnInit {
  authStore = inject(AuthStore);
  private interviewStore = inject(InterviewStore);
  private notificationStore = inject(NotificationStore);
  private router = inject(Router);

  stats: DashboardStats = {
    totalInterviewers: 0,
    activeInterviewers: 0,
    totalInterviews: 0,
    scheduledInterviews: 0,
    totalCandidates: 0,
    selectedCandidates: 0,
    successRate: 0,
  };

  analytics: Analytics = {
    thisWeek: 0,
    completed: 0,
    pending: 0,
    cancelled: 0,
  };

  isLoadingInterviews = signal<boolean>(false);
  upcomingInterviews = signal<UpcomingInterview[]>([]);
  interviewers = signal<Interviewer[]>([]);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // TODO: Implement API call to fetch recruiter dashboard statistics
    // GET /api/v1/recruiters/{recruiterId}/dashboard/stats
    this.stats = {
      totalInterviewers: 12,
      activeInterviewers: 10,
      totalInterviews: 156,
      scheduledInterviews: 8,
      totalCandidates: 89,
      selectedCandidates: 34,
      successRate: 72.5,
    };

    this.analytics = {
      thisWeek: 15,
      completed: 142,
      pending: 8,
      cancelled: 6,
    };

    this.refreshInterviews();
    this.loadInterviewers();
  }

  refreshInterviews(): void {
    this.isLoadingInterviews.set(true);

    // TODO: Implement API call to fetch upcoming interviews
    // GET /api/v1/recruiters/{recruiterId}/interviews/upcoming
    setTimeout(() => {
      this.upcomingInterviews.set([
        {
          id: '1',
          position: 'Senior Frontend Developer',
          candidateName: 'John Smith',
          interviewerName: 'Sarah Johnson',
          scheduledDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
          duration: 60,
          status: 'SCHEDULED',
        },
        {
          id: '2',
          position: 'Backend Engineer',
          candidateName: 'Emily Davis',
          interviewerName: 'Mike Wilson',
          scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          duration: 45,
          status: 'SCHEDULED',
        },
        {
          id: '3',
          position: 'DevOps Engineer',
          candidateName: 'Robert Brown',
          interviewerName: 'Lisa Anderson',
          scheduledDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
          duration: 90,
          status: 'SCHEDULED',
        },
      ]);
      this.isLoadingInterviews.set(false);
    }, 1000);
  }

  private loadInterviewers(): void {
    // TODO: Implement API call to fetch recruiter interviewers
    // GET /api/v1/recruiters/{recruiterId}/interviewers
    this.interviewers.set([
      { id: '1', name: 'Sarah Johnson', email: 'sarah.j@example.com', isActive: true },
      { id: '2', name: 'Mike Wilson', email: 'mike.w@example.com', isActive: true },
      { id: '3', name: 'Lisa Anderson', email: 'lisa.a@example.com', isActive: true },
      { id: '4', name: 'Tom Garcia', email: 'tom.g@example.com', isActive: false },
    ]);
  }

  createInterview(): void {
    this.router.navigate(['/interviews/create']);
  }

  viewInterview(interviewId: string): void {
    this.router.navigate(['/interviews', interviewId]);
  }

  inviteInterviewer(): void {
    // TODO: Open dialog to invite new interviewer
    // POST /api/v1/recruiters/{recruiterId}/interviewers/invite
    this.notificationStore.info('Invite interviewer feature coming soon', 'Feature');
  }

  manageInterviewers(): void {
    // TODO: Navigate to interviewer management page
    // this.router.navigate(['/recruiter/interviewers']);
    this.notificationStore.info('Manage interviewers feature coming soon', 'Feature');
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      SCHEDULED: '#2196f3',
      IN_PROGRESS: '#ff9800',
      COMPLETED: '#4caf50',
      CANCELLED: '#f44336',
      NO_SHOW: '#9e9e9e',
    };
    return colors[status] || '#757575';
  }
}
