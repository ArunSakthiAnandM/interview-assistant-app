# Interview Organiser Backend

A production-grade Spring Boot backend application for managing interview processes, from candidate invitations to feedback collection and decision-making.

[![Java](https://img.shields.io/badge/Java-25-orange.svg)](https://openjdk.java.net/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.7-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green.svg)](https://www.mongodb.com/)
[![Maven](https://img.shields.io/badge/Maven-Build-blue.svg)](https://maven.apache.org/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Database Schema](#database-schema)
- [Development Guide](#development-guide)
- [Testing](#testing)
- [Deployment](#deployment)
- [Monitoring](#monitoring)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

The Interview Organiser Backend is a comprehensive REST API service that streamlines the entire interview process. It provides role-based access control, interview scheduling, round management, feedback collection, and real-time notifications.

### Key Capabilities

- **Multi-tenant Organisation Management** - Support for multiple organisations with verification
- **Role-Based Access Control** - Five distinct user roles (Admin, Organisation Admin, Recruiter, Interviewer, Candidate)
- **Interview Lifecycle Management** - From creation to final decision
- **Dynamic Round Configuration** - Support for multiple interview rounds
- **Feedback System** - Structured feedback collection from interviewers
- **Invitation Management** - Email-based invitations with expiry
- **File Storage** - AWS S3 integration for resume and document storage
- **Real-time Notifications** - In-app notification system
- **Availability Management** - Interviewer availability tracking
- **Dashboard Analytics** - Role-specific dashboards with statistics

---

## ✨ Features

### Authentication & Authorization
- JWT-based authentication with access and refresh tokens
- Password reset functionality
- Role-based authorization (5 roles: ADMIN, ORGANISATION_ADMIN, RECRUITER, INTERVIEWER, CANDIDATE)
- Single session management per user

### Organisation Management
- Organisation registration and verification workflow
- KYC document upload and verification
- Organisation admin assignment
- Verification history tracking
- Organisation resubmission for rejected applications

### User Management
- User registration with role selection
- Profile management
- Resume upload for candidates
- Skills and experience tracking
- Organisation-based user filtering
- Advanced interviewer filtering (skills, experience, availability)

### Interview Management
- Create and manage interviews
- Multi-round interview support
- Dynamic round configuration
- Interview status tracking (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED)
- Candidate status tracking (INVITED, ACCEPTED, DECLINED, etc.)
- Interview search and filtering
- Pagination support for large datasets

### Round Management
- Add/update interview rounds
- Assign multiple interviewers per round
- Schedule rounds with date and time
- Round types: TECHNICAL, HR, MANAGERIAL, CULTURAL_FIT
- Round status tracking
- Decision making (PASS, FAIL, ON_HOLD)

### Feedback System
- Structured feedback submission by interviewers
- Rating system (1-10 scale)
- Recommendation tracking (STRONG_YES, YES, MAYBE, NO, STRONG_NO)
- Technical and cultural fit assessment
- Strengths and weaknesses documentation
- Feedback history for interviews

### Invitation System
- Email-based invitations for candidates and team members
- Configurable expiry periods
- Invitation status tracking (PENDING, ACCEPTED, DECLINED, EXPIRED)
- Invitation acceptance/decline workflow
- Bulk invitation support

### File Management
- AWS S3 integration for file storage
- Resume upload and management
- KYC document storage
- Pre-signed URL generation for secure file access
- File metadata tracking

### Notification System
- In-app notifications
- Real-time notification delivery
- Notification types: INTERVIEW_SCHEDULED, ROUND_UPDATED, FEEDBACK_RECEIVED, etc.
- Read/unread status tracking
- Auto-deletion of old notifications (30-day TTL)
- Notification action buttons

### Availability Management
- Interviewer availability slot management
- Date and time range specification
- Recurring availability patterns (DAILY, WEEKLY, WEEKDAYS, WEEKENDS)
- Availability conflict detection

### Dashboard & Analytics
- Role-specific dashboards
- Interview statistics (total, scheduled, completed, cancelled)
- User statistics by role
- Organisation verification statistics
- Recent activity tracking
- Upcoming interviews listing

### Search & Filtering
- Advanced search across interviews, users, organisations
- Multi-criteria filtering
- Pagination and sorting support
- Custom query parameters

---

## 🛠 Technology Stack

### Core Framework
- **Spring Boot 3.5.7** - Application framework
- **Java 25** - Programming language
- **Maven** - Build and dependency management

### Database
- **MongoDB** - NoSQL database for flexible schema
- **Spring Data MongoDB** - Data access abstraction

### Security
- **Spring Security 6.x** - Security framework
- **JWT (JJWT 0.12.3)** - JSON Web Token implementation
- **BCrypt** - Password hashing

### Cloud Services
- **AWS S3** - File storage
- **AWS SDK 2.21.0** - AWS integration

### Utilities
- **Lombok** - Boilerplate code reduction
- **Apache Commons Lang3 3.14.0** - Utility functions
- **Bean Validation (Jakarta)** - Input validation
- **SLF4J** - Logging framework

### DevOps & Monitoring
- **Spring Boot Actuator** - Health checks and monitoring
- **Maven Compiler Plugin** - Java compilation
- **Spring Boot Maven Plugin** - Application packaging

---

## 🏗 Architecture

### Layered Architecture

```
┌─────────────────────────────────────────────┐
│          Presentation Layer                 │
│    (REST Controllers, DTOs)                 │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│          Business Logic Layer               │
│    (Services, Business Rules)               │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│          Data Access Layer                  │
│    (Repositories, MongoDB)                  │
└─────────────────────────────────────────────┘
```

### Key Design Patterns

- **Dependency Injection** - Constructor-based injection throughout
- **Repository Pattern** - Data access abstraction
- **DTO Pattern** - Separation of API contracts from domain models
- **Service Layer Pattern** - Business logic encapsulation
- **Builder Pattern** - Object construction (via Lombok)
- **Strategy Pattern** - Various service implementations
- **Factory Pattern** - Entity creation and mapping

### Security Architecture

- JWT-based stateless authentication
- Role-based authorization with method-level security
- Custom authentication filter
- Global exception handling
- CORS configuration for frontend integration

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/interview/organiser/
│   │   │   ├── OrganiserApplication.java       # Main application class
│   │   │   ├── config/                         # Configuration classes
│   │   │   │   ├── AwsS3Config.java           # AWS S3 configuration
│   │   │   │   ├── AwsS3ConfigProperties.java # S3 properties binding
│   │   │   │   ├── CorsConfig.java            # CORS configuration
│   │   │   │   └── MongoConfig.java           # MongoDB configuration
│   │   │   ├── constants/                      # Application constants
│   │   │   │   ├── AppConstants.java          # General constants
│   │   │   │   ├── UserRole.java              # User role enum
│   │   │   │   ├── InterviewStatus.java       # Interview status enum
│   │   │   │   ├── CandidateStatus.java       # Candidate status enum
│   │   │   │   ├── InvitationStatus.java      # Invitation status enum
│   │   │   │   ├── VerificationStatus.java    # Organisation verification status
│   │   │   │   ├── NotificationType.java      # Notification types
│   │   │   │   └── ...                        # Other enums
│   │   │   ├── controller/                     # REST Controllers
│   │   │   │   ├── AuthController.java        # Authentication endpoints
│   │   │   │   ├── UserController.java        # User management
│   │   │   │   ├── OrganisationController.java # Organisation management
│   │   │   │   ├── InterviewController.java   # Interview management
│   │   │   │   ├── InvitationController.java  # Invitation management
│   │   │   │   ├── NotificationController.java # Notification management
│   │   │   │   ├── AvailabilityController.java # Availability management
│   │   │   │   ├── FileController.java        # File operations
│   │   │   │   ├── DashboardController.java   # Dashboard & analytics
│   │   │   │   └── HealthController.java      # Health check endpoints
│   │   │   ├── exception/                      # Exception handling
│   │   │   │   ├── GlobalExceptionHandler.java # Global exception handler
│   │   │   │   ├── ErrorResponse.java         # Error response model
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   ├── ResourceAlreadyExistsException.java
│   │   │   │   ├── UnauthorizedException.java
│   │   │   │   ├── InvalidOperationException.java
│   │   │   │   └── InvitationExpiredException.java
│   │   │   ├── model/                          # Domain models
│   │   │   │   ├── entity/                    # MongoDB entities
│   │   │   │   │   ├── User.java             # User entity
│   │   │   │   │   ├── Organisation.java     # Organisation entity
│   │   │   │   │   ├── Interview.java        # Interview entity
│   │   │   │   │   ├── InterviewRound.java   # Interview round sub-entity
│   │   │   │   │   ├── InterviewerFeedback.java # Feedback sub-entity
│   │   │   │   │   ├── Invitation.java       # Invitation entity
│   │   │   │   │   ├── Notification.java     # Notification entity
│   │   │   │   │   ├── AvailabilitySlot.java # Availability entity
│   │   │   │   │   ├── FileMetadata.java     # File metadata entity
│   │   │   │   │   └── VerificationHistory.java # Verification history
│   │   │   │   └── dto/                       # Data Transfer Objects
│   │   │   │       ├── request/              # Request DTOs
│   │   │   │       └── response/             # Response DTOs
│   │   │   ├── repository/                     # Data access layer
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── OrganisationRepository.java
│   │   │   │   ├── InterviewRepository.java
│   │   │   │   ├── InvitationRepository.java
│   │   │   │   ├── NotificationRepository.java
│   │   │   │   ├── AvailabilitySlotRepository.java
│   │   │   │   └── FileMetadataRepository.java
│   │   │   ├── security/                       # Security components
│   │   │   │   ├── SecurityConfig.java        # Security configuration
│   │   │   │   ├── JwtTokenProvider.java      # JWT token operations
│   │   │   │   ├── JwtAuthenticationFilter.java # JWT filter
│   │   │   │   └── JwtAuthenticationEntryPoint.java # Auth entry point
│   │   │   ├── service/                        # Business logic
│   │   │   │   ├── AuthService.java           # Authentication service
│   │   │   │   ├── UserService.java           # User service
│   │   │   │   ├── OrganisationService.java   # Organisation service
│   │   │   │   ├── InterviewService.java      # Interview service
│   │   │   │   ├── InvitationService.java     # Invitation service
│   │   │   │   ├── NotificationService.java   # Notification service
│   │   │   │   ├── AvailabilityService.java   # Availability service
│   │   │   │   ├── FileStorageService.java    # File storage service
│   │   │   │   ├── DashboardService.java      # Dashboard service
│   │   │   │   ├── UserFilterService.java     # User filtering service
│   │   │   │   └── impl/                      # Service implementations
│   │   │   ├── util/                           # Utility classes
│   │   │   │   ├── EntityMapper.java          # Entity to DTO mapper
│   │   │   │   ├── FileStorageUtil.java       # File storage utilities
│   │   │   │   └── SecurityUtil.java          # Security utilities
│   │   │   └── validation/                     # Custom validators
│   │   └── resources/
│   │       ├── application.properties          # Main configuration
│   │       └── application-local.properties    # Local profile config
│   └── test/                                   # Test classes
├── target/                                     # Build output
├── pom.xml                                     # Maven configuration
├── AGENT.md                                    # Agent guidelines
└── README.md                                   # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 25** or higher
- **Maven 3.8+**
- **MongoDB 6.0+** (running locally or remote instance)
- **AWS Account** (for S3 file storage) - Optional
- **IDE** (IntelliJ IDEA, Eclipse, or VS Code recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd interview-assistant-app/backend
   ```

2. **Verify Java version**
   ```bash
   java -version
   # Should show Java 25 or higher
   ```

3. **Install dependencies**
   ```bash
   mvn clean install
   ```

### Configuration

1. **Create local configuration file**
   
   Copy `application-local.properties` to customize local settings:
   ```bash
   cp src/main/resources/application-local.properties src/main/resources/application-local-custom.properties
   ```

2. **Configure MongoDB**
   
   Edit `application-local.properties`:
   ```properties
   spring.data.mongodb.uri=mongodb://localhost:27017/interview
   ```
   
   Or use environment variable:
   ```bash
   export SPRING_DATA_MONGODB_URI=mongodb://localhost:27017/interview
   ```

3. **Configure JWT Secret**
   
   Set a strong JWT secret (recommended for production):
   ```bash
   export JWT_SECRET=your-super-secret-key-min-256-bits
   ```

4. **Configure AWS S3 (Optional)**
   
   For file upload functionality:
   ```bash
   export AWS_S3_ACCESS_KEY=your-access-key
   export AWS_S3_SECRET_KEY=your-secret-key
   export AWS_S3_REGION=ap-south-1
   export AWS_S3_BUCKET_NAME=your-bucket-name
   ```

5. **Environment Variables Summary**
   
   | Variable | Description | Required | Default |
   |----------|-------------|----------|---------|
   | `PORT` | Server port | No | 8080 |
   | `ACTIVE_PROFILE` | Active Spring profile | No | local |
   | `SPRING_DATA_MONGODB_URI` | MongoDB connection string | Yes | mongodb://localhost:27017/interview |
   | `JWT_SECRET` | JWT signing key | Yes | jwt-secret (change in prod) |
   | `AWS_S3_ACCESS_KEY` | AWS access key | No | - |
   | `AWS_S3_SECRET_KEY` | AWS secret key | No | - |
   | `AWS_S3_REGION` | AWS region | No | ap-south-1 |
   | `AWS_S3_BUCKET_NAME` | S3 bucket name | No | interview-organiser |

### Running the Application

#### Using Maven
```bash
mvn spring-boot:run
```

#### Using executable JAR
```bash
mvn clean package
java -jar target/organiser-0.0.1-SNAPSHOT.jar
```

#### Using Maven with custom profile
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

#### Health Check
Once started, verify the application is running:
```bash
curl http://localhost:8080/api/v1/health
```

Expected response:
```json
{
  "status": "UP",
  "timestamp": "2025-11-19T12:00:00",
  "service": "Interview Organiser API",
  "version": "1.0.0"
}
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api/v1
```

### Authentication Endpoints

#### POST `/auth/login`
Login with email and password
```json
{
  "email": "user@example.com",
  "password": "Password@123"
}
```
**Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "expiresIn": 7200,
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "RECRUITER"
  }
}
```

#### POST `/auth/refresh`
Refresh access token
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### POST `/auth/logout`
Logout current user

#### POST `/auth/forgot-password`
Request password reset
```json
{
  "email": "user@example.com"
}
```

#### POST `/auth/reset-password`
Reset password with token
```json
{
  "resetToken": "token-from-email",
  "newPassword": "NewPassword@123"
}
```

### User Endpoints

#### POST `/users/register`
Register new user
```json
{
  "email": "user@example.com",
  "password": "Password@123",
  "name": "John Doe",
  "role": "CANDIDATE",
  "phoneNumber": "1234567890",
  "skills": "Java, Spring Boot",
  "experience": "5 years"
}
```

#### GET `/users/me`
Get current user profile
**Auth:** Required

#### GET `/users/{id}`
Get user by ID
**Auth:** Required

#### PUT `/users/{id}`
Update user profile
**Auth:** Required (own profile or ADMIN)

#### DELETE `/users/{id}`
Delete user (soft delete)
**Auth:** ADMIN only

#### GET `/users?page=0&size=10`
Get all users (paginated)
**Auth:** ADMIN only

#### GET `/users/role/{role}?page=0&size=10`
Get users by role
**Auth:** Required

#### GET `/users/organisation/{organisationId}?page=0&size=10`
Get users by organisation
**Auth:** Required

#### POST `/users/organisation/{organisationId}/interviewers/filter`
Filter interviewers by skills and availability
**Auth:** ORGANISATION_ADMIN, RECRUITER, ADMIN
```json
{
  "requiredSkills": ["Java", "Spring Boot"],
  "minimumExperience": 3,
  "date": "2025-12-01",
  "startTime": "10:00",
  "endTime": "12:00"
}
```

### Organisation Endpoints

#### POST `/organisations/register`
Register new organisation
```json
{
  "organisationName": "Tech Corp",
  "adminEmail": "admin@techcorp.com",
  "kycDocumentBase64": "base64-encoded-document"
}
```

#### GET `/organisations/{id}`
Get organisation by ID
**Auth:** Required

#### PUT `/organisations/{id}`
Update organisation
**Auth:** ADMIN or ORGANISATION_ADMIN

#### DELETE `/organisations/{id}`
Delete organisation
**Auth:** ADMIN only

#### PUT `/organisations/{id}/verify`
Verify organisation
**Auth:** ADMIN only
```json
{
  "status": "VERIFIED",
  "comments": "All documents verified"
}
```

#### GET `/organisations?page=0&size=10`
Get all organisations
**Auth:** ADMIN only

#### GET `/organisations/status/{status}?page=0&size=10`
Get organisations by verification status
**Auth:** ADMIN only

#### POST `/organisations/{id}/resubmit`
Resubmit organisation for verification
**Auth:** ADMIN or ORGANISATION_ADMIN

#### GET `/organisations/{id}/verification-history`
Get verification history
**Auth:** ADMIN or ORGANISATION_ADMIN

#### GET `/organisations/my`
Get current user's organisation
**Auth:** ORGANISATION_ADMIN, RECRUITER, INTERVIEWER

### Interview Endpoints

#### POST `/interviews`
Create new interview
**Auth:** ORGANISATION_ADMIN, RECRUITER
```json
{
  "jobPosition": "Senior Java Developer",
  "jobDescription": "Looking for experienced Java developer",
  "candidateEmail": "candidate@example.com",
  "organisationId": "org-id"
}
```

#### GET `/interviews/{id}`
Get interview by ID
**Auth:** Required

#### PUT `/interviews/{id}`
Update interview
**Auth:** ORGANISATION_ADMIN, RECRUITER

#### DELETE `/interviews/{id}`
Delete interview
**Auth:** ADMIN, ORGANISATION_ADMIN, RECRUITER

#### POST `/interviews/{id}/accept`
Accept interview invitation
**Auth:** CANDIDATE

#### POST `/interviews/{id}/decline`
Decline interview invitation
**Auth:** CANDIDATE

#### POST `/interviews/{interviewId}/rounds`
Add new round
**Auth:** ORGANISATION_ADMIN, RECRUITER
```json
{
  "roundNumber": 1,
  "roundType": "TECHNICAL",
  "scheduledDate": "2025-12-01T10:00:00",
  "interviewerIds": ["interviewer-id-1", "interviewer-id-2"],
  "meetingLink": "https://meet.google.com/abc-defg-hij"
}
```

#### PUT `/interviews/{interviewId}/rounds/{roundId}`
Update round
**Auth:** ORGANISATION_ADMIN, RECRUITER

#### POST `/interviews/{interviewId}/rounds/{roundId}/feedback`
Submit feedback
**Auth:** INTERVIEWER
```json
{
  "rating": 8,
  "technicalSkills": "Strong in Java and Spring",
  "communicationSkills": "Good communication",
  "recommendation": "YES",
  "strengths": "Quick learner, good problem solving",
  "weaknesses": "Needs improvement in system design"
}
```

#### POST `/interviews/{interviewId}/rounds/{roundId}/decision`
Make decision on round
**Auth:** ORGANISATION_ADMIN, RECRUITER
```json
{
  "decision": "PASS",
  "comments": "Good performance, proceed to next round"
}
```

#### GET `/interviews/organisation/{organisationId}?page=0&size=10`
Get interviews by organisation
**Auth:** ADMIN, ORGANISATION_ADMIN, RECRUITER

#### GET `/interviews/recruiter/{recruiterId}?page=0&size=10`
Get interviews by recruiter
**Auth:** ADMIN, RECRUITER

#### GET `/interviews/interviewer/{interviewerId}?page=0&size=10`
Get interviews by interviewer
**Auth:** ADMIN, INTERVIEWER

#### GET `/interviews/candidate/{candidateId}?page=0&size=10`
Get interviews by candidate
**Auth:** ADMIN, CANDIDATE

#### GET `/interviews/search?query=Java&status=SCHEDULED`
Search interviews
**Auth:** ADMIN, ORGANISATION_ADMIN, RECRUITER

#### POST `/interviews/{id}/cancel`
Cancel interview
**Auth:** ADMIN, ORGANISATION_ADMIN, RECRUITER
```json
{
  "reason": "Candidate withdrew application"
}
```

#### GET `/interviews/{id}/feedback-history`
Get feedback history
**Auth:** Required

### Invitation Endpoints

#### POST `/invitations`
Create invitation
**Auth:** ORGANISATION_ADMIN, RECRUITER, ADMIN
```json
{
  "email": "newuser@example.com",
  "organisationId": "org-id",
  "invitedRole": "INTERVIEWER",
  "expiryDays": 7
}
```

#### GET `/invitations/{id}`
Get invitation by ID

#### GET `/invitations/organisation/{organisationId}?page=0&size=10`
Get invitations by organisation
**Auth:** ADMIN, ORGANISATION_ADMIN, RECRUITER

#### POST `/invitations/{id}/accept`
Accept invitation

#### POST `/invitations/{id}/decline`
Decline invitation

#### DELETE `/invitations/{id}`
Delete invitation
**Auth:** ADMIN, ORGANISATION_ADMIN, RECRUITER

### Notification Endpoints

#### GET `/notifications/user/{userId}?page=0&size=20`
Get notifications for user
**Auth:** Required (own notifications or ADMIN)

#### GET `/notifications/{id}`
Get notification by ID
**Auth:** Required

#### PUT `/notifications/{id}/read`
Mark notification as read
**Auth:** Required

#### PUT `/notifications/user/{userId}/read-all`
Mark all notifications as read
**Auth:** Required

#### DELETE `/notifications/{id}`
Delete notification
**Auth:** Required

### Availability Endpoints

#### POST `/availability`
Create availability slot
**Auth:** INTERVIEWER
```json
{
  "date": "2025-12-01",
  "startTime": "09:00",
  "endTime": "17:00",
  "recurring": true,
  "recurringPattern": "WEEKDAYS"
}
```

#### GET `/availability/{id}`
Get availability by ID

#### PUT `/availability/{id}`
Update availability
**Auth:** INTERVIEWER

#### DELETE `/availability/{id}`
Delete availability
**Auth:** INTERVIEWER

#### GET `/availability/interviewer/{interviewerId}`
Get availability for interviewer

#### GET `/availability/date/{date}/interviewer/{interviewerId}`
Get availability for date

### File Endpoints

#### POST `/files/upload`
Upload file
**Auth:** Required
```json
{
  "fileBase64": "base64-encoded-file-content",
  "entityType": "RESUME",
  "entityId": "user-id"
}
```

#### GET `/files/{id}`
Get file metadata
**Auth:** Required

#### GET `/files/{id}/download`
Get pre-signed download URL
**Auth:** Required

#### DELETE `/files/{id}`
Delete file
**Auth:** Required

### Dashboard Endpoints

#### GET `/dashboard/admin`
Get admin dashboard statistics
**Auth:** ADMIN

#### GET `/dashboard/organisation/{organisationId}`
Get organisation dashboard
**Auth:** ORGANISATION_ADMIN, RECRUITER

#### GET `/dashboard/recruiter/{recruiterId}`
Get recruiter dashboard
**Auth:** RECRUITER

#### GET `/dashboard/interviewer/{interviewerId}`
Get interviewer dashboard
**Auth:** INTERVIEWER

#### GET `/dashboard/candidate/{candidateId}`
Get candidate dashboard
**Auth:** CANDIDATE

### Health Endpoints

#### GET `/health`
Basic health check (public)

#### GET `/health/detailed`
Detailed health information (public)

#### GET `/health/ping`
Simple ping endpoint (public)

#### GET `/health/ready`
Readiness probe (public)

#### GET `/health/live`
Liveness probe (public)

---

## 🔐 Security

### Authentication Flow

1. User sends credentials to `/auth/login`
2. Server validates credentials
3. Server generates JWT access token (2 hours) and refresh token (24 hours)
4. Client stores tokens securely
5. Client includes access token in `Authorization` header for subsequent requests
6. When access token expires, client uses refresh token to get new access token

### Authorization

Role-based access control with 5 roles:

| Role | Permissions |
|------|-------------|
| **ADMIN** | Full system access, manage all organisations and users |
| **ORGANISATION_ADMIN** | Manage organisation, verify members, view all org interviews |
| **RECRUITER** | Create interviews, manage rounds, view org interviews |
| **INTERVIEWER** | Submit feedback, view assigned interviews, manage availability |
| **CANDIDATE** | View own interviews, accept/decline invitations |

### Security Headers

Add JWT token to requests:
```
Authorization: Bearer <access-token>
```

### CORS Configuration

Allowed origins configured in `CorsConfig.java`:
- `http://localhost:4200` (Angular development)
- Production frontend URLs

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character

---

## 💾 Database Schema

### Collections

#### users
```javascript
{
  "_id": "ObjectId",
  "email": "string (unique)",
  "password": "string (hashed)",
  "name": "string",
  "phoneNumber": "string",
  "role": "enum",
  "organisationId": "string (ref)",
  "skills": "string",
  "experience": "string",
  "resumeUrl": "string",
  "refreshToken": "string",
  "deleted": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

#### organisations
```javascript
{
  "_id": "ObjectId",
  "name": "string",
  "adminEmail": "string",
  "adminUserId": "string",
  "kycDocumentUrl": "string",
  "verificationStatus": "enum",
  "verifiedBy": "string",
  "verifiedAt": "datetime",
  "verificationHistory": "array",
  "deleted": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

#### interviews
```javascript
{
  "_id": "ObjectId",
  "organisationId": "string",
  "jobPosition": "string",
  "jobDescription": "string",
  "candidateEmail": "string",
  "candidateUserId": "string",
  "candidateStatus": "enum",
  "overallStatus": "enum",
  "rounds": "array",
  "createdByUserId": "string",
  "deleted": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

#### notifications
```javascript
{
  "_id": "ObjectId",
  "userId": "string (indexed)",
  "type": "enum",
  "title": "string",
  "message": "string",
  "relatedEntityId": "string",
  "relatedEntityType": "string",
  "read": "boolean",
  "readAt": "datetime",
  "createdAt": "datetime (TTL index: 30 days)",
  "deleted": "boolean"
}
```

### Indexes

- `users.email` - Unique index
- `notifications.userId` - Index for fast user lookup
- `notifications.createdAt` - TTL index (30-day expiration)
- `organisations.adminEmail` - Unique index
- MongoDB auto-indexing enabled for `_id` fields

---

## 👨‍💻 Development Guide

### Code Structure Guidelines

#### Controllers
- Use `@RestController` and `@RequestMapping`
- Keep controllers thin - delegate to services
- Use DTOs for request/response
- Apply `@PreAuthorize` for authorization
- Always validate with `@Valid`

#### Services
- Define interface + implementation
- Use `@Transactional` for data modifications
- Handle business logic and validation
- Never expose entities directly

#### Repositories
- Extend `MongoRepository<Entity, String>`
- Use query methods following Spring Data conventions
- Add custom queries with `@Query` when needed

#### DTOs
- Separate request and response DTOs
- Use validation annotations
- Use Lombok for boilerplate

#### Entities
- Use `@Document` for MongoDB
- Include audit fields (createdAt, updatedAt)
- Use soft delete pattern

### Coding Standards

```java
// Good: Constructor injection
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
}

// Good: DTO pattern
@PostMapping
public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest request) {
    UserResponse response = userService.createUser(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
}

// Good: Exception handling
public User getUserById(String id) {
    return userRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
}
```

### Adding New Features

1. **Define Entity** (if needed) in `model/entity/`
2. **Create Repository** in `repository/`
3. **Define DTOs** in `model/dto/request/` and `model/dto/response/`
4. **Create Service** interface and implementation
5. **Create Controller** with REST endpoints
6. **Add Tests** (unit and integration)
7. **Update README.md** with new API endpoints

### Common Tasks

#### Add New Endpoint
1. Create request/response DTOs
2. Add method to service interface
3. Implement in service implementation
4. Add controller method
5. Test the endpoint

#### Add New Entity
1. Create entity class with `@Document`
2. Create repository interface
3. Add to `EntityMapper` if needed
4. Create service and controller

---

## 🧪 Testing

### Run All Tests
```bash
mvn test
```

### Run Specific Test Class
```bash
mvn test -Dtest=UserServiceImplTest
```

### Skip Tests During Build
```bash
mvn clean install -DskipTests
```

### Test Coverage
```bash
mvn clean test jacoco:report
```

### Testing Checklist

- [ ] Unit tests for service layer
- [ ] Integration tests for repositories
- [ ] Controller tests with MockMvc
- [ ] Security tests for authorization
- [ ] Validation tests for DTOs

---

## 🚢 Deployment

### Build Production JAR
```bash
mvn clean package -Pprod
```

### Environment Variables for Production

```bash
export SPRING_PROFILES_ACTIVE=prod
export SPRING_DATA_MONGODB_URI=mongodb://prod-server:27017/interview
export JWT_SECRET=<strong-secret-key>
export AWS_S3_ACCESS_KEY=<access-key>
export AWS_S3_SECRET_KEY=<secret-key>
export AWS_S3_REGION=ap-south-1
export AWS_S3_BUCKET_NAME=prod-bucket
```

### Run in Production
```bash
java -jar target/organiser-0.0.1-SNAPSHOT.jar
```

### Docker Deployment (Optional)

Create `Dockerfile`:
```dockerfile
FROM openjdk:25-jdk-slim
WORKDIR /app
COPY target/organiser-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Build and run:
```bash
docker build -t interview-organiser-backend .
docker run -p 8080:8080 -e SPRING_PROFILES_ACTIVE=prod interview-organiser-backend
```

---

## 📊 Monitoring

### Health Check Endpoints

- `/api/v1/health` - Basic health status
- `/api/v1/health/detailed` - Detailed health information
- `/api/v1/health/ready` - Kubernetes readiness probe
- `/api/v1/health/live` - Kubernetes liveness probe

### Spring Boot Actuator

Enabled endpoints:
- `/actuator/health` - Health status
- `/actuator/info` - Application information

### Logging

- Default log level: INFO
- Application log level: DEBUG
- Logs include timestamp, level, logger name, and message
- Configure log levels in `application.properties`

---

## 🤝 Contributing

### Branch Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat(interview): add round management functionality

- Add endpoints for creating and updating rounds
- Implement round decision workflow
- Add feedback submission for interviewers

Closes #123
```

### Pull Request Process

1. Create feature branch from `develop`
2. Implement feature with tests
3. Update documentation
4. Submit PR with description
5. Wait for code review
6. Address review comments
7. Merge after approval

---

## 📄 License

This project is proprietary and confidential.

---

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Contact the development team
- Check existing documentation

---

## 📝 Changelog

### Version 0.0.1-SNAPSHOT (Current)

#### Features
- ✅ User authentication and authorization
- ✅ Organisation management with verification
- ✅ Interview lifecycle management
- ✅ Multi-round interview support
- ✅ Feedback collection system
- ✅ Invitation management
- ✅ File storage with AWS S3
- ✅ In-app notifications
- ✅ Interviewer availability management
- ✅ Dashboard and analytics
- ✅ Health monitoring

#### Technical
- ✅ Spring Boot 3.5.7
- ✅ Java 25
- ✅ MongoDB integration
- ✅ JWT authentication
- ✅ Role-based authorization
- ✅ Global exception handling
- ✅ Comprehensive logging
- ✅ API documentation

---

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- MongoDB team for the flexible database
- JWT.io for JWT implementation guidance
- All contributors to this project

---

**Made with ❤️ by the Interview Organiser Team**

