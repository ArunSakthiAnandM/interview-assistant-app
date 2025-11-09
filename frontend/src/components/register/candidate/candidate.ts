import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OtpInputComponent } from '../../shared/otp-input/otp-input';
import { CandidateService } from '../../../services/candidate.service';
import { OtpService } from '../../../services/otp.service';
import { NotificationStore } from '../../../store/notification.store';
import {
  CandidateRegistrationRequest,
  OTPType,
  OTPVerificationRequest,
  OTPSendRequest,
} from '../../../models';
import {
  VALIDATION_PATTERNS,
  VALIDATION_MESSAGES,
  APP_ROUTES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from '../../../constants';

@Component({
  selector: 'app-candidate',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatCheckboxModule,
    OtpInputComponent,
  ],
  templateUrl: './candidate.html',
  styleUrl: './candidate.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Candidate {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private candidateService = inject(CandidateService);
  private otpService = inject(OtpService);
  private notificationStore = inject(NotificationStore);

  // Signals for reactive state
  isLoading = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  currentStep = signal(0);
  emailVerified = signal(false);
  mobileVerified = signal(false);
  emailOtp = signal('');
  mobileOtp = signal('');

  // Computed values
  canProceedToVerification = computed(() => this.registrationForm.valid);
  canSubmit = computed(() => this.emailVerified() && this.mobileVerified());

  // OTP service state
  otpLoading = this.otpService.isLoading;
  canResendEmail = this.otpService.canResend;
  canResendMobile = this.otpService.canResend;
  remainingTime = this.otpService.remainingTime;

  // Form groups
  registrationForm: FormGroup;

  // Validation patterns and messages
  readonly validationPatterns = VALIDATION_PATTERNS;
  readonly validationMessages = VALIDATION_MESSAGES;

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
        mobile: [
          '',
          [Validators.required, Validators.pattern(VALIDATION_PATTERNS.MOBILE_INTERNATIONAL)],
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
   * Proceed to OTP verification step
   */
  proceedToVerification(): void {
    if (this.registrationForm.valid) {
      this.currentStep.set(1);
      this.sendEmailOTP();
      this.sendMobileOTP();
    } else {
      this.markFormGroupTouched(this.registrationForm);
      this.notificationStore.error(ERROR_MESSAGES.VALIDATION_ERROR);
    }
  }

  /**
   * Send OTP to email
   */
  sendEmailOTP(): void {
    const email = this.registrationForm.get('email')?.value;
    const request: OTPSendRequest = {
      identifier: email,
      type: OTPType.EMAIL,
    };

    this.otpService.sendOTP(request).subscribe({
      next: () => {
        this.notificationStore.success('OTP sent to your email');
      },
      error: (error) => {
        this.notificationStore.error(error.message || ERROR_MESSAGES.SERVER_ERROR);
      },
    });
  }

  /**
   * Send OTP to mobile
   */
  sendMobileOTP(): void {
    const mobile = this.registrationForm.get('mobile')?.value;
    const request: OTPSendRequest = {
      identifier: mobile,
      type: OTPType.MOBILE,
    };

    this.otpService.sendOTP(request).subscribe({
      next: () => {
        this.notificationStore.success('OTP sent to your mobile');
      },
      error: (error) => {
        this.notificationStore.error(error.message || ERROR_MESSAGES.SERVER_ERROR);
      },
    });
  }

  /**
   * Handle email OTP change
   */
  onEmailOtpChange(otp: string): void {
    this.emailOtp.set(otp);
  }

  /**
   * Handle email OTP complete
   */
  onEmailOtpComplete(otp: string): void {
    this.verifyEmailOTP(otp);
  }

  /**
   * Verify email OTP
   */
  verifyEmailOTP(otp: string): void {
    const email = this.registrationForm.get('email')?.value;
    const request: OTPVerificationRequest = {
      identifier: email,
      otp: otp,
      verificationType: OTPType.EMAIL,
    };

    this.otpService.verifyOTP(request).subscribe({
      next: (verificationResponse) => {
        if (verificationResponse.verified) {
          this.emailVerified.set(true);
          this.notificationStore.success('Email verified successfully');
        } else {
          this.notificationStore.error(verificationResponse.message || ERROR_MESSAGES.OTP_INVALID);
        }
      },
      error: (error) => {
        this.notificationStore.error(error.message || ERROR_MESSAGES.OTP_INVALID);
      },
    });
  }

  /**
   * Handle mobile OTP change
   */
  onMobileOtpChange(otp: string): void {
    this.mobileOtp.set(otp);
  }

  /**
   * Handle mobile OTP complete
   */
  onMobileOtpComplete(otp: string): void {
    this.verifyMobileOTP(otp);
  }

  /**
   * Verify mobile OTP
   */
  verifyMobileOTP(otp: string): void {
    const mobile = this.registrationForm.get('mobile')?.value;
    const request: OTPVerificationRequest = {
      identifier: mobile,
      otp: otp,
      verificationType: OTPType.MOBILE,
    };

    this.otpService.verifyOTP(request).subscribe({
      next: (verificationResponse) => {
        if (verificationResponse.verified) {
          this.mobileVerified.set(true);
          this.notificationStore.success('Mobile verified successfully');
        } else {
          this.notificationStore.error(verificationResponse.message || ERROR_MESSAGES.OTP_INVALID);
        }
      },
      error: (error) => {
        this.notificationStore.error(error.message || ERROR_MESSAGES.OTP_INVALID);
      },
    });
  }

  /**
   * Resend email OTP
   */
  resendEmailOTP(): void {
    this.sendEmailOTP();
  }

  /**
   * Resend mobile OTP
   */
  resendMobileOTP(): void {
    this.sendMobileOTP();
  }

  /**
   * Submit registration
   */
  submitRegistration(): void {
    if (!this.canSubmit()) {
      this.notificationStore.error('Please verify both email and mobile');
      return;
    }

    this.isLoading.set(true);

    const formValue = this.registrationForm.value;
    const registrationRequest: CandidateRegistrationRequest = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      mobile: formValue.mobile,
      password: formValue.password,
    };

    this.candidateService.registerCandidate(registrationRequest).subscribe({
      next: (candidate) => {
        this.isLoading.set(false);
        this.notificationStore.success(SUCCESS_MESSAGES.REGISTRATION_SUCCESS);
        // Navigate to login page
        this.router.navigate([APP_ROUTES.LOGIN], {
          queryParams: { registered: 'true' },
        });
      },
      error: (error) => {
        this.isLoading.set(false);
        this.notificationStore.error(error.message || ERROR_MESSAGES.REGISTRATION_FAILED);
      },
    });
  }

  /**
   * Go back to registration step
   */
  goBackToRegistration(): void {
    this.currentStep.set(0);
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

    if (fieldName === 'firstName' || fieldName === 'lastName') {
      if (control.errors['pattern']) {
        return VALIDATION_MESSAGES.NAME_INVALID;
      }
      if (control.errors['minlength']) {
        return VALIDATION_MESSAGES.MIN_LENGTH(2);
      }
      if (control.errors['maxlength']) {
        return VALIDATION_MESSAGES.MAX_LENGTH(50);
      }
    }

    if (fieldName === 'confirmPassword' && this.registrationForm.errors?.['passwordMismatch']) {
      return 'Passwords do not match';
    }

    return '';
  }
}
