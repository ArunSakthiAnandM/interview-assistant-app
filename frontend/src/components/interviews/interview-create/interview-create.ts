import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { InterviewService } from '../../../services/interview/interview.service';
import { UserService } from '../../../services/user/user.service';
import { NotificationStore } from '../../../stores/notification/notification.store';
import { InterviewType } from '../../../models/interview.model';
import { User, UserRole } from '../../../models/user.model';
import { ROUTES } from '../../../constants/routes';

/**
 * Interview Create Component
 *
 * Multi-step form for creating interviews with progressive rounds.
 * Steps: Job Details → Schedule Rounds → Review & Submit
 */
@Component({
  selector: 'app-interview-create',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
  ],
  templateUrl: './interview-create.html',
  styleUrl: './interview-create.scss',
})
export class InterviewCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private interviewService = inject(InterviewService);
  private userService = inject(UserService);
  private notificationStore = inject(NotificationStore);

  protected jobDetailsForm!: FormGroup;
  protected roundsForm!: FormGroup;
  protected isSubmitting = signal(false);
  protected isLoadingInterviewers = signal(false);
  protected availableInterviewers = signal<User[]>([]);

  protected interviewTypes = [
    { value: InterviewType.TECHNICAL, label: 'Technical' },
    { value: InterviewType.HR, label: 'HR' },
    { value: InterviewType.CULTURAL_FIT, label: 'Cultural Fit' },
    { value: InterviewType.MANAGERIAL, label: 'Managerial' },
  ];

  get rounds(): FormArray {
    return this.roundsForm.get('rounds') as FormArray;
  }

  ngOnInit(): void {
    this.initializeForms();
    this.loadInterviewers();
  }

  private initializeForms(): void {
    this.jobDetailsForm = this.fb.group({
      jobPosition: ['', Validators.required],
      jobDescription: [''],
      candidateEmail: ['', [Validators.required, Validators.email]],
    });

    this.roundsForm = this.fb.group({
      rounds: this.fb.array([this.createRoundGroup(1)]),
    });
  }

  private createRoundGroup(roundNumber: number): FormGroup {
    return this.fb.group({
      roundNumber: [roundNumber],
      type: ['', Validators.required],
      scheduledDate: ['', Validators.required],
      durationMinutes: [60, [Validators.required, Validators.min(15), Validators.max(480)]],
      interviewerIds: [[], Validators.required],
    });
  }

  private async loadInterviewers(): Promise<void> {
    this.isLoadingInterviewers.set(true);
    try {
      const response = await this.userService.getByRole(UserRole.INTERVIEWER, 0, 100).toPromise();
      if (response) {
        this.availableInterviewers.set(response.content);
      }
    } catch (error) {
      this.notificationStore.error('Failed to load interviewers');
    } finally {
      this.isLoadingInterviewers.set(false);
    }
  }

  protected addRound(): void {
    const newRoundNumber = this.rounds.length + 1;
    this.rounds.push(this.createRoundGroup(newRoundNumber));
  }

  protected removeRound(index: number): void {
    if (this.rounds.length > 1) {
      this.rounds.removeAt(index);
      // Update round numbers
      this.rounds.controls.forEach((control, i) => {
        control.get('roundNumber')?.setValue(i + 1);
      });
    }
  }

  protected async submitInterview(): Promise<void> {
    if (!this.jobDetailsForm.valid || !this.roundsForm.valid || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    try {
      const jobDetails = this.jobDetailsForm.value;
      const rounds = this.roundsForm.value.rounds.map((round: any) => ({
        roundNumber: round.roundNumber,
        type: round.type,
        scheduledDate: new Date(round.scheduledDate).toISOString(),
        durationMinutes: round.durationMinutes,
        interviewerIds: round.interviewerIds,
      }));

      const interview = await this.interviewService
        .create({
          jobPosition: jobDetails.jobPosition,
          jobDescription: jobDetails.jobDescription || undefined,
          candidateEmail: jobDetails.candidateEmail,
          rounds,
        })
        .toPromise();

      if (interview) {
        this.notificationStore.success('Interview created successfully');
        this.router.navigate([ROUTES.RECRUITER.INTERVIEWS]);
      }
    } catch (error: any) {
      this.notificationStore.error(error.error?.message || 'Failed to create interview');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  protected getRoundTypeLabel(type: InterviewType): string {
    const typeObj = this.interviewTypes.find((t) => t.value === type);
    return typeObj ? typeObj.label : type;
  }

  protected getInterviewerNames(ids: string[]): string[] {
    if (!ids || ids.length === 0) return [];
    return ids.map((id) => {
      const interviewer = this.availableInterviewers().find((i) => i.id === id);
      return interviewer ? interviewer.name : id;
    });
  }

  protected formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
