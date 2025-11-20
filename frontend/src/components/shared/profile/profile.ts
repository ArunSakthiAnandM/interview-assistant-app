import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../services/auth/auth.service';
import { UserService } from '../../../services/user/user.service';
import { NotificationStore } from '../../../stores/notification/notification.store';
import { User, UserRole, AvailabilityStatus, UpdateUserDto } from '../../../models/user.model';
import { ROUTES } from '../../../constants/routes';

/**
 * Profile Component
 *
 * Universal profile management component for all user roles.
 * Allows users to view and edit their personal information including:
 * - Basic info (name, phone, address)
 * - Professional details (expertise, experience, skills)
 * - Resume upload (candidates & interviewers)
 * - Salary expectations (candidates)
 * - Availability status (interviewers)
 *
 * Email address is read-only and cannot be edited.
 */
@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private notificationStore = inject(NotificationStore);
  private router = inject(Router);

  // Signals
  protected user = this.authService.currentUser;
  protected isLoading = signal(false);
  protected isSaving = signal(false);
  protected isUploading = signal(false);
  protected error = signal<string | null>(null);

  // Computed values
  protected userRole = computed(() => this.user()?.role);
  protected isCandidate = computed(() => this.userRole() === UserRole.CANDIDATE);
  protected isInterviewer = computed(() => this.userRole() === UserRole.INTERVIEWER);
  protected isRecruiter = computed(() => this.userRole() === UserRole.RECRUITER);
  protected isAdmin = computed(() => this.userRole() === UserRole.ADMIN);
  protected isOrgAdmin = computed(() => this.userRole() === UserRole.ORGANISATION_ADMIN);

  // Form
  protected profileForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
    this.loadProfile();
  }

  /**
   * Initialize the profile form
   */
  private initializeForm(): void {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: [{ value: '', disabled: true }],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: [''],
      skills: [''],
      experience: [''],
      expertise: [''],
      yearsOfExperience: [null, [Validators.min(0), Validators.max(50)]],
      specialization: [''],
      expectedSalary: [null, [Validators.min(0)]],
      availabilityStatus: ['AVAILABLE'],
    });
  }

  /**
   * Load user profile data
   */
  protected loadProfile(): void {
    const currentUser = this.user();
    if (!currentUser) {
      this.error.set('User not found. Please login again.');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.userService.getMe().subscribe({
      next: (user) => {
        this.patchFormWithUserData(user);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load profile:', err);
        this.error.set('Failed to load profile. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Patch form with user data
   */
  private patchFormWithUserData(user: User): void {
    this.profileForm.patchValue({
      name: user.name || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      address: user.address || '',
      skills: user.skills || '',
      experience: user.experience || '',
      expertise: user.expertise || '',
      yearsOfExperience: user.yearsOfExperience || null,
      specialization: user.specialization || '',
      expectedSalary: user.expectedSalary || null,
      availabilityStatus: user.availabilityStatus || 'AVAILABLE',
    });

    // Mark form as pristine after patching
    this.profileForm.markAsPristine();
  }

  /**
   * Handle form submission
   */
  protected onSubmit(): void {
    if (this.profileForm.invalid || !this.profileForm.dirty) {
      return;
    }

    const currentUser = this.user();
    if (!currentUser) {
      this.notificationStore.error('User not found');
      return;
    }

    this.isSaving.set(true);

    const formValue = this.profileForm.getRawValue();
    const updateDto: UpdateUserDto = {
      name: formValue.name,
      phoneNumber: formValue.phoneNumber,
      address: formValue.address || undefined,
      skills: formValue.skills || undefined,
      experience: formValue.experience || undefined,
      expertise: formValue.expertise || undefined,
      yearsOfExperience: formValue.yearsOfExperience || undefined,
      specialization: formValue.specialization || undefined,
      expectedSalary: formValue.expectedSalary || undefined,
      availabilityStatus: formValue.availabilityStatus || undefined,
    };

    this.userService.update(currentUser.id, updateDto).subscribe({
      next: (updatedUser) => {
        this.notificationStore.success('Profile updated successfully');
        this.patchFormWithUserData(updatedUser);
        this.isSaving.set(false);

        // Update auth service user data
        this.authService['currentUserSignal'].set(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      },
      error: (err) => {
        console.error('Failed to update profile:', err);
        this.notificationStore.error('Failed to update profile. Please try again.');
        this.isSaving.set(false);
      },
    });
  }

  /**
   * Cancel editing and reset form
   */
  protected onCancel(): void {
    const currentUser = this.user();
    if (currentUser) {
      this.patchFormWithUserData(currentUser);
    }
  }

  /**
   * Handle file selection for resume upload
   */
  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.type)) {
      this.notificationStore.error('Invalid file type. Please upload PDF, DOC, or DOCX file.');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.notificationStore.error('File size exceeds 5MB. Please upload a smaller file.');
      return;
    }

    // Convert to base64 and update profile
    this.isUploading.set(true);
    this.convertFileToBase64(file)
      .then((base64) => {
        const currentUser = this.user();
        if (!currentUser) return;

        const updateDto: UpdateUserDto = {
          resumeBase64: base64,
        };

        return this.userService.update(currentUser.id, updateDto).toPromise();
      })
      .then((updatedUser) => {
        if (updatedUser) {
          this.notificationStore.success('Resume uploaded successfully');
          this.authService['currentUserSignal'].set(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        this.isUploading.set(false);
      })
      .catch((err) => {
        console.error('Failed to upload resume:', err);
        this.notificationStore.error('Failed to upload resume. Please try again.');
        this.isUploading.set(false);
      });

    // Reset input
    input.value = '';
  }

  /**
   * Convert file to base64 string
   */
  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  /**
   * View resume in new tab
   */
  protected viewResume(): void {
    const resumeUrl = this.user()?.resumeUrl;
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    }
  }

  /**
   * Download resume
   */
  protected downloadResume(): void {
    const resumeUrl = this.user()?.resumeUrl;
    if (resumeUrl) {
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = `resume_${this.user()?.name}.pdf`;
      link.click();
    }
  }

  /**
   * Get user-friendly role label
   */
  protected getRoleLabel(role?: UserRole): string {
    if (!role) return '';

    const labels: Record<UserRole, string> = {
      [UserRole.ADMIN]: 'Administrator',
      [UserRole.ORGANISATION_ADMIN]: 'Organisation Admin',
      [UserRole.RECRUITER]: 'Recruiter',
      [UserRole.INTERVIEWER]: 'Interviewer',
      [UserRole.CANDIDATE]: 'Candidate',
    };

    return labels[role] || role;
  }
}
