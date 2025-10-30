import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { AuthStore } from '../../store/auth.store';
import { InterviewStore } from '../../store/interview.store';
import { NotificationStore } from '../../store/notification.store';
import { InterviewStatus, InterviewType } from '../../models';

@Component({
  selector: 'app-interview-list',
  imports: [
    DatePipe,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  templateUrl: './interview-list.html',
  styleUrl: './interview-list.scss',
})
export class InterviewList implements OnInit {
  authStore = inject(AuthStore);
  interviewStore = inject(InterviewStore);
  private notificationStore = inject(NotificationStore);
  private router = inject(Router);

  searchTerm = '';
  selectedStatus: InterviewStatus[] = [];
  dateFrom: Date | null = null;
  dateTo: Date | null = null;
  viewMode: 'list' | 'grid' = 'list';
  isLoading = signal<boolean>(false);

  filteredInterviews = computed(() => this.interviewStore.filteredInterviews());

  ngOnInit(): void {
    this.loadInterviews();
  }

  private loadInterviews(): void {
    this.isLoading.set(true);

    // TODO: Implement API call to fetch interviews based on user role
    // GET /api/v1/interviews (for org admin/admin)
    // GET /api/v1/interviewers/{interviewerId}/interviews (for interviewer)
    // GET /api/v1/candidates/{candidateId}/interviews (for candidate)

    // Mock data for demonstration
    setTimeout(() => {
      const mockInterviews = [
        {
          id: '1',
          title: 'Senior Frontend Developer Interview',
          description: 'Technical interview for senior frontend position',
          organisationId: 'org1',
          candidateId: 'cand1',
          interviewerIds: ['int1'],
          scheduledDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
          duration: 60,
          type: InterviewType.TECHNICAL,
          round: 1,
          location: 'Meeting Room A',
          status: InterviewStatus.SCHEDULED,
          notes: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          title: 'Backend Engineer Interview',
          description: 'Technical screening for backend role',
          organisationId: 'org1',
          candidateId: 'cand2',
          interviewerIds: ['int2'],
          scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          duration: 45,
          type: InterviewType.TECHNICAL,
          round: 1,
          location: 'Virtual - Zoom',
          status: InterviewStatus.SCHEDULED,
          notes: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '3',
          title: 'Full Stack Developer Interview',
          description: 'Final round interview',
          organisationId: 'org1',
          candidateId: 'cand3',
          interviewerIds: ['int1'],
          scheduledDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          duration: 90,
          type: InterviewType.TECHNICAL,
          round: 2,
          location: 'Office',
          status: InterviewStatus.COMPLETED,
          notes: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      this.interviewStore.setInterviews(mockInterviews);
      this.isLoading.set(false);
    }, 1000);
  }

  applyFilters(): void {
    this.interviewStore.updateFilters({
      status: this.selectedStatus.length > 0 ? this.selectedStatus : undefined,
      dateFrom: this.dateFrom || undefined,
      dateTo: this.dateTo || undefined,
      searchTerm: this.searchTerm || undefined,
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = [];
    this.dateFrom = null;
    this.dateTo = null;
    this.interviewStore.clearFilters();
  }

  createInterview(): void {
    this.router.navigate(['/interviews/create']);
  }

  viewInterview(interviewId: string): void {
    this.router.navigate(['/interviews', interviewId]);
  }

  startInterview(interviewId: string): void {
    // TODO: Implement start interview API call
    // PATCH /api/v1/interviews/{interviewId}/start
    this.notificationStore.success('Interview started', 'Success');
    this.loadInterviews();
  }

  submitFeedback(interviewId: string): void {
    this.router.navigate(['/interviews', interviewId, 'feedback']);
  }

  editInterview(interviewId: string): void {
    // TODO: Navigate to edit interview page
    this.notificationStore.info('Edit interview feature coming soon', 'Feature');
  }

  cancelInterview(interviewId: string): void {
    // TODO: Implement cancel interview with reason dialog
    // PATCH /api/v1/interviews/{interviewId}/cancel
    this.notificationStore.warning('Interview cancelled', 'Cancelled');
    this.loadInterviews();
  }

  getStatusColor(status: InterviewStatus): string {
    const colors: Record<InterviewStatus, string> = {
      [InterviewStatus.SCHEDULED]: '#2196f3',
      [InterviewStatus.IN_PROGRESS]: '#ff9800',
      [InterviewStatus.COMPLETED]: '#4caf50',
      [InterviewStatus.CANCELLED]: '#f44336',
      [InterviewStatus.NO_SHOW]: '#9e9e9e',
    };
    return colors[status] || '#757575';
  }
}
