import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OrganisationService } from '../../../services/organisation/organisation.service';
import { FileService } from '../../../services/file/file.service';
import { NotificationStore } from '../../../stores/notification/notification.store';
import { ROUTES } from '../../../constants/routes';
import { FileEntityType } from '../../../models/file.model';
import { RegisterOrganisationDto } from '../../../models/organisation.model';

/**
 * Organisation Registration Component
 *
 * Multi-step form for registering a new organisation.
 * Steps: Basic Info → Contact Details → Documents → Review
 */
@Component({
  selector: 'app-org-register',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatStepperModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  templateUrl: './org-register.html',
  styleUrl: './org-register.scss',
})
export class OrgRegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private orgService = inject(OrganisationService);
  private fileService = inject(FileService);
  private notificationStore = inject(NotificationStore);

  protected basicInfoForm!: FormGroup;
  protected contactForm!: FormGroup;
  protected uploadedFiles = signal<Record<string, File>>({});
  protected isSubmitting = signal(false);
  protected acceptedTerms = false;

  ngOnInit(): void {
    this.initializeForms();
  }

  private initializeForms(): void {
    this.basicInfoForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      registrationNumber: ['', Validators.required],
      industry: ['', Validators.required],
      websiteUrl: ['', Validators.pattern(/^https?:\/\/.+/)],
      description: [''],
    });

    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  protected onFileSelected(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Basic file validation
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

      if (file.size > maxSize) {
        this.notificationStore.error('File size must be under 10MB');
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        this.notificationStore.error('Please upload PDF, JPG, or PNG files only');
        return;
      }

      this.uploadedFiles.update((files) => ({
        ...files,
        [type]: file,
      }));
    }
  }

  protected async submitRegistration(): Promise<void> {
    if (!this.acceptedTerms || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    try {
      // Prepare registration data
      const registrationData: RegisterOrganisationDto = {
        organisationName: this.basicInfoForm.value.name,
        adminName: '', // TODO: Get from user context or form
        email: this.contactForm.value.email,
        password: '', // TODO: Handle password
        phoneNumber: this.contactForm.value.phoneNumber,
        address: `${this.contactForm.value.address}, ${this.contactForm.value.city}, ${this.contactForm.value.state} ${this.contactForm.value.postalCode}, ${this.contactForm.value.country}`,
      };

      // Register organisation
      const organisation = await this.orgService.register(registrationData).toPromise();

      if (organisation) {
        // Upload documents
        const uploadPromises = Object.entries(this.uploadedFiles()).map(([type, file]) =>
          this.fileService
            .uploadFile(file, FileEntityType.KYC_DOCUMENT, organisation.id)
            .toPromise()
        );

        await Promise.all(uploadPromises);

        this.notificationStore.success(
          'Organisation registered successfully! Awaiting verification.'
        );

        this.router.navigate([ROUTES.LOGIN]);
      }
    } catch (error: any) {
      this.notificationStore.error(error.error?.message || 'Failed to register organisation');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
