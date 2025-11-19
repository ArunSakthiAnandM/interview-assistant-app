import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../../../services/user/user.service';
import { AuthService } from '../../../services/auth/auth.service';
import { NotificationStore } from '../../../stores/notification/notification.store';
import { User, UserRole } from '../../../models/user.model';
import { ROUTES } from '../../../constants/routes';

/**
 * User List Component
 *
 * Displays paginated list of users with filtering capabilities.
 * Different views for Admin (all users) vs Org Admin (org users only).
 */
@Component({
  selector: 'app-user-list',
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
    MatTooltipModule,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserListComponent implements OnInit {
  private router = inject(Router);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private notificationStore = inject(NotificationStore);

  protected users = signal<User[]>([]);
  protected isLoading = signal(false);
  protected pageNumber = signal(0);
  protected pageSize = signal(20);
  protected totalElements = signal(0);
  protected searchQuery = '';
  protected roleFilter: UserRole | null = null;

  protected isAdmin = computed(() => this.authService.currentUser()?.role === UserRole.ADMIN);

  protected canDelete = computed(() => this.authService.currentUser()?.role === UserRole.ADMIN);

  protected displayedColumns = computed(() => {
    const columns = ['name', 'role'];
    if (this.isAdmin()) {
      columns.push('organisation');
    }
    columns.push('status', 'createdAt', 'actions');
    return columns;
  });

  protected availableRoles = computed(() => {
    const roles = [
      { value: UserRole.RECRUITER, label: 'Recruiter' },
      { value: UserRole.INTERVIEWER, label: 'Interviewer' },
      { value: UserRole.CANDIDATE, label: 'Candidate' },
    ];

    if (this.isAdmin()) {
      roles.unshift(
        { value: UserRole.ADMIN, label: 'Admin' },
        { value: UserRole.ORGANISATION_ADMIN, label: 'Organisation Admin' }
      );
    }

    return roles;
  });

  ngOnInit(): void {
    this.loadUsers();
  }

  private async loadUsers(): Promise<void> {
    this.isLoading.set(true);

    try {
      const currentUser = this.authService.currentUser();
      let response;

      if (currentUser?.role === UserRole.ADMIN) {
        // Admin sees all users
        response = await this.userService
          .getAll(
            this.pageNumber(),
            this.pageSize(),
            this.searchQuery || undefined,
            this.roleFilter || undefined
          )
          .toPromise();
      } else if (currentUser?.organisationId) {
        // Org admin sees only their org users
        response = await this.userService
          .getByOrganisation(
            currentUser.organisationId,
            this.pageNumber(),
            this.pageSize(),
            this.roleFilter || undefined
          )
          .toPromise();
      }

      if (response) {
        this.users.set(response.content);
        this.totalElements.set(response.totalElements);
      }
    } catch (error: any) {
      this.notificationStore.error('Failed to load users');
    } finally {
      this.isLoading.set(false);
    }
  }

  protected applyFilters(): void {
    this.pageNumber.set(0);
    this.loadUsers();
  }

  protected clearFilters(): void {
    this.searchQuery = '';
    this.roleFilter = null;
    this.applyFilters();
  }

  protected onPageChange(event: PageEvent): void {
    this.pageNumber.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadUsers();
  }

  protected viewProfile(user: User): void {
    // TODO: Navigate to user profile when route is defined
    this.router.navigate(['/profile', user.id]);
  }

  protected async deleteUser(user: User): Promise<void> {
    if (
      !confirm(`Are you sure you want to delete user "${user.name}"? This action cannot be undone.`)
    ) {
      return;
    }

    try {
      await this.userService.delete(user.id).toPromise();
      this.notificationStore.success(`User ${user.name} has been deleted`);
      this.loadUsers();
    } catch (error: any) {
      this.notificationStore.error(error.error?.message || 'Failed to delete user');
    }
  }

  protected navigateToInvite(): void {
    this.router.navigate([ROUTES.ORGANISATION.INVITE]);
  }

  protected getRoleLabel(role: UserRole): string {
    const labels = {
      [UserRole.ADMIN]: 'Admin',
      [UserRole.ORGANISATION_ADMIN]: 'Org Admin',
      [UserRole.RECRUITER]: 'Recruiter',
      [UserRole.INTERVIEWER]: 'Interviewer',
      [UserRole.CANDIDATE]: 'Candidate',
    };
    return labels[role] || role;
  }

  protected formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
