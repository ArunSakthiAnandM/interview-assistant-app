import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InterviewService } from '../../services/interview.service';
import { NotificationStore } from '../../store/notification.store';
import { InterviewCreateRequest } from '../../models';

interface InterviewerOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-interview-create',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatCardModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './interview-create.html',
  styleUrl: './interview-create.scss',
})
export class InterviewCreate implements OnInit {
  private fb = inject(FormBuilder);
  private interviewService = inject(InterviewService);
  private notificationStore = inject(NotificationStore);
  private router = inject(Router);

  interviewForm!: FormGroup;
  basicDetailsGroup!: FormGroup;
  scheduleGroup!: FormGroup;
  participantsGroup!: FormGroup;

  isSubmitting = signal<boolean>(false);
  availableInterviewers = signal<InterviewerOption[]>([]);

  ngOnInit(): void {
    this.initializeForm();
    this.loadInterviewers();
  }

  private initializeForm(): void {
    this.basicDetailsGroup = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      type: ['', [Validators.required]],
      round: [1, [Validators.required, Validators.min(1)]],
    });

    this.scheduleGroup = this.fb.group({
      scheduledDate: ['', [Validators.required]],
      duration: [60, [Validators.required, Validators.min(15)]],
      location: [''],
    });

    this.participantsGroup = this.fb.group({
      candidateEmail: ['', [Validators.email]],
      interviewerIds: [[], [Validators.required]],
    });

    this.interviewForm = this.fb.group({
      basicDetails: this.basicDetailsGroup,
      schedule: this.scheduleGroup,
      participants: this.participantsGroup,
    });
  }

  private loadInterviewers(): void {
    // TODO: Implement API call to fetch available interviewers
    // GET /api/v1/organisations/{orgId}/interviewers
    this.availableInterviewers.set([
      { id: 'int1', name: 'Sarah Johnson' },
      { id: 'int2', name: 'Mike Wilson' },
      { id: 'int3', name: 'Lisa Anderson' },
    ]);
  }

  onSubmit(): void {
    if (this.interviewForm.invalid) {
      this.notificationStore.error('Please fill all required fields', 'Validation Error');
      return;
    }

    this.isSubmitting.set(true);

    const request: InterviewCreateRequest = {
      ...this.basicDetailsGroup.value,
      ...this.scheduleGroup.value,
      ...this.participantsGroup.value,
    };

    this.interviewService.createInterview(request).subscribe({
      next: (interview) => {
        this.notificationStore.success('Interview created successfully', 'Success');
        this.router.navigate(['/interviews', interview.id]);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.notificationStore.error('Failed to create interview', 'Error');
      },
    });
  }
}
