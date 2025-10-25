# App Folder - /src/app

## Purpose

Contains the root application component, global configuration, and routing setup for the Angular 20 application.

## Key Files

- `app.ts` - Root standalone component
- `app.html` - Root template
- `app.scss` - Root component styles
- `app.config.ts` - Application-wide configuration (providers, interceptors, etc.)
- `app.routes.ts` - Main routing configuration

## Angular 20 Requirements

### Root Component (app.ts)

```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // DO NOT set standalone: true - it's default in Angular 20
})
export class AppComponent {
  // Use signals for state
  // Use inject() for dependencies
}
```

### Application Configuration (app.config.ts)

- Configure all providers
- Register HTTP interceptors
- Set up routing configuration
- Configure third-party libraries
- Use `provideRouter()` with routes
- Use `provideHttpClient()` with interceptors

### Routing Configuration (app.routes.ts)

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'feature',
    loadComponent: () => import('./path/to/component').then((m) => m.ComponentName),
    // Use guards for protection
    canActivate: [AuthGuard],
  },
];
```

## Best Practices

- Keep root component minimal - mainly for layout structure
- Implement lazy loading for all feature routes
- Use route guards for authentication and authorization
- Configure all global providers in app.config.ts
- Use path-based code splitting for better performance

## Routing Patterns

- Use lazy loading with `loadComponent` for routes
- Use `loadChildren` for feature module-like structures
- Implement route guards for access control
- Use route resolvers for data fetching
- Define clear route structure with proper naming

## State Management

- Root component should not contain business logic
- Use services and stores for global state
- Pass data through router state or services
- Avoid prop drilling through component tree

## Notes for AI Agents

- Root component is the entry point of the application
- Keep app configuration centralized in app.config.ts
- Use lazy loading for all feature routes
- Follow established routing patterns
- Always use standalone component patterns
