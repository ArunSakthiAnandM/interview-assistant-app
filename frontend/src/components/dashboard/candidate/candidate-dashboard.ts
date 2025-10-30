import { Component, OnInit, signal, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthStore } from '../../../store/auth.store';
import { NotificationStore } from '../../../store/notification.store';

interface DashboardStats {
  totalApplications: number;
  upcomingInterviews: number;
  completedInterviews: number;
  offers: number;
}

interface UpcomingInterview {
  id: string;
  position: string;
  companyName: string;
  interviewerName: string;
  scheduledDate: Date;
  duration: number;
  location?: string;
  meetingLink?: string;
}

interface ApplicationStatus {
  pending: number;
  scheduled: number;
  selected: number;
  rejected: number;
}

interface ProfileChecks {
  basicInfo: boolean;
  education: boolean;
  skills: boolean;
  resume: boolean;
}

interface InterviewHistory {
  id: string;
  position: string;
  companyName: string;
  interviewDate: Date;
  outcome: string;
}

@Component({
  selector: 'app-candidate-dashboard',
  imports: [
    DatePipe,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './candidate-dashboard.html',
  styleUrl: './candidate-dashboard.scss',
})
export class CandidateDashboard implements OnInit {
  authStore = inject(AuthStore);
  private notificationStore = inject(NotificationStore);
  private router = inject(Router);

  stats: DashboardStats = {
    totalApplications: 0,
    upcomingInterviews: 0,
    completedInterviews: 0,
    offers: 0,
  };

  applicationStatus: ApplicationStatus = {
    pending: 0,
    scheduled: 0,
    selected: 0,
    rejected: 0,
  };

  checks: ProfileChecks = {
    basicInfo: false,
    education: false,
    skills: false,
    resume: false,
  };

  profileCompletion = 0;
  isLoadingInterviews = signal<boolean>(false);
  upcomingInterviews = signal<UpcomingInterview[]>([]);
  interviewHistory = signal<InterviewHistory[]>([]);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // TODO: Implement API call to fetch candidate dashboard statistics
    // GET /api/v1/candidates/{candidateId}/dashboard/stats
    this.stats = {
      totalApplications: 12,
      upcomingInterviews: 3,
      completedInterviews: 8,
      offers: 2,
    };

    this.applicationStatus = {
      pending: 4,
      scheduled: 3,
      selected: 2,
      rejected: 3,
    };

    // TODO: Fetch from API
    this.checks = {
      basicInfo: true,
      education: true,
      skills: true,
      resume: false,
    };

    this.calculateProfileCompletion();
    this.refreshInterviews();
    this.loadInterviewHistory();
  }

  private calculateProfileCompletion(): void {
    const completed = Object.values(this.checks).filter((check) => check).length;
    this.profileCompletion = Math.round((completed / Object.keys(this.checks).length) * 100);
  }

  refreshInterviews(): void {
    this.isLoadingInterviews.set(true);

    // TODO: Implement API call to fetch upcoming interviews
    // GET /api/v1/candidates/{candidateId}/interviews/upcoming
    setTimeout(() => {
      this.upcomingInterviews.set([
        {
          id: '1',
          position: 'Senior Frontend Developer',
          companyName: 'Tech Innovations Inc.',
          interviewerName: 'Sarah Johnson',
          scheduledDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
          duration: 60,
          location: 'Virtual',
          meetingLink: 'https://zoom.us/j/123456789',
        },
        {
          id: '2',
          position: 'Full Stack Engineer',
          companyName: 'DataCorp Technologies',
          interviewerName: 'Mike Wilson',
          scheduledDate: new Date(Date.now() + 28 * 60 * 60 * 1000),
          duration: 45,
          location: 'Office - Building A, Floor 5',
        },
        {
          id: '3',
          position: 'React Developer',
          companyName: 'Global Solutions Ltd.',
          interviewerName: 'Lisa Anderson',
          scheduledDate: new Date(Date.now() + 72 * 60 * 60 * 1000),
          duration: 90,
          meetingLink: 'https://meet.google.com/abc-defg-hij',
        },
      ]);
      this.isLoadingInterviews.set(false);
    }, 1000);
  }

  private loadInterviewHistory(): void {
    // TODO: Implement API call to fetch interview history
    // GET /api/v1/candidates/{candidateId}/interviews/history
    this.interviewHistory.set([
      {
        id: '1',
        position: 'Backend Developer',
        companyName: 'StartupXYZ',
        interviewDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        outcome: 'SELECTED',
      },
      {
        id: '2',
        position: 'DevOps Engineer',
        companyName: 'CloudTech Corp',
        interviewDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        outcome: 'REJECTED',
      },
      {
        id: '3',
        position: 'UI Developer',
        companyName: 'Design Studio',
        interviewDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        outcome: 'SELECTED',
      },
    ]);
  }

  updateProfile(): void {
    this.router.navigate(['/profile']);
  }

  viewInterviewDetails(interviewId: string): void {
    this.router.navigate(['/interviews', interviewId]);
  }

  isInterviewSoon(scheduledDate: Date): boolean {
    const now = new Date();
    const diff = scheduledDate.getTime() - now.getTime();
    const hoursDiff = diff / (1000 * 60 * 60);
    return hoursDiff <= 24 && hoursDiff >= -1;
  }

  joinInterview(interview: UpcomingInterview): void {
    if (interview.meetingLink) {
      window.open(interview.meetingLink, '_blank');
    } else {
      this.notificationStore.info('No meeting link available', 'Info');
    }
  }

  completeProfile(): void {
    this.router.navigate(['/profile']);
  }

  getOutcomeColor(outcome: string): string {
    const colors: Record<string, string> = {
      SELECTED: '#4caf50',
      SELECTED_NEXT_ROUND: '#2196f3',
      REJECTED: '#f44336',
      ON_HOLD: '#ff9800',
      PENDING: '#9e9e9e',
    };
    return colors[outcome] || '#757575';
  }

  getOutcomeIcon(outcome: string): string {
    const icons: Record<string, string> = {
      SELECTED: 'check_circle',
      SELECTED_NEXT_ROUND: 'arrow_forward',
      REJECTED: 'cancel',
      ON_HOLD: 'pause_circle',
      PENDING: 'schedule',
    };
    return icons[outcome] || 'help';
  }
}
