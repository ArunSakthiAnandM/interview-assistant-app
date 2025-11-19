import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime } from 'rxjs/operators';
import { InterviewService } from '../../../services/interview/interview.service';
import { AuthService } from '../../../services/auth/auth.service';
import { NotificationStore } from '../../../stores/notification/notification.store';
import { Interview, InterviewStatus } from '../../../models/interview.model';
import { UserRole } from '../../../models/user.model';
import { ROUTES } from '../../../constants/routes';

/**
 * Interview List Component
 *
 * Displays paginated list of interviews with role-based filtering.
 * Different views for Recruiter (all org interviews), Interviewer (assigned), Candidate (applications).
 */
@Component({
  selector: 'app-interview-list',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: './interview-list.html',
  styleUrl: './interview-list.scss',
})
export class InterviewListComponent implements OnInit {
  private router = inject(Router);
  private interviewService = inject(InterviewService);
  private authService = inject(AuthService);
  private notificationStore = inject(NotificationStore);

  protected searchControl = new FormControl('');
  protected statusControl = new FormControl('');

  protected interviews = signal<Interview[]>([]);
  protected isLoading = signal(false);
  protected totalItems = signal(0);
  protected pageSize = signal(10);
  protected pageIndex = signal(0);
  protected currentRole = signal<UserRole | null>(null);

  protected UserRole = UserRole;

  protected statuses = [
    { value: InterviewStatus.SCHEDULED, label: 'Scheduled' },
    { value: InterviewStatus.IN_PROGRESS, label: 'In Progress' },
    { value: InterviewStatus.COMPLETED, label: 'Completed' },
    { value: InterviewStatus.CANCELLED, label: 'Cancelled' },
    { value: InterviewStatus.RESCHEDULED, label: 'Rescheduled' },
  ];

  protected displayedColumns: string[] = [
    'position',
    'candidate',
    'rounds',
    'status',
    'createdAt',
    'actions',
  ];

  ngOnInit(): void {
    this.currentRole.set(this.authService.currentUser()?.role || null);
    this.loadInterviews();
    this.setupFilters();
  }

  private setupFilters(): void {
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.pageIndex.set(0);
      this.loadInterviews();
    });

    this.statusControl.valueChanges.subscribe(() => {
      this.pageIndex.set(0);
      this.loadInterviews();
    });
  }

  private async loadInterviews(): Promise<void> {
    this.isLoading.set(true);
    try {
      const searchTerm = this.searchControl.value || '';
      const status = this.statusControl.value || undefined;
      const role = this.currentRole();
      const currentUser = this.authService.currentUser();

      if (!currentUser) {
        this.notificationStore.error('User not authenticated');
        return;
      }

      let response;

      if (role === UserRole.RECRUITER) {
        response = await this.interviewService
          .getByRecruiter(
            currentUser.id,
            this.pageIndex(),
            this.pageSize(),
            status as InterviewStatus
          )
          .toPromise();
      } else if (role === UserRole.INTERVIEWER) {
        response = await this.interviewService
          .getByInterviewer(currentUser.id, this.pageIndex(), this.pageSize())
          .toPromise();
      } else if (role === UserRole.CANDIDATE) {
        response = await this.interviewService
          .getByCandidate(currentUser.id, this.pageIndex(), this.pageSize())
          .toPromise();
      } else {
        // Admin - get all interviews
        response = await this.interviewService
          .getAll(this.pageIndex(), this.pageSize(), status as InterviewStatus, searchTerm)
          .toPromise();
      }

      if (response) {
        this.interviews.set(response.content);
        this.totalItems.set(response.totalElements);
      }
    } catch (error) {
      this.notificationStore.error('Failed to load interviews');
    } finally {
      this.isLoading.set(false);
    }
  }

  protected onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadInterviews();
  }

  protected createInterview(): void {
    this.router.navigate([ROUTES.RECRUITER.INTERVIEWS, 'create']);
  }

  protected viewInterview(id: string): void {
    this.router.navigate([ROUTES.RECRUITER.INTERVIEWS, id]);
  }

  protected async cancelInterview(interview: Interview): Promise<void> {
    const confirmed = confirm(
      `Are you sure you want to cancel the interview for ${interview.jobPosition}?`
    );
    if (!confirmed) return;

    try {
      await this.interviewService.cancel(interview.id, 'Cancelled by recruiter').toPromise();
      this.notificationStore.success('Interview cancelled successfully');
      this.loadInterviews();
    } catch (error) {
      this.notificationStore.error('Failed to cancel interview');
    }
  }

  protected canCancelInterview(interview: Interview): boolean {
    const role = this.currentRole();
    return (
      role === UserRole.RECRUITER &&
      interview.overallStatus !== InterviewStatus.CANCELLED &&
      interview.overallStatus !== InterviewStatus.COMPLETED
    );
  }

  protected getTitle(): string {
    switch (this.currentRole()) {
      case UserRole.RECRUITER:
        return 'Manage Interviews';
      case UserRole.INTERVIEWER:
        return 'My Assigned Interviews';
      case UserRole.CANDIDATE:
        return 'My Interview Applications';
      default:
        return 'All Interviews';
    }
  }

  protected getSubtitle(): string {
    switch (this.currentRole()) {
      case UserRole.RECRUITER:
        return 'Create and manage interview processes';
      case UserRole.INTERVIEWER:
        return 'View and provide feedback for assigned rounds';
      case UserRole.CANDIDATE:
        return 'Track your interview progress';
      default:
        return 'System-wide interview overview';
    }
  }

  protected getEmptyMessage(): string {
    switch (this.currentRole()) {
      case UserRole.RECRUITER:
        return 'Start by creating your first interview process';
      case UserRole.INTERVIEWER:
        return 'You have no assigned interviews at the moment';
      case UserRole.CANDIDATE:
        return 'You have no interview applications yet';
      default:
        return 'No interviews in the system';
    }
  }

  protected getRoundsSummary(interview: Interview): string {
    if (!interview.rounds || interview.rounds.length === 0) {
      return '0 rounds';
    }
    const completed = interview.rounds.filter((r) => r.status === 'COMPLETED').length;
    return `${completed}/${interview.rounds.length} completed`;
  }

  protected getStatusLabel(status: InterviewStatus): string {
    const statusObj = this.statuses.find((s) => s.value === status);
    return statusObj ? statusObj.label : status.replace(/_/g, ' ');
  }

  protected formatDate(date: Date | string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
