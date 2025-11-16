import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastNotificationComponent } from '../components/shared/toast-notification/toast-notification';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastNotificationComponent],
  template: `
    <router-outlet />
    <app-toast-notification></app-toast-notification>
  `,
  styles: [],
})
export class App {}
