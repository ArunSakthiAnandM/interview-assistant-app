import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { InvitationService } from '../../../services/invitation/invitation.service';
import { NotificationStore } from '../../../stores/notification/notification.store';
import { AuthService } from '../../../services/auth/auth.service';
import { UserRole } from '../../../models/user.model';

/**
 * User Invitation Component
 *
 * Allows organisation admins to invite users to their organisation.
 * Supports single and bulk invitations with role assignment.
 */
@Component({
  selector: 'app-user-invite',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
  ],
  templateUrl: './user-invite.html',
  styleUrl: './user-invite.scss',
})
export class UserInviteComponent {
  private fb = inject(FormBuilder);
  private invitationService = inject(InvitationService);
  private notificationStore = inject(NotificationStore);
  private authService = inject(AuthService);

  protected singleInviteForm!: FormGroup;
  protected bulkInviteForm!: FormGroup;
  protected isSending = signal(false);

  // Available roles based on current user's role
  protected availableRoles = computed(() => {
    const currentUser = this.authService.currentUser();
    const roles = [
      { value: UserRole.RECRUITER, label: 'Recruiter' },
      { value: UserRole.INTERVIEWER, label: 'Interviewer' },
      { value: UserRole.CANDIDATE, label: 'Candidate' },
    ];

    // Admins can invite organisation admins too
    if (currentUser?.role === UserRole.ADMIN) {
      roles.unshift({ value: UserRole.ORGANISATION_ADMIN, label: 'Organisation Admin' });
    }

    return roles;
  });

  get invitees(): FormArray {
    return this.bulkInviteForm.get('invitees') as FormArray;
  }

  constructor() {
    this.initializeForms();
  }

  private initializeForms(): void {
    this.singleInviteForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      expiryDays: [7, [Validators.required, Validators.min(1)]],
    });

    this.bulkInviteForm = this.fb.group({
      role: ['', Validators.required],
      expiryDays: [7, [Validators.required, Validators.min(1)]],
      invitees: this.fb.array([this.createInviteeGroup()]),
    });
  }

  private createInviteeGroup(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  protected addInvitee(): void {
    this.invitees.push(this.createInviteeGroup());
  }

  protected removeInvitee(index: number): void {
    if (this.invitees.length > 1) {
      this.invitees.removeAt(index);
    }
  }

  protected async sendSingleInvitation(): Promise<void> {
    if (!this.singleInviteForm.valid || this.isSending()) return;

    this.isSending.set(true);

    try {
      const formValue = this.singleInviteForm.value;
      await this.invitationService
        .send({
          email: formValue.email,
          role: formValue.role,
          expiryDays: formValue.expiryDays,
        })
        .toPromise();

      this.notificationStore.success(`Invitation sent to ${formValue.email}`);
      this.singleInviteForm.reset({ expiryDays: 7 });
    } catch (error: any) {
      this.notificationStore.error(error.error?.message || 'Failed to send invitation');
    } finally {
      this.isSending.set(false);
    }
  }

  protected async sendBulkInvitations(): Promise<void> {
    if (!this.bulkInviteForm.valid || this.isSending()) return;

    this.isSending.set(true);

    try {
      const formValue = this.bulkInviteForm.value;
      const invitations = formValue.invitees.map((invitee: any) => ({
        email: invitee.email,
        role: formValue.role,
        expiryDays: formValue.expiryDays,
      }));

      await this.invitationService
        .bulkSend({
          invitations,
        })
        .toPromise();

      this.notificationStore.success(
        `${invitations.length} invitation${invitations.length > 1 ? 's' : ''} sent successfully`
      );

      // Reset form
      this.bulkInviteForm.reset();
      this.invitees.clear();
      this.invitees.push(this.createInviteeGroup());
    } catch (error: any) {
      this.notificationStore.error(error.error?.message || 'Failed to send invitations');
    } finally {
      this.isSending.set(false);
    }
  }
}
