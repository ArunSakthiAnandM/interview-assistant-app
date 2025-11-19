import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { OrganisationService } from '../../../services/organisation/organisation.service';
import { NotificationStore } from '../../../stores/notification/notification.store';
import { Organisation, VerificationStatus } from '../../../models/organisation.model';
import { ROUTES } from '../../../constants/routes';

/**
 * Organisation List Component (Admin)
 *
 * Displays paginated list of all organisations with filtering.
 * Allows admins to verify/reject organisations and view details.
 */
@Component({
  selector: 'app-org-list',
  imports: [
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatDialogModule,
  ],
  templateUrl: './org-list.html',
  styleUrl: './org-list.scss',
})
export class OrgListComponent implements OnInit {
  private router = inject(Router);
  private orgService = inject(OrganisationService);
  private notificationStore = inject(NotificationStore);
  private dialog = inject(MatDialog);

  protected organisations = signal<Organisation[]>([]);
  protected isLoading = signal(false);
  protected pageNumber = signal(0);
  protected pageSize = signal(20);
  protected totalElements = signal(0);
  protected searchQuery = '';
  protected statusFilter: VerificationStatus | null = null;

  protected displayedColumns = ['name', 'status', 'createdAt', 'actions'];
  protected VerificationStatus = VerificationStatus;

  protected pendingCount = computed(() => {
    return this.organisations().filter(
      (org) => org.verificationStatus === VerificationStatus.PENDING
    ).length;
  });

  ngOnInit(): void {
    this.loadOrganisations();
  }

  private async loadOrganisations(): Promise<void> {
    this.isLoading.set(true);

    try {
      const response = await this.orgService
        .getAll(
          this.pageNumber(),
          this.pageSize(),
          this.searchQuery || undefined,
          this.statusFilter || undefined
        )
        .toPromise();

      if (response) {
        this.organisations.set(response.content);
        this.totalElements.set(response.totalElements);
      }
    } catch (error: any) {
      this.notificationStore.error('Failed to load organisations');
    } finally {
      this.isLoading.set(false);
    }
  }

  protected applyFilters(): void {
    this.pageNumber.set(0); // Reset to first page
    this.loadOrganisations();
  }

  protected clearFilters(): void {
    this.searchQuery = '';
    this.statusFilter = null;
    this.applyFilters();
  }

  protected onPageChange(event: PageEvent): void {
    this.pageNumber.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadOrganisations();
  }

  protected viewDetails(org: Organisation): void {
    // TODO: Navigate to org details page or open dialog
    this.router.navigate([ROUTES.ADMIN.ORGANISATIONS, org.id]);
  }

  protected async verifyOrganisation(org: Organisation): Promise<void> {
    if (!confirm(`Are you sure you want to verify "${org.name}"?`)) {
      return;
    }

    try {
      await this.orgService
        .verify(org.id, {
          status: VerificationStatus.VERIFIED,
        })
        .toPromise();

      this.notificationStore.success(`${org.name} has been verified`);
      this.loadOrganisations();
    } catch (error: any) {
      this.notificationStore.error(error.error?.message || 'Failed to verify organisation');
    }
  }

  protected async rejectOrganisation(org: Organisation): Promise<void> {
    const reason = prompt(`Enter rejection reason for "${org.name}":`);

    if (!reason) {
      return;
    }

    try {
      await this.orgService.reject(org.id, reason).toPromise();

      this.notificationStore.success(`${org.name} has been rejected`);
      this.loadOrganisations();
    } catch (error: any) {
      this.notificationStore.error(error.error?.message || 'Failed to reject organisation');
    }
  }

  protected getStatusLabel(status: VerificationStatus): string {
    const labels = {
      [VerificationStatus.PENDING]: 'Pending',
      [VerificationStatus.VERIFIED]: 'Verified',
      [VerificationStatus.REJECTED]: 'Rejected',
    };
    return labels[status] || status;
  }

  protected formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
