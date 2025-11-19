import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services';
import { NotificationStore } from '../../../stores';
import { ROUTES } from '../../../constants/routes';
import { UserRole, RegisterUserDto } from '../../../models/user.model';

/**
 * User Registration Component
 *
 * Allows public users to register as candidates or apply for other roles
 */
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private notificationStore = inject(NotificationStore);
  private router = inject(Router);

  protected registerForm!: FormGroup;
  protected isLoading = false;
  protected showPassword = false;
  protected showConfirmPassword = false;
  protected readonly ROUTES = ROUTES;

  // Role options available for public registration
  protected roleOptions = [
    { value: UserRole.CANDIDATE, label: 'Candidate', description: 'Looking for job opportunities' },
    {
      value: UserRole.INTERVIEWER,
      label: 'Interviewer',
      description: 'Conduct technical interviews',
    },
    { value: UserRole.RECRUITER, label: 'Recruiter', description: 'Manage hiring processes' },
  ];

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Initialize registration form
   */
  private initializeForm(): void {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
        confirmPassword: ['', [Validators.required]],
        phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        role: [UserRole.CANDIDATE, [Validators.required]],
        address: [''],
        skills: [''],
        experience: [''],
        expertise: [''],
        yearsOfExperience: [0, [Validators.min(0)]],
        specialization: [''],
        expectedSalary: [null, [Validators.min(0)]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  /**
   * Custom password validator
   */
  private passwordValidator(control: any) {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const valid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

    return valid ? null : { passwordStrength: true };
  }

  /**
   * Password match validator
   */
  private passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  /**
   * Handle form submission
   */
  protected async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    try {
      const formValue = this.registerForm.value;

      const registerDto: RegisterUserDto = {
        name: formValue.name,
        email: formValue.email,
        password: formValue.password,
        phoneNumber: formValue.phoneNumber,
        role: formValue.role,
        address: formValue.address || undefined,
        skills: formValue.skills || undefined,
        experience: formValue.experience || undefined,
        expertise: formValue.expertise || undefined,
        yearsOfExperience: formValue.yearsOfExperience || undefined,
        specialization: formValue.specialization || undefined,
        expectedSalary: formValue.expectedSalary || undefined,
      };

      await this.authService.register(registerDto).toPromise();

      this.notificationStore.success(
        'Registration successful! You can now log in with your credentials.'
      );

      // Navigate to login page
      this.router.navigate([ROUTES.LOGIN]);
    } catch (error: any) {
      console.error('Registration error:', error);
      this.notificationStore.error(error.error?.message || 'Failed to register. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Toggle password visibility
   */
  protected togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Toggle confirm password visibility
   */
  protected toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /**
   * Check if field has error
   */
  protected hasError(fieldName: string, errorType?: string): boolean {
    const field = this.registerForm.get(fieldName);
    if (!field) return false;

    if (errorType) {
      return field.hasError(errorType) && (field.dirty || field.touched);
    }

    return field.invalid && (field.dirty || field.touched);
  }

  /**
   * Check if form has error
   */
  protected hasFormError(errorType: string): boolean {
    return this.registerForm.hasError(errorType) && this.registerForm.touched;
  }

  /**
   * Navigate to login
   */
  protected goToLogin(): void {
    this.router.navigate([ROUTES.LOGIN]);
  }

  /**
   * Navigate to organisation registration
   */
  protected goToOrgRegister(): void {
    this.router.navigate([ROUTES.ORG_REGISTER]);
  }
}
