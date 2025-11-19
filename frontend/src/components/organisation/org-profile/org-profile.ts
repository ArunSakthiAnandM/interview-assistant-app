import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { OrganisationService } from '../../../services/organisation/organisation.service';
import { FileService } from '../../../services/file/file.service';
import { NotificationStore } from '../../../stores/notification/notification.store';
import {
  Organisation,
  VerificationStatus,
  VerificationHistoryEntry,
} from '../../../models/organisation.model';
import { FileEntityType } from '../../../models/file.model';

/**
 * Organisation Profile Component
 *
 * Displays and allows editing of organisation profile.
 * Shows verification status and allows resubmission if rejected.
 */
@Component({
  selector: 'app-org-profile',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatTabsModule,
  ],
  templateUrl: './org-profile.html',
  styleUrl: './org-profile.scss',
})
export class OrgProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private orgService = inject(OrganisationService);
  private fileService = inject(FileService);
  private notificationStore = inject(NotificationStore);

  protected organisation = signal<Organisation | null>(null);
  protected isLoading = signal(true);
  protected isEditing = signal(false);
  protected isResubmitting = signal(false);
  protected isSaving = signal(false);
  protected newKycFile = signal<File | null>(null);
  protected verificationHistory = signal<VerificationHistoryEntry[]>([]);
  protected isLoadingHistory = signal(false);

  protected profileForm!: FormGroup;
  protected VerificationStatus = VerificationStatus;

  protected canEdit = computed(() => {
    const org = this.organisation();
    return (
      org &&
      (org.verificationStatus === VerificationStatus.PENDING ||
        org.verificationStatus === VerificationStatus.VERIFIED)
    );
  });

  protected canResubmit = computed(() => {
    const org = this.organisation();
    return org && org.verificationStatus === VerificationStatus.REJECTED;
  });

  ngOnInit(): void {
    this.initializeForm();
    this.loadOrganisation();
  }

  private initializeForm(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumber: [''],
      address: [''],
    });
  }

  private async loadOrganisation(): Promise<void> {
    try {
      const org = await this.orgService.getMyOrganisation().toPromise();
      if (org) {
        this.organisation.set(org);
        this.profileForm.patchValue({
          name: org.name,
          phoneNumber: org.phoneNumber || '',
          address: org.address || '',
        });
        this.loadVerificationHistory(org.id);
      }
    } catch (error: any) {
      this.notificationStore.error('Failed to load organisation profile');
    } finally {
      this.isLoading.set(false);
    }
  }

  private async loadVerificationHistory(orgId: string): Promise<void> {
    this.isLoadingHistory.set(true);
    try {
      const history = await this.orgService.getVerificationHistory(orgId).toPromise();
      if (history) {
        this.verificationHistory.set(history);
      }
    } catch (error) {
      // History is optional, don't show error
      console.error('Failed to load verification history:', error);
    } finally {
      this.isLoadingHistory.set(false);
    }
  }

  protected startEditing(): void {
    this.isEditing.set(true);
    this.isResubmitting.set(false);
  }

  protected startResubmission(): void {
    this.isEditing.set(true);
    this.isResubmitting.set(true);
  }

  protected cancelEditing(): void {
    this.isEditing.set(false);
    this.isResubmitting.set(false);
    this.newKycFile.set(null);

    const org = this.organisation();
    if (org) {
      this.profileForm.patchValue({
        name: org.name,
        phoneNumber: org.phoneNumber || '',
        address: org.address || '',
      });
    }
  }

  protected onKycFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Basic validation
      const maxSize = 10 * 1024 * 1024;
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

      if (file.size > maxSize) {
        this.notificationStore.error('File size must be under 10MB');
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        this.notificationStore.error('Please upload PDF, JPG, or PNG files only');
        return;
      }

      this.newKycFile.set(file);
    }
  }

  protected async saveChanges(): Promise<void> {
    if (!this.profileForm.valid || this.isSaving()) return;

    const org = this.organisation();
    if (!org) return;

    this.isSaving.set(true);

    try {
      const updateData = {
        name: this.profileForm.value.name,
        phoneNumber: this.profileForm.value.phoneNumber,
        address: this.profileForm.value.address,
      };

      let updatedOrg;

      if (this.isResubmitting()) {
        // Resubmit for verification
        updatedOrg = await this.orgService.resubmit(org.id, updateData).toPromise();

        // Upload new KYC document if provided
        if (this.newKycFile()) {
          await this.fileService
            .uploadFile(this.newKycFile()!, FileEntityType.KYC_DOCUMENT, org.id)
            .toPromise();
        }

        this.notificationStore.success('Organisation resubmitted for verification');
      } else {
        // Regular update
        updatedOrg = await this.orgService.update(org.id, updateData).toPromise();
        this.notificationStore.success('Profile updated successfully');
      }

      if (updatedOrg) {
        this.organisation.set(updatedOrg);
        this.loadVerificationHistory(updatedOrg.id);
      }

      this.isEditing.set(false);
      this.isResubmitting.set(false);
      this.newKycFile.set(null);
    } catch (error: any) {
      this.notificationStore.error(error.error?.message || 'Failed to save changes');
    } finally {
      this.isSaving.set(false);
    }
  }

  protected getStatusLabel(status: VerificationStatus): string {
    const labels = {
      [VerificationStatus.PENDING]: 'Pending Verification',
      [VerificationStatus.VERIFIED]: 'Verified',
      [VerificationStatus.REJECTED]: 'Rejected',
    };
    return labels[status] || status;
  }

  protected getHistoryIcon(status: VerificationStatus): string {
    const icons = {
      [VerificationStatus.PENDING]: 'schedule',
      [VerificationStatus.VERIFIED]: 'check_circle',
      [VerificationStatus.REJECTED]: 'cancel',
    };
    return icons[status] || 'help';
  }

  protected formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
