# Interview Assistant App - Frontend

> A comprehensive Angular 20 application for streamlining the interview process for organizations, interviewers, and candidates. Built with modern Angular features including standalone components, signals, and zoneless change detection.

[![Angular](https://img.shields.io/badge/Angular-20.3.7-red.svg)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)
[![Material](https://img.shields.io/badge/Material-20.0+-purple.svg)](https://material.angular.io)

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Application Flow](#-application-flow)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Development](#-development)
- [Security](#-security)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)

---

## 🎯 Project Overview

The Interview Assistant App is a full-featured platform designed to streamline the entire interview lifecycle. It supports multiple user roles (Admin, Organization Admin, Interviewer, and Candidate) with role-based access control, real-time notifications, and comprehensive interview management.

### Key Capabilities

- **Multi-Role Support**: Admin, Organization, Interviewer, and Candidate dashboards
- **Interview Management**: Create, schedule, conduct, and provide feedback on interviews
- **Organization Management**: Register organizations with KYC verification
- **Authentication**: JWT authentication system
- **Notifications**: Email and SMS notifications for all interview lifecycle events
- **State Management**: Signal-based reactive state management
- **Role-Based Access Control**: Fine-grained permissions and route guards

---

## ✨ Features

### Completed Features ✅

#### 1. **Authentication & Authorization**

- ✅ JWT-based authentication with refresh token support
- ✅ Role-based access control (RBAC) with permission system
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

#### 9. **User Interface Components** (Complete)

- ✅ **Login Component**: JWT-based authentication with email/password, password visibility toggle, remember me, form validation
- ✅ **Header Component**: Dynamic navigation with profile menu, role-based links, user avatar with initials
- ✅ **Profile Component**: User profile management with role-specific fields, candidate profile updates
- ✅ **Home Component**: Landing page with role-based navigation
- ✅ **Footer Component**: Application footer with links

#### 10. **Profile Management**

- ✅ Personal information management (name, email, mobile)
- ✅ Candidate-specific fields (skills, experience, education)
- ✅ Profile avatar with user initials
- ✅ Form validation with error messages
- ✅ Security settings (password, 2FA placeholders)
- ✅ Account management

#### 11. **Registration Components** (All Complete)

- ✅ **Candidate Registration**: Multi-step with email & mobile OTP verification, reactive forms, password validation
- ✅ **Interviewer Registration**: Single-step with recruiter linking, department selection, expertise chips input
- ✅ **Organization Registration**: Multi-step with KYC upload, address details, admin setup

### Pending Features 🚧

- 🚧 **Real-time Updates**: WebSocket integration for live status updates
- 🚧 **Video Integration**: Zoom/Google Meet integration
- 🚧 **Analytics Dashboard**: Interview metrics and reports
- 🚧 **Export Reports**: PDF generation for interviews and feedback

---

## � Application Flow

### Complete User Journey

#### 1. **Landing Page → Registration**

```
Home Component → Registration Selection → Role-based Registration Form
```

**Flow Details**:

- User visits landing page (`/home`)
- Clicks "Register" → Directed to role selection
- Routes:
  - Organization: `/register/organisation` (✅ Complete)
  - Candidate: `/register/candidate` (✅ Complete)
  - Interviewer: `/register/interviewer` (✅ Complete)

#### 2. **Organization Registration Flow**

```
1. Basic Info → 2. Address → 3. KYC Upload → 4. Admin Setup → 5. OTP Verification → Pending Approval
```

**API Calls** (See [API.md](./API.md) for details):

1. `POST /organisations/register` - Submit registration
2. `POST /otp/send` - Send OTP to admin email
3. `POST /otp/verify` - Verify OTP
4. `POST /organisations/:id/kyc` - Upload KYC documents (PDF, images)

**State Changes**:

- Organization created with `verificationStatus: PENDING`
- Admin user account created
- Email notification sent to admin team
- Redirect to waiting page

#### 3. **Admin Approval Flow**

```
Admin Dashboard → Pending Organizations → Review KYC → Approve/Reject → Notification
```

**API Calls**:

1. `GET /organisations` - List pending organizations
2. `GET /organisations/:id` - View details and KYC
3. `PUT /organisations/:id/verify` - Approve organization
4. `PUT /organisations/:id/reject` - Reject with reason
5. `POST /notifications/email` - Send approval/rejection email

**State Changes**:

- `verificationStatus: VERIFIED` or `REJECTED`
- Organization can now login (if approved)
- Rejection reason stored in database

#### 4. **Login & Authentication**

```
Login Page → Credentials → Role Detection → Role-based Dashboard
```

**API Calls**:

1. `POST /auth/login` - Authenticate user
2. Response includes:
   - Access token (JWT, expires 1 hour)
   - Refresh token (expires 7 days)
   - User profile with role

**Auth Flow**:

- Store tokens in `AuthStore`
- Setup auto-refresh (5 min before expiry)
- Inject JWT in all API requests (via `AuthInterceptor`)
- Navigate based on role:
  - `ADMIN` → `/dashboard/admin`
  - `RECRUITER` → `/dashboard/organisation`
  - `INTERVIEWER` → `/dashboard/interviewer`
  - `CANDIDATE` → `/dashboard/candidate`

**Guards Applied**:

- All dashboards protected by `authGuard`
- Role-specific guards prevent cross-role access

#### 5. **Organization Admin Flow**

**Dashboard** (`/dashboard/organisation`):

- View metrics: Total interviews, active candidates, team size
- Quick actions: Create interview, invite interviewer
- Recent interviews list
- Team management

**Interview Creation** (`/interviews/create`):

```
Step 1: Basic Info → Step 2: Candidate Selection → Step 3: Interviewer Assignment → Step 4: Schedule → Submit
```

**API Calls**:

1. `GET /candidates` - Fetch candidate list
2. `GET /interviewers/organisation/:id` - Fetch interviewers
3. `POST /interviews/create` - Create interview
4. `POST /interviews/:id/invite` - Generate candidate invite link
5. `POST /notifications/email` - Send interview invitations

**Created Interview**:

- Status: `SCHEDULED`
- Email/SMS notifications sent to candidate and interviewers
- Calendar invites generated (TODO: backend)

#### 6. **Interviewer Registration & Assignment**

**Registration Flow**:

```
Direct Registration → Email/Mobile → Department & Expertise → Password → Submit
OR
Org Admin → Invite Interviewer → Email with Link → Register → Approval
```

**API Calls**:

1. `POST /interviewers/register` - Complete registration
2. `POST /interviewers/invite` - Send invitation email (optional)
3. `POST /otp/send` - Verify email (if needed)
4. `POST /otp/verify` - Confirm verification (if needed)

**Dashboard** (`/dashboard/interviewer`):

- View assigned interviews (today, upcoming, past)
- Filters: Status, type, date range
- Quick actions: Start interview, submit feedback

#### 7. **Interview Lifecycle**

```
SCHEDULED → IN_PROGRESS → COMPLETED → FEEDBACK → OUTCOME
```

**Before Interview**:

- **Reminders**: Automated emails 24h, 1h before (via `NotificationService`)
  - API: `POST /notifications/email` (type: `INTERVIEW_REMINDER`)
  - API: `POST /notifications/sms` (type: `INTERVIEW_REMINDER`)

**During Interview** (Interviewer actions):

- Navigate to `/interviews/:id`
- Click "Start Interview"
  - API: `PUT /interviews/:id/status` → Status: `IN_PROGRESS`
- Conduct interview (video call link in details)
- Click "Complete Interview"
  - API: `PUT /interviews/:id/status` → Status: `COMPLETED`

**After Interview** (Feedback submission):

- Navigate to `/interviews/:id/feedback`
- Fill feedback form:
  - Rating (1-5 stars)
  - Comments
  - Strengths (multi-select)
  - Weaknesses (multi-select)
  - Outcome: `SELECTED`, `SELECTED_NEXT_ROUND`, `REJECTED`, `ON_HOLD`, `PENDING`
- Submit:
  - API: `POST /interviews/:id/feedback`
  - Email notification to candidate (if outcome is `SELECTED` or `REJECTED`)

**Outcome Notifications**:

- Selected: `POST /notifications/email` (type: `CANDIDATE_SELECTED`)
- Rejected: `POST /notifications/email` (type: `CANDIDATE_REJECTED`)

#### 8. **Candidate Flow**

**Registration** (✅ Complete):

```
1. Basic Info → 2. OTP Verification (Email & Mobile) → 3. Submit → Login
```

**API Calls**:

1. `POST /candidates/register` - Initial registration
2. `POST /otp/send` - Send OTP to email and mobile
3. `POST /otp/verify` - Verify both email and mobile

**Dashboard** (`/dashboard/candidate`):

- Profile completion tracker (30% → 100%)
- Upcoming interviews
- Interview history
- Applications status

**Interview Invitation**:

- Receive email with interview link
- Click link → Redirect to `/interviews/:id`
- View interview details: Date, time, interviewers, location (video link)
- Add to personal calendar (TODO)

**Post-Interview**:

- Status visible in dashboard
- Receive outcome notification via email
- View feedback (if org allows)

#### 9. **Admin Dashboard Flow**

**System Monitoring** (`/dashboard/admin`):

- Platform metrics:
  - Total organizations (verified, pending, rejected)
  - Total users by role
  - Total interviews (by status)
  - System activity (last 24h)
- Organization approvals queue
- User management
- System settings

**Organization Approval**:

1. Click "Review" on pending org
2. View organization details + KYC documents
3. Download and verify documents:
   - Business License
   - Tax Certificate
   - Incorporation Certificate
   - Bank Statement
4. Decision:
   - **Approve**: `PUT /organisations/:id/verify`
   - **Reject**: `PUT /organisations/:id/reject` (with reason)
5. Auto-notification sent to org admin

#### 10. **State Management Flow**

**AuthStore**:

```
Login → Store User + Tokens → Auto Refresh → Logout → Clear Store
```

**Signal Updates**:

- `setUser()` - On login success
- `clearUser()` - On logout
- `isAuthenticated()` - Computed signal
- `hasPermission(perm)` - Permission checks

**NotificationStore**:

```
Service Call → Success/Error → Add Notification → Auto Dismiss (3s)
```

**Types**:

- `success`, `error`, `warning`, `info`
- Stack in top-right corner
- Auto-dismiss with countdown

**InterviewStore**:

```
Load Interviews → Apply Filters → Computed Filtered List → Update UI
```

**Filters**:

- Status: All, Scheduled, In Progress, Completed, Cancelled
- Type: All, Technical, HR, Managerial, Coding, Behavioral
- Date Range: Custom date picker
- Search: By title or candidate name

**UIStore**:

```
User Preferences → Dark/Light Theme → Sidebar Collapsed → Compact Mode
```

**Persisted** in localStorage:

- Theme preference
- Sidebar state
- View preferences (list/grid)

#### 11. **HTTP Interceptor Flow**

**Request Interceptor** (`AuthInterceptor`):

```
API Call → Check Auth Required → Inject JWT Token → Send Request
```

**Error Interceptor** (`ErrorInterceptor`):

```
API Error → Check Status Code → Handle Error → Show Notification → Return Error
```

**Error Handling**:

- `401` - Token expired → Auto refresh → Retry request
- `403` - Forbidden → Show error, redirect to dashboard
- `404` - Not found → Show error
- `500` - Server error → Show error with retry option

#### 12. **File Upload Flow**

**Component** (`FileUploadComponent`):

```
Select File → Validate → Show Preview → Upload with Progress → Success/Error
```

**Validation**:

- File type: PDF, JPEG, PNG only
- File size: Max 5MB
- Virus scan (backend TODO)

**API Call**:

- `POST /files/upload` (multipart/form-data)
- Response includes file URL (S3/Azure Blob)

**Use Cases**:

- Organization KYC documents
- Candidate resume
- Interview attachments

#### 13. **Real-time Updates** (🚧 TODO)

**Planned WebSocket Integration**:

```
Connect → Subscribe to Channels → Receive Updates → Update Store → UI Refresh
```

**Channels**:

- `interview.status.{interviewId}` - Interview status changes
- `interview.feedback.{interviewId}` - New feedback submitted
- `organisation.verified.{orgId}` - Organization approval
- `notification.{userId}` - Personal notifications

**Libraries** (Planned):

- `socket.io-client` or `@microsoft/signalr`
- Backend: Spring Boot WebSocket

---

## �🛠️ Technology Stack

### Frontend

- **Angular 20.3.7** - Standalone components, signals, zoneless change detection
- **TypeScript 5.7+** - Strict type checking
- **Angular Material 20** - UI components library
- **RxJS 7** - Reactive programming
- **SCSS** - Styling

### Backend (Planned)

- **Spring Boot 3.x** - REST API
- **MongoDB** - Database
- **JWT** - Authentication
- **SendGrid/AWS SES** - Email notifications
- **Twilio/AWS SNS** - SMS notifications
- **AWS S3/Azure Blob** - File storage

### Development Tools

- **Angular CLI 20.3.7** - Project scaffolding and build
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
│   │   │   ├── candidate/             # ✅ Candidate registration
│   │   │   └── interviewer/           # ✅ Interviewer registration
│   │   ├── shared/
│   │   │   ├── file-upload/           # ✅ Reusable file upload
│   │   │   └── otp-input/             # ✅ Reusable OTP input
│   │   ├── home/                      # ✅ Landing page
│   │   ├── login/                     # ✅ Login component
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
- Import only specific pipes/directives needed (e.g., `DatePipe`), NOT `CommonModule`

```typescript
@Component({
  selector: 'app-example',
  imports: [DatePipe, MatButtonModule],
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

## 🎨 Design System & Implementation Details

### Authentication Flow

#### Login Component Implementation

**Features**:

- Material Design login form with card layout
- Email/password authentication with JWT
- Form validation (email format, password minimum 8 characters)
- Password visibility toggle
- Remember me checkbox
- Loading state with spinner
- Error handling with user-friendly messages
- Links to registration pages (Organization, Interviewer, Candidate)
- Responsive design with gradient background

**API Integration**:

```typescript
POST /api/v1/auth/login
Request: { email: string, password: string }
Response: {
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
  user: User
}
```

**Technologies Used**:

- `ReactiveFormsModule` for form handling
- `MatCardModule`, `MatFormFieldModule`, `MatInputModule` for UI
- `MatButtonModule`, `MatIconModule` for interactions
- `MatProgressSpinnerModule` for loading state
- Signal-based state management

#### Header Component Implementation

**Features**:

- Dynamic navigation based on authentication state
- Profile avatar with user initials (generated from name)
- Dropdown menu with user info and actions
- Role-based navigation links
- Logout functionality
- Dashboard navigation by role
- Guest vs authenticated views
- Material Design menu with dividers

**Navigation Structure**:

**Guest Users**:

- Home
- Register Organisation
- Register Interviewer
- Register Candidate
- Login (button)

**Authenticated Users**:

- Home
- Dashboard (role-specific route)
- Interviews (for interviewers only)
- Profile Avatar Menu:
  - User info display (name, email, role)
  - Dashboard link
  - Profile link
  - Logout button

**Technologies Used**:

- `MatMenuModule` for dropdown
- `MatIconModule` for icons
- `MatButtonModule` for actions
- `MatTooltipModule` for hover info
- `MatDividerModule` for separators
- `AuthStore` for reactive authentication state

#### Profile Component Implementation

**Features**:

- User information display (name, email, role)
- Profile avatar with initial
- Editable profile fields (first name, last name, mobile)
- Candidate-specific fields (skills, experience, education)
- Form validation with error messages
- Save/Cancel actions
- Loading state during save
- Security section (password change, 2FA placeholders)
- Danger zone (account deletion placeholder)
- Role-based field display

**API Integration**:

```typescript
// For Candidates
PUT /api/v1/candidates/profile/update
Request: {
  firstName: string,
  lastName: string,
  mobile: string,
  skills: string[],
  experience: number,
  education: string
}

// For Other Roles
PUT /api/v1/users/{userId}/profile
Request: {
  firstName: string,
  lastName: string,
  mobile: string
}
```

### Color Scheme

**Primary Gradient**:

```scss
linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

**Header Gradient**:

```scss
linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%)
```

**Login Background**:

```scss
linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

### Typography

- **Headers**: 2rem (32px), weight 600
- **Body**: 1rem (16px), weight 400
- **Small Text**: 0.875rem (14px)

### Spacing

- **Container Padding**: 2rem
- **Card Padding**: 2rem
- **Gap Between Elements**: 1rem - 1.5rem
- **Margin**: 0.5rem - 2rem

### Responsive Design

**Breakpoints**:

- **Desktop**: > 1024px (full navigation)
- **Tablet**: 768px - 1024px (condensed navigation)
- **Mobile**: < 768px (minimal navigation, profile icon only)

**Mobile Optimizations**:

- Reduced padding and margins
- Smaller font sizes
- Hidden non-essential nav links
- Stackable profile cards
- Touch-friendly button sizes (44px minimum)

### Token Management

**Storage**:

- Access Token: `localStorage.getItem('access_token')`
- Refresh Token: `localStorage.getItem('refresh_token')`
- User Data: `localStorage.getItem('user_data')`

**Injection**:

- `authInterceptor` automatically adds token to all API requests
- Skips public endpoints (login, register, OTP)

**Refresh Flow**:

```typescript
POST /api/v1/auth/refresh
Request: { refreshToken: string }
Response: {
  accessToken: string,
  refreshToken: string,
  expiresIn: number
}
```

**Logout Flow**:

1. User clicks logout from header menu
2. POST /api/v1/auth/logout (optional backend call)
3. Clear tokens from localStorage
4. Clear AuthStore state
5. Navigate to /login

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
     - Uppercase, lowercase, number, special character (recommended)
   - Mobile number validation

### Security Best Practices

✅ **Implemented**:

- JWT token authentication with refresh mechanism
- HTTP-only token storage in localStorage
- Automatic token injection via interceptor
- Token refresh mechanism (5 min before expiry)
- Role-based access control with computed signals
- Route guards (auth, guest, role, permission)
- XSS protection (Angular's built-in sanitization)
- CSRF token support (ready for backend)
- Password validation (minimum 8 characters)
- Email format validation

🚧 **Pending Backend Implementation**:

- Two-Factor Authentication (2FA)
- Password strength meter
- Account lockout after failed login attempts
- Session timeout warnings
- Device management and trusted devices

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
};
```

**src/environments/environment.production.ts** (Production)

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.yourapp.com/v1',
};
```

### Deployment Checklist

- [ ] Update API base URL in constants
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

## 📖 API Documentation

For complete API reference including all endpoints, request/response structures, authentication, and error handling, see:

### **[API.md](./API.md)**

**API Documentation Includes**:

- 🔐 **Authentication Endpoints** - Login, logout, refresh token, verify token
- 🏢 **Organisation Management** - Register, verify, reject, KYC upload
- 👤 **Candidate Management** - Register, profile CRUD, verification
- 👨‍💼 **Interviewer Management** - Register, invite, assignments
- 📅 **Interview Management** - Create, update, delete, feedback, scheduling
- 📱 **OTP Verification** - Send, verify, resend with cooldown
- 📎 **File Management** - Upload, download, delete with validation
- 📧 **Notification Service** - Email/SMS notifications (11 types)
- 📦 **Common Structures** - Response formats, enums, pagination
- ⚠️ **Error Handling** - Error codes, status codes, validation errors

**API Base URL**: `http://localhost:8080/api/v1`

**Quick Links**:

- [Authentication](./API.md#-authentication)
- [Organisation APIs](./API.md#-organisation-management)
- [Interview APIs](./API.md#-interview-management)
- [Error Handling](./API.md#%EF%B8%8F-error-handling)

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

Last Updated: November 1, 2025
