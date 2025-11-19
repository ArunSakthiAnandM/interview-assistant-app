import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { VALIDATION_PATTERNS, VALIDATION_MESSAGES, ROUTES } from '../../../constants';
import { extractErrorMessage } from '../../../interceptors';
import { LoginDto } from '../../../models';
import { AuthService } from '../../../services';

/**
 * Login Component
 *
 * Allows users to authenticate with email and password.
 * Redirects to appropriate dashboard based on user role.
 *
 * Features:
 * - Form validation
 * - Loading state
 * - Error handling
 * - Remember me (placeholder for future implementation)
 * - Password visibility toggle
 */
@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <h1>Login</h1>
          <p>Sign in to your account</p>
        </mat-card-header>

        <mat-card-content>
          @if (errorMessage()) {
          <div class="error-banner">
            <mat-icon>error</mat-icon>
            <span>{{ errorMessage() }}</span>
          </div>
          }

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <!-- Email Field -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input
                matInput
                type="email"
                formControlName="email"
                placeholder="Enter your email"
                autocomplete="email"
              />
              <mat-icon matPrefix>email</mat-icon>
              @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
              <mat-error>{{ getEmailError() }}</mat-error>
              }
            </mat-form-field>

            <!-- Password Field -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input
                matInput
                [type]="hidePassword() ? 'password' : 'text'"
                formControlName="password"
                placeholder="Enter your password"
                autocomplete="current-password"
              />
              <mat-icon matPrefix>lock</mat-icon>
              <button
                mat-icon-button
                matSuffix
                type="button"
                (click)="togglePasswordVisibility()"
                [attr.aria-label]="'Hide password'"
              >
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
              <mat-error>{{ getPasswordError() }}</mat-error>
              }
            </mat-form-field>

            <!-- Remember Me and Forgot Password Row -->
            <div class="form-row">
              <mat-checkbox formControlName="rememberMe"> Remember me </mat-checkbox>
              <a [routerLink]="['/' + ROUTES.FORGOT_PASSWORD]" class="link"> Forgot password? </a>
            </div>

            <!-- Submit Button -->
            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="submit-button"
              [disabled]="isLoading()"
            >
              @if (isLoading()) {
              <mat-spinner diameter="20"></mat-spinner>
              <span>Signing in...</span>
              } @else {
              <span>Sign In</span>
              }
            </button>

            <!-- Register Link -->
            <div class="register-link">
              <span>Don't have an account?</span>
              <a [routerLink]="['/' + ROUTES.REGISTER]" class="link">Sign up</a>
            </div>

            <!-- Organisation Registration Link -->
            <div class="org-register-link">
              <span>Are you an organisation?</span>
              <a [routerLink]="['/' + ROUTES.ORG_REGISTER]" class="link">Register here</a>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Signals
  protected isLoading = signal<boolean>(false);
  protected errorMessage = signal<string>('');
  protected hidePassword = signal<boolean>(true);

  // Routes for template
  protected readonly ROUTES = ROUTES;

  // Form
  protected loginForm: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(VALIDATION_PATTERNS.EMAIL)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false],
    });
  }

  /**
   * Handle form submission
   */
  protected onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const loginDto: LoginDto = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.authService.login(loginDto).subscribe({
      next: () => {
        this.isLoading.set(false);
        // Navigation handled by AuthService based on user role
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(extractErrorMessage(error));
      },
    });
  }

  /**
   * Toggle password visibility
   */
  protected togglePasswordVisibility(): void {
    this.hidePassword.set(!this.hidePassword());
  }

  /**
   * Get email error message
   */
  protected getEmailError(): string {
    const control = this.loginForm.get('email');
    if (control?.hasError('required')) {
      return VALIDATION_MESSAGES.REQUIRED;
    }
    if (control?.hasError('pattern')) {
      return VALIDATION_MESSAGES.EMAIL;
    }
    return '';
  }

  /**
   * Get password error message
   */
  protected getPasswordError(): string {
    const control = this.loginForm.get('password');
    if (control?.hasError('required')) {
      return VALIDATION_MESSAGES.REQUIRED;
    }
    if (control?.hasError('minlength')) {
      return VALIDATION_MESSAGES.MIN_LENGTH(8);
    }
    return '';
  }

  /**
   * Mark all controls in form group as touched
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
}
