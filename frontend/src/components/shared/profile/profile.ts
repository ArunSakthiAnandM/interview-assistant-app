import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

/**
 * Profile Component
 *
 * User profile management page for all authenticated users.
 * TODO: Implement full profile functionality
 */
@Component({
  selector: 'app-profile',
  imports: [MatCardModule],
  template: `
    <div class="profile-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Profile</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Profile page - Coming soon</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .profile-container {
        padding: 24px;
        max-width: 1200px;
        margin: 0 auto;
      }
    `,
  ],
})
export class ProfileComponent {}
