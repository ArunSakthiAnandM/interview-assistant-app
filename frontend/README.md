# Interview Assistant App - Frontend

> A comprehensive Angular 20 application for streamlining the interview process for organizations, interviewers, and candidates. Built with modern Angular features including standalone components, signals, and zoneless change detection.

[![Angular](https://img.shields.io/badge/Angular-20.3.4-red.svg)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)
[![Material](https://img.shields.io/badge/Material-20.0+-purple.svg)](https://material.angular.io)

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Development](#-development)
- [Security](#-security)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🎯 Project Overview

The Interview Assistant App is a full-featured platform designed to streamline the entire interview lifecycle. It supports multiple user roles (Admin, Organization Admin, Interviewer, and Candidate) with role-based access control, real-time notifications, and comprehensive interview management.

### Key Capabilities

- **Multi-Role Support**: Admin, Organization, Interviewer, and Candidate dashboards
- **Interview Management**: Create, schedule, conduct, and provide feedback on interviews
- **Organization Management**: Register organizations with KYC verification
- **Authentication**: Dual authentication system (Auth0 for candidates, JWT for organizations)
- **Notifications**: Email and SMS notifications for all interview lifecycle events
- **State Management**: Signal-based reactive state management
- **Role-Based Access Control**: Fine-grained permissions and route guards

---

## ✨ Features

### Completed Features ✅

#### 1. **Authentication & Authorization**

- ✅ JWT-based authentication with refresh token support
- ✅ Role-based access control (RBAC) with permission system
- ✅ Auth0 integration placeholders for candidates
- ✅ Route guards (auth, role, permission, guest)
- ✅ Automatic token injection via HTTP interceptors

#### 2. **Organization Management**

- ✅ Multi-step registration with KYC document upload
- ✅ Admin approval workflow
- ✅ Organization profile management

#### 3. **Core Services**

- ✅ **AuthService**: Login, logout, token management, role-based routing
- ✅ **OtpService**: Send, verify, resend OTP with countdown timer
- ✅ **FileUploadService**: Upload with validation & progress tracking
- ✅ **NotificationService**: Email/SMS notifications (11 types)
- ✅ **InterviewService**: Complete CRUD with lifecycle management
- ✅ **OrganizationService**: Registration and management
- ✅ **CandidateService**: Profile management

#### 4. **State Management**

- ✅ **AuthStore**: Centralized authentication state with computed signals
- ✅ **NotificationStore**: In-app notification management
- ✅ **InterviewStore**: Interview state with advanced filtering
- ✅ **UIStore**: UI preferences (theme, sidebar, compact mode)

#### 5. **HTTP Infrastructure**

- ✅ Auth interceptor for automatic JWT token injection
- ✅ Error interceptor for global error handling
- ✅ Proper error mapping and user notifications

#### 6. **Reusable Components**

- ✅ **FileUploadComponent**: Drag-and-drop with validation
- ✅ **OtpInputComponent**: 6-digit input with auto-focus

#### 7. **Dashboard Components** (All 4 Complete)

- ✅ **Admin Dashboard**: System overview, org approvals, activity feed
- ✅ **Organization Dashboard**: Metrics, interviews, team management
- ✅ **Interviewer Dashboard**: Assigned interviews with filters
- ✅ **Candidate Dashboard**: Applications, profile completion tracker

#### 8. **Interview Management** (All Components Complete)

- ✅ **Interview List**: Advanced filtering, list/grid views
- ✅ **Interview Create**: 4-step wizard with validation
- ✅ **Interview Detail**: Comprehensive detail view with actions
- ✅ **Interview Feedback**: Rating and feedback submission

#### 9. **Profile Management**

- ✅ Personal information management
- ✅ Security settings (password, 2FA)
- ✅ Account management

### Pending Features 🚧

- 🚧 **Candidate Registration**: Multi-step with OTP verification
- 🚧 **Interviewer Registration**: Linked to organizations
- 🚧 **Login Component**: Role-based login with Auth0 integration
- 🚧 **Real-time Updates**: WebSocket integration for live status updates
- 🚧 **Video Integration**: Zoom/Google Meet integration
- 🚧 **Analytics Dashboard**: Interview metrics and reports
- 🚧 **Export Reports**: PDF generation for interviews and feedback

---

## 🛠️ Technology Stack

### Frontend

- **Angular 20.3.4** - Standalone components, signals, zoneless change detection
- **TypeScript 5.7+** - Strict type checking
- **Angular Material 20** - UI components library
- **RxJS 7** - Reactive programming
- **SCSS** - Styling

### Backend (Planned)

- **Spring Boot 3.x** - REST API
- **MongoDB** - Database
- **Auth0** - Authentication for candidates
- **JWT** - Authentication for organizations/interviewers
- **SendGrid/AWS SES** - Email notifications
- **Twilio/AWS SNS** - SMS notifications
- **AWS S3/Azure Blob** - File storage

### Development Tools

- **Angular CLI 20.3.4** - Project scaffolding and build
- **ESLint** - Linting
- **Prettier** - Code formatting

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Angular CLI** 20.x

```bash
node --version  # v18.x or higher
npm --version   # v9.x or higher
```

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-org/interview-assistant-app.git
cd interview-assistant-app/frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment** (optional)

Create `src/environments/environment.development.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1',
  auth0: {
    domain: 'your-auth0-domain.auth0.com',
    clientId: 'your-auth0-client-id',
    audience: 'your-api-identifier',
  },
};
```

4. **Start development server**

```bash
npm start
# or
ng serve
```

5. **Open in browser**

```
http://localhost:4200
```

The application will automatically reload when you make changes.

### Quick Commands

```bash
# Development server
npm start                    # http://localhost:4200

# Build
npm run build               # Development build
npm run build:prod          # Production build

# Testing
npm test                    # Unit tests
npm run test:coverage       # Coverage report

# Linting
npm run lint                # Run ESLint
npm run lint:fix            # Fix linting issues

# Code generation
ng generate component my-component
ng generate service my-service
ng generate guard my-guard
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── app.config.ts              # Application configuration
│   │   ├── app.routes.ts              # Route definitions with guards
│   │   ├── app.ts                     # Root component
│   │   ├── app.html                   # Root template
│   │   └── app.scss                   # Root styles
│   │
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── admin/                 # ✅ Admin dashboard
│   │   │   ├── candidate/             # ✅ Candidate dashboard
│   │   │   ├── interviewer/           # ✅ Interviewer dashboard
│   │   │   └── organisation/          # ✅ Organization dashboard
│   │   ├── interview/
│   │   │   ├── interview-create.*     # ✅ Create interview wizard
│   │   │   ├── interview-detail.*     # ✅ Interview details
│   │   │   ├── interview-feedback.*   # ✅ Feedback form
│   │   │   └── interview-list.*       # ✅ Interview list with filters
│   │   ├── register/
│   │   │   ├── organisation/          # ✅ Organization registration
│   │   │   ├── candidate/             # 🚧 Candidate registration (TODO)
│   │   │   └── interviewer/           # 🚧 Interviewer registration (TODO)
│   │   ├── shared/
│   │   │   ├── file-upload/           # ✅ Reusable file upload
│   │   │   └── otp-input/             # ✅ Reusable OTP input
│   │   ├── home/                      # ✅ Landing page
│   │   ├── login/                     # 🚧 Login (TODO)
│   │   ├── profile/                   # ✅ User profile
│   │   ├── header/                    # ✅ Navigation header
│   │   └── footer/                    # ✅ Footer
│   │
│   ├── models/
│   │   ├── user.model.ts             # User types and roles
│   │   ├── organisation.model.ts     # Organization models
│   │   ├── candidate.model.ts        # Candidate models
│   │   ├── interviewer.model.ts      # Interviewer models
│   │   ├── interview.model.ts        # Interview models
│   │   ├── api-response.model.ts     # API wrappers
│   │   └── index.ts                  # Barrel exports
│   │
│   ├── services/
│   │   ├── auth.service.ts           # ✅ Authentication
│   │   ├── otp.service.ts            # ✅ OTP management
│   │   ├── file-upload.service.ts    # ✅ File uploads
│   │   ├── notification.service.ts   # ✅ Email/SMS notifications
│   │   ├── interview.service.ts      # ✅ Interview CRUD
│   │   ├── organisation.service.ts   # ✅ Organization management
│   │   ├── candidate.service.ts      # ✅ Candidate management
│   │   └── index.ts                  # Barrel exports
│   │
│   ├── store/
│   │   ├── auth.store.ts             # ✅ Auth state
│   │   ├── notification.store.ts     # ✅ Notification state
│   │   ├── interview.store.ts        # ✅ Interview state
│   │   ├── ui.store.ts               # ✅ UI preferences
│   │   └── index.ts                  # Barrel exports
│   │
│   ├── guards/
│   │   ├── auth.guard.ts             # ✅ Authentication guard
│   │   ├── role.guard.ts             # ✅ Role-based guards
│   │   ├── permission.guard.ts       # ✅ Permission guards
│   │   └── index.ts                  # Barrel exports
│   │
│   ├── constants/
│   │   ├── api.constants.ts          # API configuration
│   │   ├── app.constants.ts          # App constants
│   │   └── index.ts                  # Barrel exports
│   │
│   ├── utils/
│   │   ├── auth.interceptor.ts       # ✅ JWT interceptor
│   │   ├── error.interceptor.ts      # ✅ Error interceptor
│   │   └── index.ts                  # Barrel exports
│   │
│   ├── assets/                       # Static files
│   ├── index.html                    # Entry HTML
│   ├── main.ts                       # Application bootstrap
│   └── styles.scss                   # Global styles
│
├── angular.json                      # Angular CLI configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies
├── AGENT.md                          # AI agent guidelines
└── README.md                         # This file
```

---

## 🏗️ Architecture

### Angular 20 Best Practices

This project strictly follows Angular 20 modern patterns:

#### 1. **Standalone Components**

- All components are standalone (no NgModules)
- `standalone: true` is not explicitly set (default in Angular 20)

```typescript
@Component({
  selector: 'app-example',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './example.html',
})
export class ExampleComponent {}
```

#### 2. **Signal-Based Reactivity**

- Using `signal()` for component state
- Using `computed()` for derived state
- Using `effect()` for side effects

```typescript
export class MyComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);

  increment() {
    this.count.update((c) => c + 1);
  }
}
```

#### 3. **Modern Control Flow**

- Using `@if`, `@for`, `@switch` instead of `*ngIf`, `*ngFor`, `*ngSwitch`

```html
@if (isLoading()) {
<mat-spinner></mat-spinner>
} @else {
<div>Content</div>
} @for (item of items(); track item.id) {
<div>{{ item.name }}</div>
}
```

#### 4. **Dependency Injection with inject()**

- Using `inject()` function instead of constructor injection

```typescript
export class MyComponent {
  private service = inject(MyService);
  private router = inject(Router);
}
```

#### 5. **Input/Output Functions**

- Using `input()` and `output()` instead of decorators

```typescript
export class MyComponent {
  data = input<DataType>();
  required = input.required<string>();
  itemClicked = output<ItemType>();
}
```

### State Management Architecture

#### Store Pattern

All stores follow a consistent pattern:

```typescript
@Injectable({ providedIn: 'root' })
export class MyStore {
  // Private writable signals
  private _data = signal<Data[]>([]);

  // Public readonly signals
  readonly data = this._data.asReadonly();

  // Computed signals
  readonly count = computed(() => this._data().length);

  // Actions (methods that update state)
  setData(data: Data[]): void {
    this._data.set(data);
  }

  addItem(item: Data): void {
    this._data.update((items) => [...items, item]);
  }
}
```

#### Key Stores

1. **AuthStore** - Authentication state, user info, permissions
2. **NotificationStore** - Toast notifications with auto-dismiss
3. **InterviewStore** - Interview data with advanced filtering
4. **UIStore** - UI preferences (theme, sidebar, compact mode)

### Service Architecture

Services handle business logic and API communication:

```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  private http = inject(HttpClient);
  private store = inject(MyStore);

  getData(): Observable<Data[]> {
    return this.http.get<Data[]>('/api/data').pipe(
      tap((data) => this.store.setData(data)),
      catchError(this.handleError)
    );
  }
}
```

### Route Guards

#### Guard Types

1. **authGuard** - Requires authentication
2. **guestGuard** - Redirects authenticated users
3. **roleGuard(roles[])** - Requires specific roles
4. **permissionGuard(permission)** - Requires specific permission

#### Pre-configured Guards

- `adminGuard` - Admin only
- `orgAdminGuard` - Admin + Org Admin
- `interviewerGuard` - Admin + Org Admin + Interviewer
- `candidateGuard` - Candidate only
- `manageOrganisationsGuard` - Permission: manage:organisations
- `manageInterviewsGuard` - Permission: manage:interviews
- `viewCandidatesGuard` - Permission: view:candidates

#### Usage in Routes

```typescript
{
  path: 'dashboard/admin',
  canActivate: [authGuard, adminGuard],
  loadComponent: () => import('./admin-dashboard.ts')
}
```

---

## 💻 Development

### Code Scaffolding

Generate components, services, guards, etc:

```bash
# Generate component
ng generate component components/my-component

# Generate service
ng generate service services/my-service

# Generate guard
ng generate guard guards/my-guard

# Generate pipe
ng generate pipe pipes/my-pipe

# Generate directive
ng generate directive directives/my-directive
```

### Coding Standards

#### TypeScript

- Use strict type checking
- Avoid `any` type (use `unknown` when uncertain)
- Prefer type inference when obvious
- Use interfaces for data models

#### Components

- Keep components small and focused
- Use `OnPush` change detection
- Implement proper lifecycle hooks
- Extract reusable logic into services

#### Templates

- Use semantic HTML
- Implement accessibility features
- Keep templates simple
- Use proper ARIA attributes

#### Styling

- Use SCSS with nesting (max 3 levels)
- Follow BEM or consistent naming
- Use CSS custom properties for theming
- Keep styles component-scoped

### Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in headless mode
npm test -- --browsers=ChromeHeadless

# Run specific test file
npm test -- --include='**/auth.service.spec.ts'
```

### Linting

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

---

## 🔒 Security

### Implemented Security Features

1. **Authentication**

   - JWT token-based authentication
   - Refresh token rotation
   - Automatic token refresh
   - Token expiry handling

2. **Authorization**

   - Role-based access control (RBAC)
   - Fine-grained permission system
   - Route-level protection with guards
   - Component-level permission checks

3. **HTTP Security**

   - CORS configuration
   - JWT token injection via interceptor
   - Global error handling
   - Request/response validation

4. **File Upload Security**

   - File type validation (PDF, images only)
   - File size limits (5MB max)
   - Server-side validation required

5. **Input Validation**
   - Client-side form validation
   - Email format validation
   - Password strength requirements:
     - Minimum 8 characters
     - Uppercase, lowercase, number, special character
   - Mobile number validation

### Recommended Backend Security

1. **CSRF Protection**

   - Implement CSRF tokens for state-changing operations
   - Use SameSite cookies

2. **Rate Limiting**

   - OTP requests: 5 per 15 minutes
   - Login attempts: 5 per 15 minutes
   - API requests: Based on user tier

3. **File Upload**

   - Virus scanning before storage
   - Store files in AWS S3 with signed URLs
   - Metadata storage in MongoDB

4. **Data Protection**
   - Encrypt sensitive data at rest
   - Use HTTPS in production
   - Implement proper session management
   - Regular security audits

---

## 📦 Building & Deployment

### Development Build

```bash
npm run build
```

Output: `dist/frontend/`

### Production Build

```bash
npm run build:prod
# or
ng build --configuration production
```

Optimizations:

- AOT compilation
- Tree shaking
- Minification
- Source map generation (optional)
- Bundle budget checks

### Environment Configuration

Create environment files for different stages:

**src/environments/environment.ts** (Development)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1',
  auth0: {
    domain: 'dev-domain.auth0.com',
    clientId: 'dev-client-id',
    audience: 'dev-api-identifier',
  },
};
```

**src/environments/environment.production.ts** (Production)

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.yourapp.com/v1',
  auth0: {
    domain: 'prod-domain.auth0.com',
    clientId: 'prod-client-id',
    audience: 'prod-api-identifier',
  },
};
```

### Deployment Checklist

- [ ] Update API base URL in constants
- [ ] Configure Auth0 credentials
- [ ] Enable production mode
- [ ] Set up HTTPS
- [ ] Configure CORS on backend
- [ ] Set up CDN for assets
- [ ] Enable gzip compression
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure analytics
- [ ] Test all user flows
- [ ] Run security audit
- [ ] Check bundle size

### Deployment Platforms

#### Netlify

```bash
npm run build:prod
# Deploy dist/frontend folder
```

#### Vercel

```bash
npm run build:prod
# Deploy with vercel CLI
```

#### AWS S3 + CloudFront

```bash
npm run build:prod
aws s3 sync dist/frontend s3://your-bucket
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

#### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:prod

FROM nginx:alpine
COPY --from=build /app/dist/frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🤝 Contributing

### Development Workflow

1. **Create a feature branch**

```bash
git checkout -b feature/my-feature
```

2. **Make changes following coding standards**

   - Follow Angular 20 best practices
   - Use signals for state management
   - Add proper TypeScript types
   - Write meaningful commit messages

3. **Test your changes**

```bash
npm test
npm run lint
```

4. **Commit with conventional commits**

```bash
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
git commit -m "docs: update README"
```

5. **Push and create PR**

```bash
git push origin feature/my-feature
```

### Commit Convention

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Code Review Guidelines

- Ensure all tests pass
- Follow established patterns
- Maintain type safety
- Update documentation
- Add comments for complex logic

---

## 📚 Additional Resources

### Documentation

- [Angular Documentation](https://angular.dev)
- [Angular Material](https://material.angular.io)
- [RxJS Documentation](https://rxjs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Related Projects

- [Backend API](../backend) - Spring Boot backend (if available)
- [Architecture Docs](../architecture) - System architecture documentation

### Learning Resources

- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Angular Best Practices](https://angular.dev/best-practices)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

---

## 📞 Support

### Issues & Questions

- Check existing documentation
- Review TODO comments in code
- Check console for errors
- Verify backend API is running

### Contact

For project-specific questions, contact the development team.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎉 Acknowledgments

- Angular team for the amazing framework
- Material Design team for the UI components
- All contributors to this project

---

**Built with ❤️ using Angular 20**

Last Updated: October 26, 2025
