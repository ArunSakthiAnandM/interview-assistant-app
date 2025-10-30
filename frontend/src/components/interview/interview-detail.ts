import { Component, OnInit, signal, inject } from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthStore } from '../../store/auth.store';
import { InterviewService } from '../../services/interview.service';
import { NotificationStore } from '../../store/notification.store';
import { Interview, InterviewStatus } from '../../models';

@Component({
  selector: 'app-interview-detail',
  imports: [
    DatePipe,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './interview-detail.html',
  styleUrl: './interview-detail.scss',
})
export class InterviewDetail implements OnInit {
  authStore = inject(AuthStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private interviewService = inject(InterviewService);
  private notificationStore = inject(NotificationStore);

  interview = signal<Interview | null>(null);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadInterview(id);
  }

  private loadInterview(id: string): void {
    this.interviewService.getInterview(id).subscribe({
      next: (response) => {
        if (response.data) {
          this.interview.set(response.data);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.notificationStore.error('Failed to load interview', 'Error');
      },
    });
  }

  goBack(): void {
    this.location.back();
  }

  startInterview(): void {
    this.notificationStore.success('Interview started', 'Success');
  }

  submitFeedback(): void {
    const interviewId = this.interview()?.id;
    if (interviewId) {
      this.router.navigate(['/interviews', interviewId, 'feedback']);
    }
  }

  editInterview(): void {
    this.notificationStore.info('Edit feature coming soon', 'Feature');
  }

  cancelInterview(): void {
    this.notificationStore.warning('Interview cancelled', 'Cancelled');
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
