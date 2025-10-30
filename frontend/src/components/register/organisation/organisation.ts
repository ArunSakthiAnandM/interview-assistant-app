import { Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { FileUploadComponent } from '../../shared/file-upload/file-upload';
import { OrganisationService } from '../../../services/organisation.service';
import { FileUploadService } from '../../../services/file-upload.service';
import {
  OrganisationRegistrationRequest,
  KYCDocument,
  KYCDocumentType,
  FileUploadResponse,
} from '../../../models';
import {
  VALIDATION_PATTERNS,
  VALIDATION_MESSAGES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  APP_ROUTES,
} from '../../../constants';

/**
 * Organisation Registration Component
 * Multi-step form for registering a new organisation with KYC documents
 */
@Component({
  selector: 'app-organisation',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatStepperModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCardModule,
    MatIconModule,
    FileUploadComponent,
  ],
  templateUrl: './organisation.html',
  styleUrl: './organisation.scss',
})
export class Organisation {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  readonly snackBar = inject(MatSnackBar);
  private organisationService = inject(OrganisationService);
  readonly fileUploadService = inject(FileUploadService);

  // Signals
  isLoading = signal<boolean>(false);
  uploadedDocuments = signal<KYCDocument[]>([]);
  currentUploadingDoc = signal<KYCDocumentType | null>(null);

  // Form groups
  orgDetailsForm!: FormGroup;
  addressForm!: FormGroup;
  adminForm!: FormGroup;
  kycForm!: FormGroup;

  // Constants
  readonly KYCDocumentType = KYCDocumentType;
  readonly validationMessages = VALIDATION_MESSAGES;

  constructor() {
    this.initializeForms();
  }

  /**
   * Initialize all form groups
   */
  private initializeForms(): void {
    // Organisation Details Form
    this.orgDetailsForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      registrationNumber: ['', [Validators.maxLength(50)]],
      contactEmail: [
        '',
        [Validators.required, Validators.email, Validators.pattern(VALIDATION_PATTERNS.EMAIL)],
      ],
      contactPhone: [
        '',
        [Validators.required, Validators.pattern(VALIDATION_PATTERNS.MOBILE_INTERNATIONAL)],
      ],
      website: ['', [Validators.pattern(VALIDATION_PATTERNS.URL)]],
      description: ['', [Validators.maxLength(1000)]],
    });

    // Address Form
    this.addressForm = this.fb.group({
      street: ['', [Validators.required, Validators.maxLength(200)]],
      city: ['', [Validators.required, Validators.maxLength(100)]],
      state: ['', [Validators.required, Validators.maxLength(100)]],
      country: ['', [Validators.required, Validators.maxLength(100)]],
      postalCode: ['', [Validators.required, Validators.maxLength(20)]],
    });

    // Admin User Form
    this.adminForm = this.fb.group(
      {
        adminName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        adminEmail: [
          '',
          [Validators.required, Validators.email, Validators.pattern(VALIDATION_PATTERNS.EMAIL)],
        ],
        adminPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(VALIDATION_PATTERNS.PASSWORD),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );

    // KYC Documents Form
    this.kycForm = this.fb.group({
      documentType: [KYCDocumentType.BUSINESS_LICENSE, [Validators.required]],
    });
  }

  /**
   * Password match validator
   */
  private passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('adminPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  /**
   * Handle file selection for KYC document
   * TODO: This will call backend file upload endpoint
   */
  onKYCFileSelected(file: File): void {
    const documentType = this.kycForm.get('documentType')?.value;
    this.currentUploadingDoc.set(documentType);
    this.isLoading.set(true);

    this.fileUploadService.uploadFile(file, documentType).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const kycDoc: KYCDocument = {
            documentType: documentType,
            documentName: response.data.fileName,
            fileUrl: response.data.fileUrl,
            fileSize: response.data.fileSize,
            uploadedAt: response.data.uploadedAt,
          };

          const docs = [...this.uploadedDocuments()];
          docs.push(kycDoc);
          this.uploadedDocuments.set(docs);

          this.snackBar.open(SUCCESS_MESSAGES.FILE_UPLOADED, 'Close', { duration: 3000 });
        }
      },
      error: (error) => {
        console.error('File upload error:', error);
        this.snackBar.open(error.message || ERROR_MESSAGES.FILE_UPLOAD_ERROR, 'Close', {
          duration: 5000,
        });
      },
      complete: () => {
        this.isLoading.set(false);
        this.currentUploadingDoc.set(null);
      },
    });
  }

  /**
   * Remove uploaded KYC document
   */
  removeKYCDocument(index: number): void {
    const docs = [...this.uploadedDocuments()];
    docs.splice(index, 1);
    this.uploadedDocuments.set(docs);
  }

  /**
   * Get document type display name
   */
  getDocumentTypeName(type: KYCDocumentType): string {
    const names: Record<KYCDocumentType, string> = {
      [KYCDocumentType.BUSINESS_LICENSE]: 'Business License',
      [KYCDocumentType.TAX_CERTIFICATE]: 'Tax Certificate',
      [KYCDocumentType.INCORPORATION_CERTIFICATE]: 'Incorporation Certificate',
      [KYCDocumentType.BANK_STATEMENT]: 'Bank Statement',
      [KYCDocumentType.OTHER]: 'Other Document',
    };
    return names[type];
  }

  /**
   * Submit organisation registration
   * TODO: This will call Spring Boot backend organisation registration API
   */
  onSubmit(): void {
    if (
      this.orgDetailsForm.invalid ||
      this.addressForm.invalid ||
      this.adminForm.invalid ||
      this.uploadedDocuments().length === 0
    ) {
      this.snackBar.open(ERROR_MESSAGES.VALIDATION_ERROR, 'Close', { duration: 3000 });
      return;
    }

    this.isLoading.set(true);

    const request: OrganisationRegistrationRequest = {
      ...this.orgDetailsForm.value,
      address: this.addressForm.value,
      adminName: this.adminForm.value.adminName,
      adminEmail: this.adminForm.value.adminEmail,
      adminPassword: this.adminForm.value.adminPassword,
    };

    // TODO: Backend will associate KYC documents with organisation
    console.log('Registration request:', request);
    console.log('KYC Documents:', this.uploadedDocuments());

    this.organisationService.registerOrganisation(request).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open(SUCCESS_MESSAGES.REGISTRATION_SUCCESS, 'Close', { duration: 5000 });
          // Navigate to login or success page
          setTimeout(() => {
            this.router.navigate([APP_ROUTES.LOGIN]);
          }, 2000);
        }
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.snackBar.open(error.message || ERROR_MESSAGES.REGISTRATION_FAILED, 'Close', {
          duration: 5000,
        });
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Get error message for form field
   */
  getErrorMessage(formGroup: FormGroup, fieldName: string): string {
    const control = formGroup.get(fieldName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.errors['required']) {
      return VALIDATION_MESSAGES.REQUIRED;
    }
    if (control.errors['email']) {
      return VALIDATION_MESSAGES.EMAIL_INVALID;
    }
    if (control.errors['pattern']) {
      if (fieldName.includes('Email')) {
        return VALIDATION_MESSAGES.EMAIL_INVALID;
      }
      if (fieldName.includes('Phone')) {
        return VALIDATION_MESSAGES.MOBILE_INVALID;
      }
      if (fieldName.includes('Password')) {
        return VALIDATION_MESSAGES.PASSWORD_WEAK;
      }
      if (fieldName.includes('website')) {
        return VALIDATION_MESSAGES.URL_INVALID;
      }
    }
    if (control.errors['minlength']) {
      return VALIDATION_MESSAGES.MIN_LENGTH(control.errors['minlength'].requiredLength);
    }
    if (control.errors['maxlength']) {
      return VALIDATION_MESSAGES.MAX_LENGTH(control.errors['maxlength'].requiredLength);
    }

    return 'Invalid value';
  }

  /**
   * Navigate back to home
   */
  goBack(): void {
    this.router.navigate([APP_ROUTES.HOME]);
  }
}
