# Frontend Source Code - /src

## Purpose

This directory contains all the source code for the Interview Assistant frontend application built with Angular 20.

## Structure Overview

- `app/` - Application root component, configuration, and routing
- `assets/` - Static assets (images, icons, fonts, etc.)
- `components/` - All UI components organized by feature/domain
- `constants/` - Application-wide constants and configuration values
- `guards/` - Route guards for access control
- `models/` - TypeScript interfaces, types, and data models
- `services/` - Business logic, API communication, and shared services
- `store/` - Signal-based state management stores
- `utils/` - Utility functions, interceptors, and helpers

## Angular 20 Requirements

### File Naming Conventions

- Components: `[name].ts`, `[name].html`, `[name].scss`, `[name].spec.ts`
- Services: `[name].service.ts`, `[name].service.spec.ts`
- Guards: `[name].guard.ts`, `[name].guard.spec.ts`
- Models: `[name].model.ts`
- Stores: `[name].store.ts`
- Interceptors: `[name].interceptor.ts`

### Component Files

- Use standalone components (default in Angular 20)
- DO NOT explicitly set `standalone: true` in decorators
- Use `changeDetection: ChangeDetectionStrategy.OnPush`
- Use `input()` and `output()` functions, not decorators
- Use `inject()` for dependency injection
- Use signals for reactive state

### Template Syntax

- Use `@if`, `@for`, `@switch` (NOT `*ngIf`, `*ngFor`, `*ngSwitch`)
- Use `[class.xxx]` instead of `ngClass`
- Use `[style.xxx]` instead of `ngStyle`
- Use `async` pipe for observables

### Services

- Use `providedIn: 'root'` for singleton services
- Use `inject()` function for dependencies
- Keep services focused on single responsibility
- Use signals for service state when appropriate

### State Management

- Use signals for reactive state
- Use `computed()` for derived values
- Use `set()` or `update()` for signal updates (NOT `mutate()`)
- Keep state immutable

### TypeScript

- Enable strict type checking
- Avoid `any` type
- Use interfaces from `models/` folder
- Prefer type inference when obvious

## Import Patterns

```typescript
// Prefer barrel exports from index.ts files
import { UserModel, InterviewModel } from '../models';
import { AuthService, NotificationService } from '../services';
import { AuthGuard, RoleGuard } from '../guards';
```

## Best Practices

- Keep files focused and small
- Use consistent naming conventions
- Export commonly used items through index.ts barrel files
- Write unit tests for all services and components
- Document complex logic with comments
- Follow the folder-specific guidelines in each subdirectory

## Entry Points

- `main.ts` - Application bootstrap
- `index.html` - HTML entry point
- `styles.scss` - Global styles

## Notes for AI Agents

- Always check the specific AGENT.md in each subfolder for detailed requirements
- Maintain consistency with existing code patterns
- Follow Angular 20 best practices strictly
- Use the established folder structure for new files
