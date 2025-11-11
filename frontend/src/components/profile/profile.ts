import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AuthStore } from '../../store/auth.store';
import { NotificationStore } from '../../store/notification.store';
import { API_CONFIG, API_ENDPOINTS } from '../../constants';

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  authStore = inject(AuthStore);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);
  private notificationStore = inject(NotificationStore);

  profileForm!: FormGroup;
  isSaving = signal<boolean>(false);

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Initialize form with current user data
   */
  private initializeForm(): void {
    const user = this.authStore.currentUser();

    this.profileForm = this.fb.group({
      firstName: [user?.firstName || '', [Validators.required, Validators.minLength(2)]],
      lastName: [user?.lastName || '', [Validators.required, Validators.minLength(2)]],
      email: [
        { value: user?.email || '', disabled: true },
        [Validators.required, Validators.email],
      ],
      mobile: ['', [Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
      skills: [''],
      experience: [0, [Validators.min(0), Validators.max(50)]],
      education: [''],
    });
  }

  /**
   * Reset form to original values
   */
  resetForm(): void {
    this.initializeForm();
    this.notificationStore.info('Form reset');
  }

  /**
   * Save profile changes
   */
  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched(this.profileForm);
      this.notificationStore.error('Please fill all required fields correctly');
      return;
    }

    this.isSaving.set(true);

    const profileData = {
      ...this.profileForm.value,
      email: this.authStore.currentUser()?.email, // Include email even though it's disabled
    };

    // Determine endpoint based on user role
    const role = this.authStore.userRole();
    const userId = this.authStore.currentUser()?.id;
    let endpoint = '';

    if (role === 'CANDIDATE') {
      endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CANDIDATE.UPDATE(userId!)}`;
    } else if (role === 'RECRUITER') {
      endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.RECRUITER.UPDATE(userId!)}`;
    } else if (role === 'INTERVIEWER') {
      endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.INTERVIEWER.UPDATE(userId!)}`;
    } else {
      // For ADMIN and other roles, use generic user update endpoint
      endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.USER.UPDATE(userId!)}`;
    }

    this.http.put<any>(endpoint, profileData).subscribe({
      next: (userData) => {
        this.notificationStore.success('Profile updated successfully');
        this.isSaving.set(false);

        // Update the auth store with new user data
        this.authStore.setUser({ ...this.authStore.currentUser()!, ...userData });
      },
      error: (error) => {
        console.error('Profile update error:', error);
        this.notificationStore.error(
          error.error?.message || 'Failed to update profile. Please try again.'
        );
        this.isSaving.set(false);
      },
    });
  }

  /**
   * Mark all form fields as touched
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
   * Open change password dialog
   */
  changePassword(): void {
    // TODO: Implement change password dialog
    this.notificationStore.info('Change password feature coming soon');
  }

  /**
   * Enable two-factor authentication
   */
  enableTwoFactor(): void {
    // TODO: Implement 2FA setup dialog
    this.notificationStore.info('Two-factor authentication feature coming soon');
  }

  /**
   * Delete account (requires confirmation)
   */
  deleteAccount(): void {
    // TODO: Implement delete account confirmation dialog
    this.notificationStore.warning('Please contact support to delete your account');
  }
}
