import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

/**
 * Notifications Component
 *
 * Displays all user notifications in a list view.
 * TODO: Implement full notifications functionality with real-time updates
 */
@Component({
  selector: 'app-notifications',
  imports: [MatCardModule],
  template: `
    <div class="notifications-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Notifications</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Notifications page - Coming soon</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .notifications-container {
        padding: 24px;
        max-width: 1200px;
        margin: 0 auto;
      }
    `,
  ],
})
export class NotificationsComponent {}
