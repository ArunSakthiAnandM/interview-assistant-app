# Interview Assistant Frontend

A modern, scalable Angular 20 application for comprehensive interview management with multi-role support for Admins, Recruiters, Interviewers, and Candidates.

## 🚀 Features

### Multi-Role Support

- **Admin**: System administration, organization management, recruiter verification
- **Recruiter**: Organization management, interview creation, candidate management
- **Interviewer**: Conduct interviews, submit feedback, view assigned interviews
- **Candidate**: View interview invitations, participate in interviews, track status

### Core Functionality

- **Authentication & Authorization**: Secure JWT-based authentication with role-based access control
- **Interview Management**: Create, schedule, update, and cancel interviews
- **Real-time Notifications**: Toast notifications for user feedback
- **File Upload**: Support for resume, KYC documents with validation
- **OTP Verification**: Email and mobile verification during registration
- **Responsive Design**: Material Design UI with mobile-first approach
- **Context-aware Error Handling**: User-friendly error messages based on context

## 📋 Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Angular CLI**: v20.3.7 (installed globally)

```bash
npm install -g @angular/cli@20.3.7
```

## 🛠️ Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd interview-assistant-app/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment:

```bash
# Development environment (default)
# Edit src/environments/environment.development.ts
# API Base URL: http://localhost:8080/api/v1

# Production environment
# Edit src/environments/environment.ts
```

## 🏃‍♂️ Running the Application

### Development Server

```bash
npm start
# or
npm run start:dev
```

Navigate to `http://localhost:4200/`. The application will automatically reload on file changes.

### Production Build

```bash
npm run build:prod
```

Build artifacts will be stored in the `dist/` directory.

### Run Tests

```bash
npm test
```

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── app/                          # Root application module
│   │   ├── app.config.ts            # Application configuration
│   │   ├── app.routes.ts            # Route definitions
│   │   └── app.ts                   # Root component
│   │
│   ├── components/                   # Feature components
│   │   ├── dashboard/               # Role-specific dashboards
│   │   │   ├── admin/              # Admin dashboard
│   │   │   ├── recruiter/          # Recruiter dashboard
│   │   │   ├── interviewer/        # Interviewer dashboard
│   │   │   └── candidate/          # Candidate dashboard
│   │   ├── interview/               # Interview management
│   │   │   ├── interview-list.ts   # List all interviews
│   │   │   ├── interview-create.ts # Create new interview
│   │   │   ├── interview-detail.ts # Interview details
│   │   │   └── interview-feedback.ts # Submit feedback
│   │   ├── register/                # Registration flows
│   │   │   ├── recruiter/          # Recruiter registration with KYC
│   │   │   ├── interviewer/        # Interviewer registration
│   │   │   └── candidate/          # Candidate registration
│   │   ├── shared/                  # Reusable components
│   │   │   ├── file-upload/        # File upload component
│   │   │   └── otp-input/          # OTP input component
│   │   ├── home/                    # Landing page
│   │   ├── login/                   # Login component
│   │   ├── profile/                 # User profile
│   │   ├── header/                  # App header
│   │   └── footer/                  # App footer
│   │
│   ├── services/                     # Business logic & API calls
│   │   ├── auth.service.ts          # Authentication
│   │   ├── interview.service.ts     # Interview operations
│   │   ├── recruiter.service.ts     # Recruiter management
│   │   ├── interviewer.service.ts   # Interviewer operations
│   │   ├── candidate.service.ts     # Candidate management
│   │   ├── otp.service.ts          # OTP verification
│   │   ├── file-upload.service.ts   # File handling
│   │   └── notification.service.ts  # Email/SMS notifications
│   │
│   ├── store/                        # Signal-based state management
│   │   ├── auth.store.ts            # Authentication state
│   │   ├── interview.store.ts       # Interview state
│   │   ├── notification.store.ts    # Toast notifications
│   │   └── ui.store.ts             # UI state
│   │
│   ├── guards/                       # Route guards
│   │   ├── auth.guard.ts            # Authentication guard
│   │   ├── role.guard.ts            # Role-based guards
│   │   └── permission.guard.ts      # Permission guards
│   │
│   ├── models/                       # TypeScript interfaces
│   │   ├── user.model.ts            # User types
│   │   ├── interview.model.ts       # Interview types
│   │   ├── recruiter.model.ts       # Recruiter types
│   │   ├── interviewer.model.ts     # Interviewer types
│   │   ├── candidate.model.ts       # Candidate types
│   │   └── api-response.model.ts    # API response types
│   │
│   ├── utils/                        # HTTP interceptors
│   │   ├── auth.interceptor.ts      # JWT token injection
│   │   └── error.interceptor.ts     # Global error handling
│   │
│   ├── constants/                    # Application constants
│   │   ├── api.constants.ts         # API endpoints & error messages
│   │   └── app.constants.ts         # App-wide constants
│   │
│   ├── styles/                       # Global styles
│   │   ├── _variables.scss          # SCSS variables
│   │   └── _dashboard-shared.scss   # Shared dashboard styles
│   │
│   └── environments/                 # Environment configurations
│       ├── environment.development.ts
│       └── environment.ts
│
├── public/                           # Static assets
├── angular.json                      # Angular workspace config
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
└── README.md                         # This file
```

## 🔐 Authentication & Authorization

### JWT Token Flow

1. User logs in with credentials
2. Backend returns `accessToken` and `refreshToken`
3. Tokens stored in localStorage
4. `authInterceptor` automatically injects token in HTTP headers
5. `errorInterceptor` handles 401 errors and redirects to login

### Role-Based Access Control

- Route guards protect endpoints based on user role
- Computed signals in `AuthStore` for permission checks
- Guards: `authGuard`, `adminGuard`, `recruiterGuard`, `interviewerGuard`, `candidateGuard`

### Protected Routes

```typescript
// Admin only
/dashboard/admin → [authGuard, adminGuard]

// Recruiter only
/dashboard/recruiter → [authGuard, recruiterGuard]
/interviews/create → [authGuard, recruiterGuard]

// Interviewer only
/dashboard/interviewer → [authGuard, interviewerGuard]
/interviews/:id/feedback → [authGuard, canManageInterviewsGuard]

// Candidate only
/dashboard/candidate → [authGuard, candidateGuard]

// Authenticated users
/interviews → [authGuard, canViewInterviewsGuard]
/profile → [authGuard]
```

## 🎨 Angular 20 Modern Patterns

### Standalone Components (Default)

All components are standalone by default in Angular 20. No `NgModule` required.

```typescript
@Component({
  selector: 'app-example',
  imports: [DatePipe, MatButtonModule], // Import specific dependencies
  changeDetection: ChangeDetectionStrategy.OnPush,
  // standalone: true is DEFAULT - don't set it
})
export class ExampleComponent {}
```

### Signal-Based State Management

```typescript
// Store pattern
private _data = signal<Data[]>([]);
readonly data = this._data.asReadonly(); // Expose as readonly
readonly count = computed(() => this._data().length);

// Update signals immutably
this._data.set([...items, newItem]);
this._data.update(items => [...items, newItem]);
```

### Modern Template Syntax

```html
<!-- Use @if, @for, @switch (NOT *ngIf, *ngFor) -->
@if (condition()) {
<div>Content</div>
} @for (item of items(); track item.id) {
<div>{{ item.name }}</div>
} @switch (status()) { @case ('active') { <span>Active</span> } @case ('inactive') {
<span>Inactive</span> } }
```

### Dependency Injection with inject()

```typescript
// Use inject() function (NOT constructor injection)
export class MyComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
}
```

### Input/Output Functions

```typescript
// Use input() and output() functions (NOT decorators)
export class MyComponent {
  data = input<DataType>(); // NOT @Input()
  itemClicked = output<ItemType>(); // NOT @Output()
}
```

### Functional Guards

```typescript
// Use CanActivateFn (NOT class-based guards)
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return authService.isAuthenticated();
};
```

## 🛡️ Error Handling

### Global Error Interceptor

Automatically handles all HTTP errors with context-aware messages:

```typescript
// Status code specific handling
401 on /auth/login → "Invalid email or password"
401 on other endpoints → "Your session has expired"
403 → "You don't have permission"
404 on /interviews → "Interview not found"
500 → "Server error. Please try again later"
503 → "Service temporarily unavailable"
```

### Error Message Categories

- **Network**: Connection issues, timeouts
- **Authentication**: Invalid credentials, session expired
- **Authorization**: Permission denied, forbidden access
- **Server**: Internal errors, service unavailable
- **Validation**: Invalid input, missing fields
- **Resources**: Not found, already exists, conflicts
- **Rate Limiting**: Too many requests
- **Files**: Upload errors, size/type validation
- **OTP**: Expired, invalid, max attempts exceeded

### Automatic Notifications

All errors trigger toast notifications via `NotificationStore`. No need for service-level error handling.

## 📡 API Integration

### Base URL

Development: `http://localhost:8080/api/v1`

### Key Endpoints

#### Authentication

- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token

#### Recruiters

- `POST /recruiters` - Register recruiter (with KYC)
- `GET /recruiters` - List recruiters
- `PUT /recruiters/:id/verify` - Verify recruiter (Admin)
- `PUT /recruiters/:id/reject` - Reject recruiter (Admin)

#### Interviewers

- `POST /interviewers` - Register interviewer
- `POST /interviewers/invite` - Invite interviewer
- `GET /interviewers` - List interviewers

#### Candidates

- `POST /candidates` - Register candidate
- `POST /candidates/invite` - Invite candidate
- `POST /candidates/invitation/respond` - Accept/reject invitation

#### Interviews

- `POST /interviews` - Create interview
- `GET /interviews` - List interviews
- `GET /interviews/:id` - Get interview details
- `PUT /interviews/:id` - Update interview
- `PUT /interviews/:id/status` - Update status
- `POST /interviews/:id/confirm` - Confirm interview
- `POST /interviews/:id/result` - Submit result
- `DELETE /interviews/:id` - Cancel interview

#### OTP

- `POST /otp/send` - Send OTP (email/mobile)
- `POST /otp/verify` - Verify OTP

#### Files

- `POST /files/upload` - Upload file
- `DELETE /files/:id` - Delete file

## 🎯 State Management

### Stores

#### AuthStore

- Current user data
- Authentication status
- Role-based computed signals
- Token management

#### InterviewStore

- Interview list
- Filters (status, date range, search)
- Selected interview
- Loading states

#### NotificationStore

- Toast notification queue
- Auto-dismiss after 5 seconds
- Success, error, info, warning types

#### UIStore

- Sidebar state
- Loading indicators
- Theme preferences

## 🧪 Testing

### Unit Tests

All components and services have `.spec.ts` files for unit testing.

```bash
npm test
```

### Test Configuration

- Framework: Jasmine
- Runner: Karma
- Coverage: karma-coverage

## 📦 Build Configuration

### Development Build

- Source maps enabled
- No optimization
- Fast rebuild

### Production Build

- Minification & uglification
- Tree shaking
- AOT compilation
- Output hashing for cache busting
- Bundle budgets:
  - Initial: 600KB (warning), 1MB (error)
  - Component styles: 6KB (warning), 10KB (error)

## 🔧 Configuration Files

### tsconfig.json

- TypeScript 5.9.2
- Strict mode enabled
- ES2022 target

### angular.json

- Application builder
- SCSS support
- Budget monitoring

### package.json

- Angular 20.3.7
- Material 20.2.8
- RxJS 7.8.0

## 🚦 Development Guidelines

### Component Creation

```bash
ng generate component components/my-feature
```

**Checklist:**

- ✅ Use `changeDetection: OnPush`
- ✅ Import only needed pipes/directives
- ✅ Use `inject()` for dependencies
- ✅ Use signals for local state
- ✅ Use `input()` and `output()` functions
- ✅ Use new template syntax (@if, @for, @switch)

### Service Creation

```bash
ng generate service services/my-service
```

**Checklist:**

- ✅ Use `@Injectable({ providedIn: 'root' })`
- ✅ Use `inject()` for dependencies
- ✅ Return data directly (no ApiResponse wrapper)
- ✅ Let error interceptor handle notifications

### Route Addition

Add to `src/app/app.routes.ts`:

```typescript
{
  path: 'new-feature',
  canActivate: [authGuard, roleGuard],
  loadComponent: () => import('./new-feature').then(m => m.NewFeature)
}
```

## 🎨 Material Design

### Imports

Import specific Material modules per component:

```typescript
imports: [
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  MatTableModule,
];
```

### Common Components

- Forms: `MatFormField`, `MatInput`, `MatSelect`
- Layout: `MatCard`, `MatToolbar`, `MatSidenav`
- Navigation: `MatMenu`, `MatTabs`
- Data: `MatTable`, `MatPaginator`, `MatSort`
- Feedback: `MatSnackBar`, `MatProgressSpinner`

## 📝 Code Style

### Prettier Configuration

```json
{
  "printWidth": 100,
  "singleQuote": true,
  "parser": "angular" // for HTML files
}
```

### Naming Conventions

- Components: PascalCase (`InterviewList`)
- Services: PascalCase with suffix (`AuthService`)
- Guards: camelCase with suffix (`authGuard`)
- Stores: PascalCase with suffix (`AuthStore`)
- Interfaces: PascalCase (`User`, `Interview`)
- Constants: UPPER_SNAKE_CASE (`API_ENDPOINTS`)

## 🔍 Debugging

### Common Issues

**Problem**: "Property is private and only accessible within class"

- **Solution**: Use `protected` for template-accessible properties

**Problem**: "\*ngIf is not a known directive"

- **Solution**: Use `@if` syntax (Angular 20)

**Problem**: "Can't bind to 'ngModel'"

- **Solution**: Import `FormsModule` in component imports

**Problem**: Token not sent in requests

- **Solution**: Check `authInterceptor` and localStorage `access_token`

## 🚀 Deployment

### Production Checklist

- ✅ Update environment.ts with production API URL
- ✅ Run `npm run build:prod`
- ✅ Test build output in `dist/` directory
- ✅ Configure server for SPA routing (redirect to index.html)
- ✅ Enable HTTPS
- ✅ Configure CORS on backend

### Server Configuration (Nginx)

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 📚 Additional Resources

- [Angular Documentation](https://angular.dev)
- [Angular Material](https://material.angular.io)
- [RxJS Documentation](https://rxjs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Create a feature branch
2. Follow Angular 20 patterns (see guidelines above)
3. Write unit tests
4. Run linting: `npm run lint`
5. Create pull request

## 📄 License

[Your License Here]

## 👥 Team

[Your Team Information]

---

**Version**: 0.0.0  
**Last Updated**: November 2025  
**Angular Version**: 20.3.7
