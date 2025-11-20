import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

/**
 * Invitations Component
 *
 * Displays all user invitations (interview invitations, team invitations, etc.)
 * TODO: Implement full invitations functionality
 */
@Component({
  selector: 'app-invitations',
  imports: [MatCardModule],
  template: `
    <div class="invitations-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Invitations</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Invitations page - Coming soon</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .invitations-container {
        padding: 24px;
        max-width: 1200px;
        margin: 0 auto;
      }
    `,
  ],
})
export class InvitationsComponent {}
