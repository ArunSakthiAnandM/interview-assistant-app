import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthStore } from '../../store/auth.store';
import { NotificationStore } from '../../store/notification.store';

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
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  authStore = inject(AuthStore);
  private fb = inject(FormBuilder);
  private notificationStore = inject(NotificationStore);

  profileForm!: FormGroup;
  isSaving = signal<boolean>(false);

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    const user = this.authStore.currentUser();

    this.profileForm = this.fb.group({
      firstName: [user?.firstName || '', [Validators.required]],
      lastName: [user?.lastName || '', [Validators.required]],
      email: [user?.email || '', [Validators.required, Validators.email]],
      mobile: [''],
      skills: [''],
      experience: [0],
      education: [''],
    });
  }

  resetForm(): void {
    this.initializeForm();
    this.notificationStore.info('Form reset', 'Info');
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.notificationStore.error('Please fill all required fields', 'Validation Error');
      return;
    }

    this.isSaving.set(true);

    // TODO: Implement API call to update profile
    // PUT /api/v1/users/{userId}/profile
    setTimeout(() => {
      this.notificationStore.success('Profile updated successfully', 'Success');
      this.isSaving.set(false);
    }, 1500);
  }

  changePassword(): void {
    // TODO: Open change password dialog
    this.notificationStore.info('Change password feature coming soon', 'Feature');
  }

  enableTwoFactor(): void {
    // TODO: Open 2FA setup dialog
    this.notificationStore.info('2FA feature coming soon', 'Feature');
  }

  deleteAccount(): void {
    // TODO: Open confirmation dialog
    this.notificationStore.warning('Delete account feature requires confirmation', 'Warning');
  }
}
