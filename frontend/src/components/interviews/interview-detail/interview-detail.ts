import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { InterviewService } from '../../../services/interview/interview.service';
import { AuthService } from '../../../services/auth/auth.service';
import { NotificationStore } from '../../../stores/notification/notification.store';
import {
  Interview,
  InterviewRound,
  InterviewStatus,
  InterviewType,
  RoundStatus,
  RoundDecision,
  FeedbackRecommendation,
  Feedback,
} from '../../../models/interview.model';
import { UserRole } from '../../../models/user.model';

/**
 * Interview Detail Component
 *
 * Displays comprehensive interview details with tabbed interface.
 * Supports feedback submission for interviewers and decision making for recruiters.
 */
@Component({
  selector: 'app-interview-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatDividerModule,
    MatTooltipModule,
    MatExpansionModule,
  ],
  templateUrl: './interview-detail.html',
  styleUrl: './interview-detail.scss',
})
export class InterviewDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private interviewService = inject(InterviewService);
  private authService = inject(AuthService);
  private notificationStore = inject(NotificationStore);

  protected interview = signal<Interview | null>(null);
  protected isLoading = signal(false);
  protected isSubmittingFeedback = signal(false);
  protected feedbackForms = new Map<string, FormGroup>();
  protected strengthsArrays = new Map<string, string[]>();
  protected improvementsArrays = new Map<string, string[]>();

  protected RoundDecision = RoundDecision;

  protected recommendations = [
    { value: FeedbackRecommendation.STRONG_HIRE, label: 'Strong Hire' },
    { value: FeedbackRecommendation.HIRE, label: 'Hire' },
    { value: FeedbackRecommendation.HOLD, label: 'Hold' },
    { value: FeedbackRecommendation.NO_HIRE, label: 'No Hire' },
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadInterview(id);
    }
  }

  private async loadInterview(id: string): Promise<void> {
    this.isLoading.set(true);
    try {
      const interview = await this.interviewService.getById(id).toPromise();
      if (interview) {
        this.interview.set(interview);
        this.initializeFeedbackForms(interview);
      }
    } catch (error) {
      this.notificationStore.error('Failed to load interview details');
    } finally {
      this.isLoading.set(false);
    }
  }

  private initializeFeedbackForms(interview: Interview): void {
    interview.rounds.forEach((round) => {
      if (this.canSubmitFeedback(round)) {
        const form = this.fb.group({
          recommendation: ['', Validators.required],
          rating: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
          comments: ['', Validators.required],
        });
        this.feedbackForms.set(round.roundId, form);
        this.strengthsArrays.set(round.roundId, []);
        this.improvementsArrays.set(round.roundId, []);
      }
    });
  }

  protected canSubmitFeedback(round: InterviewRound): boolean {
    const currentUser = this.authService.currentUser();
    if (!currentUser || currentUser.role !== UserRole.INTERVIEWER) return false;

    const isAssigned = round.interviewerIds.includes(currentUser.id);
    const alreadySubmitted = round.feedback?.some((f) => f.interviewerId === currentUser.id);

    return isAssigned && !alreadySubmitted && round.status !== RoundStatus.CANCELLED;
  }

  protected canMakeDecision(round: InterviewRound): boolean {
    const currentUser = this.authService.currentUser();
    if (!currentUser || currentUser.role !== UserRole.RECRUITER) return false;

    const hasFeedback = round.feedback && round.feedback.length > 0;
    const noDecisionMade = !round.recruiterDecision;

    return hasFeedback && noDecisionMade && round.status !== RoundStatus.CANCELLED;
  }

  protected canCancelInterview(): boolean {
    const currentUser = this.authService.currentUser();
    const interview = this.interview();
    if (!currentUser || !interview || currentUser.role !== UserRole.RECRUITER) return false;

    return (
      interview.overallStatus !== InterviewStatus.CANCELLED &&
      interview.overallStatus !== InterviewStatus.COMPLETED
    );
  }

  protected getFeedbackForm(roundId: string): FormGroup | undefined {
    return this.feedbackForms.get(roundId);
  }

  protected getStrengths(roundId: string): string[] {
    return this.strengthsArrays.get(roundId) || [];
  }

  protected getImprovements(roundId: string): string[] {
    return this.improvementsArrays.get(roundId) || [];
  }

  protected addStrength(roundId: string, value: string): void {
    if (value.trim()) {
      const strengths = this.strengthsArrays.get(roundId) || [];
      strengths.push(value.trim());
      this.strengthsArrays.set(roundId, strengths);
    }
  }

  protected removeStrength(roundId: string, index: number): void {
    const strengths = this.strengthsArrays.get(roundId) || [];
    strengths.splice(index, 1);
    this.strengthsArrays.set(roundId, strengths);
  }

  protected addImprovement(roundId: string, value: string): void {
    if (value.trim()) {
      const improvements = this.improvementsArrays.get(roundId) || [];
      improvements.push(value.trim());
      this.improvementsArrays.set(roundId, improvements);
    }
  }

  protected removeImprovement(roundId: string, index: number): void {
    const improvements = this.improvementsArrays.get(roundId) || [];
    improvements.splice(index, 1);
    this.improvementsArrays.set(roundId, improvements);
  }

  protected async submitFeedback(roundId: string): Promise<void> {
    const form = this.feedbackForms.get(roundId);
    if (!form || !form.valid || !this.interview()) return;

    this.isSubmittingFeedback.set(true);
    try {
      const formValue = form.value;
      const feedbackDto = {
        recommendation: formValue.recommendation,
        rating: formValue.rating,
        comments: formValue.comments,
        strengths: this.strengthsArrays.get(roundId),
        improvements: this.improvementsArrays.get(roundId),
      };

      await this.interviewService
        .submitFeedback(this.interview()!.id, roundId, feedbackDto)
        .toPromise();

      this.notificationStore.success('Feedback submitted successfully');
      this.loadInterview(this.interview()!.id);
    } catch (error) {
      this.notificationStore.error('Failed to submit feedback');
    } finally {
      this.isSubmittingFeedback.set(false);
    }
  }

  protected async makeDecision(roundId: string, decision: RoundDecision): Promise<void> {
    if (!this.interview()) return;

    const confirmed = confirm(
      `Are you sure you want to make this decision: ${this.getDecisionLabel(decision)}?`
    );
    if (!confirmed) return;

    try {
      await this.interviewService
        .submitDecision(this.interview()!.id, roundId, { decision })
        .toPromise();

      this.notificationStore.success('Decision recorded successfully');
      this.loadInterview(this.interview()!.id);
    } catch (error) {
      this.notificationStore.error('Failed to record decision');
    }
  }

  protected async cancelInterview(): Promise<void> {
    if (!this.interview()) return;

    const reason = prompt('Please provide a reason for cancellation:');
    if (!reason) return;

    try {
      await this.interviewService.cancel(this.interview()!.id, reason).toPromise();
      this.notificationStore.success('Interview cancelled successfully');
      this.loadInterview(this.interview()!.id);
    } catch (error) {
      this.notificationStore.error('Failed to cancel interview');
    }
  }

  protected goBack(): void {
    this.router.navigate(['/interviews']);
  }

  protected getStatusLabel(status: InterviewStatus): string {
    return status.replace(/_/g, ' ');
  }

  protected getCandidateStatusLabel(status: string): string {
    return status.replace(/_/g, ' ');
  }

  protected getRoundTypeLabel(type: InterviewType): string {
    const labels = {
      [InterviewType.TECHNICAL]: 'Technical',
      [InterviewType.HR]: 'HR',
      [InterviewType.CULTURAL_FIT]: 'Cultural Fit',
      [InterviewType.MANAGERIAL]: 'Managerial',
    };
    return labels[type] || type;
  }

  protected getRecommendationLabel(rec: FeedbackRecommendation): string {
    const labels = {
      [FeedbackRecommendation.STRONG_HIRE]: 'Strong Hire',
      [FeedbackRecommendation.HIRE]: 'Hire',
      [FeedbackRecommendation.HOLD]: 'Hold',
      [FeedbackRecommendation.NO_HIRE]: 'No Hire',
    };
    return labels[rec] || rec;
  }

  protected getDecisionLabel(decision: RoundDecision): string {
    const labels = {
      [RoundDecision.SELECT_FOR_NEXT_ROUND]: 'Select for Next Round',
      [RoundDecision.SELECTED]: 'Selected (Final)',
      [RoundDecision.REJECTED]: 'Rejected',
    };
    return labels[decision] || decision;
  }

  protected formatDate(date: Date | string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
