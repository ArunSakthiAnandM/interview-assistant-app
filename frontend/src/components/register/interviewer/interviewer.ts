import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { InterviewerService } from '../../../services/interviewer.service';
import { NotificationStore } from '../../../store/notification.store';
import { InterviewerRegistrationRequest } from '../../../models';
import {
  VALIDATION_PATTERNS,
  VALIDATION_MESSAGES,
  APP_ROUTES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from '../../../constants';

@Component({
  selector: 'app-interviewer',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatChipsModule,
    MatCheckboxModule,
  ],
  templateUrl: './interviewer.html',
  styleUrl: './interviewer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Interviewer {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private interviewerService = inject(InterviewerService);
  private notificationStore = inject(NotificationStore);

  // Signals for reactive state
  isLoading = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  expertiseList = signal<string[]>([]);
  currentExpertise = signal('');

  // Computed values
  canSubmit = computed(() => this.registrationForm.valid && this.expertiseList().length > 0);

  // Form group
  registrationForm: FormGroup;

  // Validation patterns and messages
  readonly validationPatterns = VALIDATION_PATTERNS;
  readonly validationMessages = VALIDATION_MESSAGES;

  // Department options
  readonly departments = [
    'Engineering',
    'Product Management',
    'Data Science',
    'Design',
    'Human Resources',
    'Sales',
    'Marketing',
    'Operations',
    'Finance',
    'Legal',
    'Other',
  ];

  constructor() {
    this.registrationForm = this.fb.group(
      {
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
            Validators.pattern(VALIDATION_PATTERNS.NAME),
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
            Validators.pattern(VALIDATION_PATTERNS.NAME),
          ],
        ],
        email: [
          '',
          [Validators.required, Validators.email, Validators.pattern(VALIDATION_PATTERNS.EMAIL)],
        ],
        mobile: ['', [Validators.pattern(VALIDATION_PATTERNS.MOBILE_INTERNATIONAL)]],
        organisationId: ['', [Validators.required]],
        department: ['', [Validators.required]],
        designation: [
          '',
          [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(VALIDATION_PATTERNS.PASSWORD),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
        agreeToTerms: [false, [Validators.requiredTrue]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  /**
   * Custom validator to check if passwords match
   */
  private passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.showPassword.update((show) => !show);
  }

  /**
   * Toggle confirm password visibility
   */
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((show) => !show);
  }

  /**
   * Add expertise to list
   */
  addExpertise(): void {
    const expertise = this.currentExpertise().trim();
    if (expertise && !this.expertiseList().includes(expertise)) {
      this.expertiseList.update((list) => [...list, expertise]);
      this.currentExpertise.set('');
    }
  }

  /**
   * Remove expertise from list
   */
  removeExpertise(expertise: string): void {
    this.expertiseList.update((list) => list.filter((e) => e !== expertise));
  }

  /**
   * Handle expertise input keydown
   */
  onExpertiseKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addExpertise();
    }
  }

  /**
   * Submit registration
   */
  submitRegistration(): void {
    if (!this.canSubmit()) {
      this.markFormGroupTouched(this.registrationForm);
      this.notificationStore.error(ERROR_MESSAGES.VALIDATION_ERROR);
      return;
    }

    this.isLoading.set(true);

    const formValue = this.registrationForm.value;
    const registrationRequest: InterviewerRegistrationRequest = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      organisationId: formValue.organisationId,
      department: formValue.department,
      designation: formValue.designation,
      mobile: formValue.mobile || undefined,
      expertise: this.expertiseList(),
      password: formValue.password,
    };

    this.interviewerService.registerInterviewer(registrationRequest).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.notificationStore.success(SUCCESS_MESSAGES.REGISTRATION_SUCCESS);
          // Navigate to login page
          this.router.navigate([APP_ROUTES.LOGIN], {
            queryParams: { registered: 'true', role: 'interviewer' },
          });
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.notificationStore.error(error.message || ERROR_MESSAGES.REGISTRATION_FAILED);
      },
    });
  }

  /**
   * Navigate to login page
   */
  navigateToLogin(): void {
    this.router.navigate([APP_ROUTES.LOGIN]);
  }

  /**
   * Mark all fields in form group as touched
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Get error message for a form field
   */
  getErrorMessage(fieldName: string): string {
    const control = this.registrationForm.get(fieldName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.errors['required']) {
      return VALIDATION_MESSAGES.REQUIRED;
    }

    if (fieldName === 'email' && control.errors['email']) {
      return VALIDATION_MESSAGES.EMAIL_INVALID;
    }

    if (fieldName === 'mobile' && control.errors['pattern']) {
      return VALIDATION_MESSAGES.MOBILE_INVALID;
    }

    if (fieldName === 'password' && control.errors['pattern']) {
      return VALIDATION_MESSAGES.PASSWORD_WEAK;
    }

    if (fieldName === 'firstName' || fieldName === 'lastName' || fieldName === 'designation') {
      if (control.errors['pattern']) {
        return VALIDATION_MESSAGES.NAME_INVALID;
      }
      if (control.errors['minlength']) {
        return VALIDATION_MESSAGES.MIN_LENGTH(2);
      }
      if (control.errors['maxlength']) {
        return VALIDATION_MESSAGES.MAX_LENGTH(fieldName === 'designation' ? 100 : 50);
      }
    }

    if (fieldName === 'confirmPassword' && this.registrationForm.errors?.['passwordMismatch']) {
      return 'Passwords do not match';
    }

    return '';
  }
}
