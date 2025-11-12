import { Component, OnInit, signal, inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InterviewService } from '../../services/interview.service';
import { AuthStore } from '../../store/auth.store';
import { NotificationStore } from '../../store/notification.store';

@Component({
  selector: 'app-interview-feedback',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './interview-feedback.html',
  styleUrl: './interview-feedback.scss',
})
export class InterviewFeedback implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private interviewService = inject(InterviewService);
  private authStore = inject(AuthStore);
  private notificationStore = inject(NotificationStore);

  feedbackForm!: FormGroup;
  interviewId: string = '';
  isSubmitting = signal<boolean>(false);

  ngOnInit(): void {
    this.interviewId = this.route.snapshot.params['id'];
    this.initializeForm();
  }

  private initializeForm(): void {
    this.feedbackForm = this.fb.group({
      rating: ['', [Validators.required]],
      comments: [''],
      strengths: [''],
      weaknesses: [''],
      outcome: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.feedbackForm.invalid) {
      this.notificationStore.error('Please fill all required fields', 'Validation Error');
      return;
    }

    this.isSubmitting.set(true);

    const feedback = {
      interviewId: this.interviewId,
      interviewerId: this.authStore.currentUser()?.id || '',
      ...this.feedbackForm.value,
      strengths: this.feedbackForm.value.strengths
        ? this.feedbackForm.value.strengths.split('\n')
        : [],
      weaknesses: this.feedbackForm.value.weaknesses
        ? this.feedbackForm.value.weaknesses.split('\n')
        : [],
      submittedAt: new Date(),
    };

    this.interviewService.submitFeedback(feedback).subscribe({
      next: () => {
        this.notificationStore.success('Feedback submitted successfully', 'Success');
        this.router.navigate(['/interviews', this.interviewId]);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.notificationStore.error('Failed to submit feedback', 'Error');
      },
    });
  }

  goBack(): void {
    this.location.back();
  }
}
