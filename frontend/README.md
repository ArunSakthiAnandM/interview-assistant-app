# Interview Organiser - Frontend

> A modern, professional interview management platform built with Angular 20

[![Angular](https://img.shields.io/badge/Angular-20.3-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Material](https://img.shields.io/badge/Material-20.2-purple.svg)](https://material.angular.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [User Roles & Permissions](#user-roles--permissions)
- [Routing Structure](#routing-structure)
- [State Management](#state-management)
- [Security](#security)
- [Development Guidelines](#development-guidelines)
- [Build & Deployment](#build--deployment)
- [Testing](#testing)
- [Contributing](#contributing)

## 🎯 Overview

The Interview Organiser Frontend is a comprehensive web application designed to streamline the entire interview process for organizations. It provides role-based dashboards and workflows for administrators, recruiters, interviewers, and candidates, ensuring efficient collaboration and transparent communication throughout the hiring pipeline.

### What Makes This Special?

- **Modern Angular 20**: Built with the latest Angular features including signals, zoneless change detection, and standalone components
- **Role-Based Access**: Five distinct user roles with granular permissions and specialized dashboards
- **Real-Time Ready**: Architecture prepared for WebSocket integration for live notifications
- **Enterprise-Grade**: Production-ready with proper error handling, authentication, and security measures
- **Responsive Design**: Mobile-first approach with Material Design components

## ✨ Key Features

### 🔐 Authentication & Authorization

- ✅ JWT-based authentication with refresh tokens
- ✅ Single session enforcement per user
- ✅ Forgot password and reset password flow
- ✅ Role-based access control (RBAC)
- ✅ Protected routes with guards
- ✅ Automatic token refresh and session management

### 👥 User Management

- ✅ Self-registration for candidates, recruiters, and interviewers
- ✅ User profile management and updates
- ✅ Admin user management with full CRUD operations
- ✅ Organisation-based user grouping
- ✅ User invitation system with email validation
- ✅ Soft delete with audit trail

### 🏢 Organisation Management

- ✅ Organisation registration and onboarding
- ✅ KYC document upload and verification workflow
- ✅ Organisation admin dashboard
- ✅ Team member management (recruiters & interviewers)
- ✅ Organisation profile updates
- ✅ Multi-tenant architecture ready

### 📅 Interview Management

- ✅ Create and schedule interviews
- ✅ Multi-round interview support
- ✅ Interviewer assignment and availability tracking
- ✅ Candidate acceptance/decline workflow
- ✅ Interview status tracking (Scheduled, In Progress, Completed, Cancelled)
- ✅ Progressive round scheduling
- ✅ Interview history and timeline

### 💬 Feedback & Decision System

- ✅ Structured interviewer feedback forms
- ✅ Rating system (0-10 scale)
- ✅ Recommendation levels (Strong Hire, Hire, Hold, No Hire)
- ✅ Round-level decision making
- ✅ Final selection decision workflow
- ✅ Feedback visibility controls

### 📊 Dashboards

- ✅ **Admin Dashboard**: System-wide analytics, organisation verification, user management
- ✅ **Organisation Admin Dashboard**: Team overview, interview pipeline, verification status
- ✅ **Recruiter Dashboard**: Active interviews, candidate pipeline, decision tracking
- ✅ **Interviewer Dashboard**: Assigned interviews, pending feedback, schedule overview
- ✅ **Candidate Dashboard**: Interview invitations, status updates, preparation resources

### 🔔 Notifications

- ✅ Toast notification system
- ✅ In-app notification center (ready for real-time)
- ✅ Email notification templates (backend integrated)
- 🚧 WebSocket support for live updates (planned)

### 🎨 UI/UX Features

- ✅ Responsive Material Design interface
- ✅ Dark mode support (theme toggle ready)
- ✅ Loading states and skeleton screens
- ✅ Error boundary and fallback UI
- ✅ Accessibility (WCAG 2.1 Level AA compliance)
- ✅ Breadcrumb navigation (ready to enable)

## 🛠 Technology Stack

### Core Framework

- **Angular 20.3** - Latest Angular with zoneless change detection
- **TypeScript 5.9** - Strict type checking enabled
- **RxJS 7.8** - Reactive programming for async operations

### UI Framework

- **Angular Material 20.2** - Material Design components
- **Angular CDK 20.2** - Component Dev Kit for custom components
- **SCSS** - Sass preprocessor for styling

### State Management

- **Angular Signals** - Modern reactive state management
- **RxJS Observables** - For async operations and streams
- **Custom Store Pattern** - Signal-based stores for global state

### HTTP & API

- **HttpClient** - Angular's built-in HTTP client
- **Functional Interceptors** - Auth and error interceptors
- **Type-safe API models** - Full TypeScript typing

### Development Tools

- **Angular CLI 20.3** - Project scaffolding and build tools
- **Karma + Jasmine** - Unit testing framework
- **Prettier** - Code formatting
- **ESLint** - Code linting (when configured)

## 🏗 Architecture

### Design Patterns

#### 1. **Standalone Components**

All components are standalone (default in Angular 20), eliminating the need for NgModules:

```typescript
@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, RouterLink], // Direct imports
  templateUrl: './dashboard.html',
})
export class DashboardComponent {}
```

#### 2. **Signal-Based State Management**

Using Angular Signals for reactive state:

```typescript
export class AuthStore {
  private _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user());
}
```

#### 3. **Functional Guards**

Modern functional route guards:

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return authService.isAuthenticated();
};
```

#### 4. **Dependency Injection with inject()**

Using the inject() function instead of constructor injection:

```typescript
export class UserService {
  private http = inject(HttpClient);
  private router = inject(Router);
}
```

#### 5. **Lazy Loading**

All feature routes are lazy-loaded for optimal performance:

```typescript
{
  path: 'dashboard',
  loadComponent: () => import('./dashboard').then(m => m.DashboardComponent)
}
```

### Architecture Layers

```
┌─────────────────────────────────────────────────┐
│               Presentation Layer                 │
│  (Components, Templates, Styles)                 │
│  - Smart Components (with state)                 │
│  - Presentational Components (stateless)         │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│              Application Layer                   │
│  (Services, Stores, Guards, Interceptors)        │
│  - Business Logic                                │
│  - State Management                              │
│  - Authentication & Authorization                │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│                 Data Layer                       │
│  (API Services, HTTP Client)                     │
│  - API Communication                             │
│  - Data Transformation                           │
│  - Error Handling                                │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│               Backend API                        │
│  (REST API - Spring Boot)                        │
└─────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                          # Application root
│   │   ├── app.ts                    # Root component
│   │   ├── app.config.ts             # Application configuration
│   │   ├── app.routes.ts             # Main routing configuration
│   │   ├── app.html                  # Root template
│   │   └── app.scss                  # Root styles
│   │
│   ├── components/                   # All UI components
│   │   ├── auth/                     # Authentication components
│   │   │   ├── login/                # Login component
│   │   │   └── register/             # Registration component
│   │   ├── dashboards/               # Role-based dashboards
│   │   │   ├── admin-dashboard/
│   │   │   ├── organisation-dashboard/
│   │   │   ├── recruiter-dashboard/
│   │   │   ├── interviewer-dashboard/
│   │   │   └── candidate-dashboard/
│   │   ├── interviews/               # Interview management
│   │   │   ├── interview-list/
│   │   │   ├── interview-detail/
│   │   │   └── interview-create/
│   │   ├── organisation/             # Organisation management
│   │   │   ├── org-list/
│   │   │   ├── org-profile/
│   │   │   └── org-register/
│   │   ├── users/                    # User management
│   │   │   ├── user-list/
│   │   │   └── user-invite/
│   │   ├── layout/                   # Layout components
│   │   │   └── main-layout/
│   │   ├── shared/                   # Shared/reusable components
│   │   │   └── toast-notification/
│   │   ├── header/                   # Header component
│   │   ├── footer/                   # Footer component
│   │   └── home/                     # Landing page
│   │
│   ├── services/                     # Business logic services
│   │   ├── auth/                     # Authentication service
│   │   ├── user/                     # User management service
│   │   ├── interview/                # Interview service
│   │   ├── invitation/               # Invitation service
│   │   ├── organisation/             # Organisation service
│   │   ├── notification/             # Notification service
│   │   └── file/                     # File upload service
│   │
│   ├── stores/                       # Signal-based state stores
│   │   ├── ui/                       # UI state (modals, theme, loading)
│   │   └── notification/             # Notification state
│   │
│   ├── guards/                       # Route guards
│   │   └── auth/                     # Auth guards
│   │       ├── auth.guard.ts         # Authentication guard
│   │       ├── guest.guard.ts        # Guest-only guard
│   │       └── role.guard.ts         # Role-based guard
│   │
│   ├── interceptors/                 # HTTP interceptors
│   │   ├── auth.interceptor.ts       # JWT token injection
│   │   └── error.interceptor.ts      # Global error handling
│   │
│   ├── models/                       # TypeScript interfaces
│   │   ├── user.model.ts             # User types
│   │   ├── interview.model.ts        # Interview types
│   │   ├── organisation.model.ts     # Organisation types
│   │   ├── invitation.model.ts       # Invitation types
│   │   ├── dashboard.model.ts        # Dashboard types
│   │   ├── auth.model.ts             # Auth types
│   │   ├── notification.model.ts     # Notification types
│   │   └── common.model.ts           # Common types
│   │
│   ├── constants/                    # Application constants
│   │   ├── routes.ts                 # Route paths
│   │   ├── roles.ts                  # User roles & permissions
│   │   ├── api-endpoints.ts          # API endpoint constants
│   │   ├── app-config.ts             # App configuration
│   │   └── statuses.ts               # Status constants
│   │
│   ├── environments/                 # Environment configurations
│   │   ├── environment.ts            # Development config
│   │   └── environment.prod.ts       # Production config
│   │
│   ├── styles/                       # Global styles
│   │   ├── _variables.scss           # SCSS variables
│   │   ├── _mixins.scss              # SCSS mixins
│   │   └── _theme.scss               # Material theme
│   │
│   ├── assets/                       # Static assets (images, icons)
│   ├── index.html                    # HTML entry point
│   ├── main.ts                       # Application bootstrap
│   └── styles.scss                   # Global styles entry
│
├── public/                           # Public static files
├── angular.json                      # Angular CLI configuration
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
└── README.md                         # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Angular CLI**: 20.x (installed globally)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd interview-assistant-app/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   Update `src/environments/environment.ts` with your backend API URL:

   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api/v1', // Your backend URL
     enableDebugMode: true,
   };
   ```

4. **Start development server**

   ```bash
   npm start
   ```

   Navigate to `http://localhost:4200/`. The app will automatically reload when you make changes.

### Quick Start Development

```bash
# Start dev server
npm start

# Start with production configuration
npm run start:prod

# Build for production
npm run build:prod

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Format code
npm run format

# Check formatting
npm run format:check
```

## 👥 User Roles & Permissions

### Role Hierarchy

```
┌─────────────────────────────────────────────────┐
│                     ADMIN                        │
│  (System Administrator - Highest Privileges)     │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│            ORGANISATION_ADMIN                    │
│     (Organisation Administrator)                 │
└──────────────────┬──────────────────────────────┘
                   │
       ┌───────────┴───────────┐
       │                       │
┌──────▼──────┐       ┌───────▼────────┐
│  RECRUITER  │       │  INTERVIEWER   │
└──────┬──────┘       └───────┬────────┘
       │                      │
       └───────────┬──────────┘
                   │
         ┌─────────▼─────────┐
         │    CANDIDATE      │
         └───────────────────┘
```

### 1. **ADMIN** (System Administrator)

**Permissions:**

- ✅ Verify/reject organisation registrations
- ✅ View and manage all organisations
- ✅ View and manage all users across organisations
- ✅ View all interviews system-wide
- ✅ Access system analytics and reports
- ✅ Delete users and organisations (soft delete)

**Dashboard Features:**

- Pending organisation verifications
- System-wide user statistics
- Interview analytics
- Organisation management
- User management

### 2. **ORGANISATION_ADMIN** (Organisation Administrator)

**Permissions:**

- ✅ Manage own organisation profile
- ✅ Invite recruiters and interviewers
- ✅ View all organisation users
- ✅ View all organisation interviews
- ✅ Create and manage interviews
- ✅ Make hiring decisions
- ✅ View all feedback within organisation

**Dashboard Features:**

- Organisation verification status
- Team overview (recruiters, interviewers)
- Interview pipeline
- Recent activities
- Pending verifications

### 3. **RECRUITER**

**Permissions:**

- ✅ Create and manage interviews
- ✅ Schedule interview rounds
- ✅ Assign interviewers to rounds
- ✅ Invite interviewers to organisation
- ✅ View candidate profiles
- ✅ View interviewer feedback
- ✅ Make round and final hiring decisions
- ✅ Cancel interviews

**Dashboard Features:**

- Active interviews
- Candidate pipeline
- Pending decisions
- Interview scheduling
- Interviewer availability

### 4. **INTERVIEWER**

**Permissions:**

- ✅ View assigned interviews
- ✅ Submit feedback for assigned rounds
- ✅ View feedback from other interviewers (same round)
- ✅ Manage availability calendar
- ✅ Accept/decline interview assignments

**Dashboard Features:**

- Upcoming interviews
- Pending feedback submissions
- Interview schedule
- Availability calendar
- Past interviews

### 5. **CANDIDATE**

**Permissions:**

- ✅ View interview invitations
- ✅ Accept/decline interview invitations
- ✅ View interview schedule and status
- ✅ Update own profile
- ✅ View interview history

**Dashboard Features:**

- Active interviews
- Interview invitations
- Interview schedule
- Application status
- Profile management

## 🗺 Routing Structure

### Public Routes (Unauthenticated)

```
/                          → Landing page
/login                     → User login
/register                  → User registration
/org-register              → Organisation registration
/forgot-password           → Forgot password (planned)
/reset-password            → Reset password (planned)
```

### Admin Routes

```
/admin/dashboard           → Admin dashboard
/admin/organisations       → Organisation list & verification
/admin/users               → User management
/admin/interviews          → System-wide interviews
/admin/analytics           → System analytics (planned)
```

### Organisation Admin Routes

```
/organisation/dashboard    → Organisation dashboard
/organisation/profile      → Organisation profile
/organisation/invite       → Invite users
/organisation/interviews   → Organisation interviews
/organisation/recruiters   → Recruiter management (planned)
/organisation/interviewers → Interviewer management (planned)
```

### Recruiter Routes

```
/recruiter/dashboard               → Recruiter dashboard
/recruiter/interviews              → Interview list
/recruiter/interviews/create       → Create interview
/recruiter/interviews/:id          → Interview details
/recruiter/interviews/:id/edit     → Edit interview (planned)
/recruiter/candidates              → Candidate list (planned)
/recruiter/analytics               → Analytics (planned)
```

### Interviewer Routes

```
/interviewer/dashboard                              → Interviewer dashboard
/interviewer/interviews                             → Assigned interviews
/interviewer/interviews/:id                         → Interview details
/interviewer/interviews/:id/rounds/:roundId/feedback → Submit feedback (planned)
/interviewer/availability                           → Availability management (planned)
/interviewer/calendar                               → Calendar view (planned)
```

### Candidate Routes

```
/candidate/dashboard        → Candidate dashboard
/candidate/interviews       → Interview list
/candidate/interviews/:id   → Interview details
/candidate/profile          → Profile management (planned)
```

### Shared Routes (All Authenticated Users)

```
/profile                    → User profile
/profile/edit               → Edit profile (planned)
/notifications              → Notifications (planned)
/invitations                → Invitation list (planned)
/invitations/:id            → Invitation details (planned)
```

## 🔄 State Management

### Signal-Based Stores

The application uses Angular Signals for state management:

#### UI Store

Manages global UI state:

- Modal visibility
- Loading states
- Theme preferences
- Mobile detection

```typescript
// Usage example
const uiStore = inject(UiStore);
const isLoading = uiStore.isLoading();
uiStore.setLoading(true);
```

#### Notification Store

Manages in-app notifications:

- Toast notifications
- Notification list
- Read/unread status

```typescript
// Usage example
const notificationStore = inject(NotificationStore);
notificationStore.success('Operation completed!');
notificationStore.error('An error occurred');
```

### Services with Signals

Services can expose signals for reactive state:

```typescript
export class AuthService {
  private _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this._currentUser());
}
```

## 🔒 Security

### Authentication Flow

1. **Login**: User submits credentials → Backend returns access token + refresh token
2. **Token Storage**: Tokens stored in localStorage (access_token, refresh_token)
3. **Request Interceptor**: Auth interceptor attaches token to all API requests
4. **Token Refresh**: When access token expires, refresh token used automatically
5. **Session Management**: Single session per user enforced by backend
6. **Logout**: Clears tokens and redirects to login

### Security Features

✅ **JWT Authentication**

- Short-lived access tokens (2 hours)
- Refresh tokens for automatic renewal (1 day)
- Secure token storage with httpOnly ready

✅ **CSRF Protection**

- Token-based authentication prevents CSRF attacks
- No session cookies used

✅ **XSS Protection**

- Content Security Policy (CSP) ready
- Strict TypeScript typing prevents injection
- Template sanitization by Angular

✅ **Authorization**

- Role-based access control (RBAC)
- Route guards prevent unauthorized access
- API-level permission checks

✅ **Input Validation**

- Form validation with reactive forms
- Type-safe API models
- Server-side validation enforcement

✅ **Error Handling**

- Sensitive information not exposed in errors
- Proper error logging
- User-friendly error messages

## 💻 Development Guidelines

### Angular 20 Best Practices

#### ✅ DO's

1. **Use standalone components** (default in Angular 20)

   ```typescript
   @Component({
     selector: 'app-example',
     imports: [CommonModule, MatButtonModule],
   })
   ```

2. **Use inject() function** for dependency injection

   ```typescript
   private http = inject(HttpClient);
   private router = inject(Router);
   ```

3. **Use signals** for reactive state

   ```typescript
   count = signal(0);
   doubleCount = computed(() => this.count() * 2);
   ```

4. **Use new control flow syntax**

   ```html
   @if (isVisible) {
   <div>Content</div>
   } @for (item of items; track item.id) {
   <div>{{ item.name }}</div>
   }
   ```

5. **Use class/style bindings** instead of ngClass/ngStyle
   ```html
   <div [class.active]="isActive" [style.color]="textColor"></div>
   ```

#### ❌ DON'Ts

1. ❌ Don't set `standalone: true` (it's default in Angular 20)
2. ❌ Don't use constructor injection (use `inject()` instead)
3. ❌ Don't use `*ngIf`, `*ngFor`, `*ngSwitch` (use `@if`, `@for`, `@switch`)
4. ❌ Don't use `ngClass` or `ngStyle` (use direct bindings)
5. ❌ Don't use `@Input()` / `@Output()` decorators (use `input()` / `output()` functions)
6. ❌ Don't use `mutate()` on signals (use `set()` or `update()`)

### Code Style

- **TypeScript**: Strict mode enabled, avoid `any` type
- **Formatting**: Use Prettier (run `npm run format`)
- **Naming**:
  - Components: PascalCase (e.g., `UserListComponent`)
  - Files: kebab-case (e.g., `user-list.component.ts`)
  - Services: PascalCase with Service suffix (e.g., `AuthService`)
  - Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **File Organization**: Group by feature, not by type

### Component Structure

```typescript
import { Component, inject, signal, computed } from '@angular/core';

@Component({
  selector: 'app-example',
  imports: [
    /* dependencies */
  ],
  templateUrl: './example.html',
  styleUrl: './example.scss',
})
export class ExampleComponent {
  // 1. Injected dependencies
  private service = inject(SomeService);

  // 2. Signals (state)
  protected data = signal<Data[]>([]);

  // 3. Computed values
  protected count = computed(() => this.data().length);

  // 4. Methods
  protected loadData(): void {
    // Implementation
  }
}
```

## 🏗 Build & Deployment

### Build Commands

```bash
# Development build
npm run build

# Production build (optimized)
npm run build:prod

# Production build with bundle analysis
npm run build:stats
npm run analyze

# Watch mode (rebuild on changes)
npm run watch
```

### Deployment

#### AWS S3 + CloudFront (Configured)

```bash
# Complete deployment pipeline
npm run deploy

# Or step by step:
npm run deploy:build       # Build production bundle
npm run deploy:s3          # Upload to S3
npm run deploy:invalidate  # Invalidate CloudFront cache
```

#### Environment Configuration

Update `src/environments/environment.prod.ts` for production:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com/api/v1',
  enableDebugMode: false,
  enableServiceWorker: true,
};
```

### Build Optimization

- **Lazy Loading**: All feature routes are lazy-loaded
- **Tree Shaking**: Unused code eliminated in production build
- **AOT Compilation**: Ahead-of-time compilation for faster rendering
- **Minification**: JavaScript and CSS minified
- **Bundle Splitting**: Automatic code splitting for optimal loading

## 🧪 Testing

### Unit Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Test Structure

```typescript
describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

### Testing Guidelines

- Write tests for all services and complex components
- Aim for >80% code coverage
- Mock external dependencies (HTTP, services)
- Test user interactions and edge cases
- Use TestBed for integration tests

## 📝 API Integration

### Backend Endpoints

The frontend integrates with a Spring Boot backend. Key endpoints:

```typescript
// Authentication
POST / api / v1 / auth / login;
POST / api / v1 / auth / register;
POST / api / v1 / auth / refresh;
POST / api / v1 / auth / logout;
POST / api / v1 / auth / forgot - password;
POST / api / v1 / auth / reset - password;

// Users
GET / api / v1 / users;
GET / api / v1 / users / { id };
PUT / api / v1 / users / { id };
DELETE / api / v1 / users / { id };
GET / api / v1 / users / me;
PUT / api / v1 / users / me;

// Organisations
POST / api / v1 / organisations / register;
GET / api / v1 / organisations;
GET / api / v1 / organisations / { id };
PUT / api / v1 / organisations / { id };
PUT / api / v1 / organisations / { id } / verify;
DELETE / api / v1 / organisations / { id };

// Interviews
POST / api / v1 / interviews;
GET / api / v1 / interviews;
GET / api / v1 / interviews / { id };
PUT / api / v1 / interviews / { id };
DELETE / api / v1 / interviews / { id };
POST / api / v1 / interviews / { id } / rounds;
PUT / api / v1 / interviews / { id } / rounds / { roundId };

// Invitations
POST / api / v1 / invitations / send;
GET / api / v1 / invitations;
PUT / api / v1 / invitations / { id } / accept;
PUT / api / v1 / invitations / { id } / decline;

// Dashboards
GET / api / v1 / dashboards / admin;
GET / api / v1 / dashboards / organisation;
GET / api / v1 / dashboards / recruiter;
GET / api / v1 / dashboards / interviewer;
GET / api / v1 / dashboards / candidate;

// Feedback
POST / api / v1 / feedback;
GET / api / v1 / feedback / interview / { id };
GET / api / v1 / feedback / round / { roundId };
```

Full API documentation: [Backend README](./public/backend-docs/backend_readme.md)

## 🚀 Future Enhancements

### Planned Features

- 🚧 **Real-Time Notifications**: WebSocket integration for live updates
- 🚧 **Advanced Analytics**: Charts and graphs for interview metrics
- 🚧 **Calendar Integration**: Google Calendar / Outlook sync
- 🚧 **Email Templates**: Customizable email templates
- 🚧 **Bulk Operations**: Bulk user invitations and management
- 🚧 **Export to CSV**: Export data for reporting
- 🚧 **Progressive Web App**: PWA support for mobile
- 🚧 **Breadcrumb Navigation**: Enhanced navigation experience
- 🚧 **Interview Recording**: Video interview integration
- 🚧 **AI-Powered Insights**: Interview feedback analysis

### Technical Improvements

- 🚧 Service Worker for offline support
- 🚧 Server-Side Rendering (SSR) with Angular Universal
- 🚧 Internationalization (i18n) support
- 🚧 A/B testing infrastructure
- 🚧 Enhanced error tracking (Sentry integration)
- 🚧 Performance monitoring
- 🚧 E2E testing with Playwright

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Follow the coding standards** outlined in this README
4. **Write tests** for new features
5. **Update documentation** as needed
6. **Format code**: `npm run format`
7. **Commit changes**: `git commit -m 'Add amazing feature'`
8. **Push to branch**: `git push origin feature/amazing-feature`
9. **Open a Pull Request**

### Code Review Process

- All PRs require review from at least one maintainer
- Tests must pass
- Code coverage should not decrease
- Follow Angular style guide and project conventions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Support

For questions or issues:

- **Email**: support@intervieworganiser.com
- **Documentation**: Check the `AGENT.md` files in each folder
- **Backend Docs**: See `public/backend-docs/` for API documentation

## 🙏 Acknowledgments

- Angular Team for the amazing framework
- Material Design Team for the UI components
- All contributors who help improve this project

---

**Built with ❤️ using Angular 20**

_Last Updated: November 19, 2025_
