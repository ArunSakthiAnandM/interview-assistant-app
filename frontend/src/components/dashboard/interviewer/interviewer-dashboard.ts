import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { AuthStore } from '../../../store/auth.store';
import { NotificationStore } from '../../../store/notification.store';

interface DashboardStats {
  totalInterviews: number;
  scheduled: number;
  today: number;
  completed: number;
  pendingFeedback: number;
}

interface AssignedInterview {
  id: string;
  position: string;
  candidateName: string;
  scheduledDate: Date;
  duration: number;
  location?: string;
  status: string;
  hasFeedback: boolean;
}

interface RecentFeedback {
  id: string;
  candidateName: string;
  position: string;
  rating: number;
  summary: string;
  submittedAt: Date;
}

@Component({
  selector: 'app-interviewer-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './interviewer-dashboard.html',
  styleUrl: './interviewer-dashboard.scss',
})
export class InterviewerDashboard implements OnInit {
  authStore = inject(AuthStore);
  private notificationStore = inject(NotificationStore);
  private router = inject(Router);

  stats: DashboardStats = {
    totalInterviews: 0,
    scheduled: 0,
    today: 0,
    completed: 0,
    pendingFeedback: 0,
  };

  filterType = 'upcoming';
  isLoadingInterviews = signal<boolean>(false);
  assignedInterviews = signal<AssignedInterview[]>([]);
  recentFeedback = signal<RecentFeedback[]>([]);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // TODO: Implement API call to fetch interviewer dashboard statistics
    // GET /api/v1/interviewers/{interviewerId}/dashboard/stats
    this.stats = {
      totalInterviews: 45,
      scheduled: 8,
      today: 2,
      completed: 37,
      pendingFeedback: 3,
    };

    this.refreshAssignedInterviews();
    this.loadRecentFeedback();
  }

  refreshAssignedInterviews(): void {
    this.isLoadingInterviews.set(true);

    // TODO: Implement API call to fetch assigned interviews
    // GET /api/v1/interviewers/{interviewerId}/interviews?filter={filterType}
    setTimeout(() => {
      const mockInterviews: AssignedInterview[] = [
        {
          id: '1',
          position: 'Senior React Developer',
          candidateName: 'Alice Johnson',
          scheduledDate: new Date(Date.now() + 3 * 60 * 60 * 1000),
          duration: 60,
          location: 'Meeting Room A',
          status: 'SCHEDULED',
          hasFeedback: false,
        },
        {
          id: '2',
          position: 'Full Stack Engineer',
          candidateName: 'Bob Smith',
          scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          duration: 45,
          location: 'Virtual - Zoom',
          status: 'SCHEDULED',
          hasFeedback: false,
        },
        {
          id: '3',
          position: 'UI/UX Designer',
          candidateName: 'Carol White',
          scheduledDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
          duration: 60,
          status: 'COMPLETED',
          hasFeedback: false,
        },
      ];

      // Filter based on selected filter type
      let filtered = mockInterviews;
      if (this.filterType === 'upcoming') {
        filtered = mockInterviews.filter((i) => i.status === 'SCHEDULED');
      } else if (this.filterType === 'pending') {
        filtered = mockInterviews.filter((i) => i.status === 'COMPLETED' && !i.hasFeedback);
      } else if (this.filterType === 'completed') {
        filtered = mockInterviews.filter((i) => i.status === 'COMPLETED');
      }

      this.assignedInterviews.set(filtered);
      this.isLoadingInterviews.set(false);
    }, 1000);
  }

  private loadRecentFeedback(): void {
    // TODO: Implement API call to fetch recent feedback
    // GET /api/v1/interviewers/{interviewerId}/feedback/recent
    this.recentFeedback.set([
      {
        id: '1',
        candidateName: 'David Miller',
        position: 'Backend Developer',
        rating: 4,
        summary: 'Strong technical skills, good communication, recommended for next round.',
        submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        id: '2',
        candidateName: 'Emma Davis',
        position: 'Frontend Developer',
        rating: 5,
        summary: 'Excellent problem-solving skills, highly recommended.',
        submittedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      },
    ]);
  }

  onFilterChange(): void {
    this.refreshAssignedInterviews();
  }

  viewInterview(interviewId: string): void {
    this.router.navigate(['/interviews', interviewId]);
  }

  startInterview(interviewId: string): void {
    // TODO: Implement start interview logic
    // PATCH /api/v1/interviews/{interviewId}/start
    this.notificationStore.success('Interview started', 'Success');
    this.refreshAssignedInterviews();
  }

  submitFeedback(interviewId: string): void {
    this.router.navigate(['/interviews', interviewId, 'feedback']);
  }

  viewAllInterviews(): void {
    this.router.navigate(['/interviews']);
  }

  viewSchedule(): void {
    // TODO: Navigate to schedule view
    this.notificationStore.info('Schedule view coming soon', 'Feature');
  }

  viewProfile(): void {
    this.router.navigate(['/profile']);
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
