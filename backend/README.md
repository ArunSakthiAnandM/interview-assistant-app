# Interview Organiser API

Spring Boot REST API for managing end-to-end interview processes.

## Technology Stack

- **Framework**: Spring Boot 3.5.7
- **Language**: Java 25
- **Database**: MongoDB
- **Security**: Spring Security + JWT
- **Build Tool**: Maven

## Quick Start

### Prerequisites
- Java 25+
- MongoDB 4.4+
- Maven 3.6+

### Installation

```bash
# Clone and navigate
cd backend

# Configure MongoDB (application.properties)
spring.data.mongodb.uri=mongodb://localhost:27017/interview_organiser

# Build and run
mvn clean install
mvn spring-boot:run
```

Application starts at: `http://localhost:8080/api/v1`

### Health Check
```bash
curl http://localhost:8080/api/v1/health
```

## Architecture

```
src/main/java/com/interview/organiser/
├── config/              # Security, CORS configuration
├── constants/enums/     # Enums (UserRole, InterviewStatus, etc.)
├── controller/          # REST endpoints (9 controllers)
├── exception/           # Global exception handling
├── model/
│   ├── entity/         # MongoDB entities
│   └── dto/            # Request/Response DTOs
├── repository/         # MongoDB repositories
├── security/           # JWT utilities
├── service/            # Business logic
│   └── impl/          # Service implementations
├── util/              # Helper classes
└── validation/        # Custom validators
```

## API Endpoints (53 total)

### Authentication (4)
- `POST /auth/register` - Register user
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - Logout

### Users (4)
- `GET /users` - List users (filterable by role)
- `GET /users/{id}` - Get user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

### Recruiters (8)
- `GET /recruiters` - List recruiters
- `POST /recruiters` - Create recruiter
- `GET /recruiters/{id}` - Get recruiter
- `PUT /recruiters/{id}` - Update recruiter
- `PUT /recruiters/{id}/verify` - Verify (Admin)
- `PUT /recruiters/{id}/unverify` - Unverify (Admin)
- `PUT /recruiters/{id}/reject` - Reject (Admin)
- `DELETE /recruiters/{id}` - Delete recruiter

### Candidates (7)
- `GET /candidates` - List candidates
- `POST /candidates` - Create candidate
- `GET /candidates/{id}` - Get candidate
- `PUT /candidates/{id}` - Update candidate
- `DELETE /candidates/{id}` - Delete candidate
- `POST /candidates/invite` - Send invitation
- `POST /candidates/invitation/respond` - Respond to invitation

### Interviewers (7)
- `GET /interviewers` - List interviewers
- `POST /interviewers` - Create interviewer
- `POST /interviewers/invite` - Invite interviewer
- `POST /interviewers/complete-registration` - Complete registration via invitation
- `GET /interviewers/{id}` - Get interviewer
- `PUT /interviewers/{id}` - Update interviewer
- `DELETE /interviewers/{id}` - Delete interviewer

### Interviews (10)
- `GET /interviews` - List interviews
- `POST /interviews` - Schedule interview
- `GET /interviews/{id}` - Get interview
- `PUT /interviews/{id}` - Update interview
- `PATCH /interviews/{id}/status` - Update status
- `POST /interviews/{id}/confirm` - Candidate confirms
- `POST /interviews/{id}/result` - Mark result
- `POST /interviews/{id}/next-round` - Create next round
- `POST /interviews/{id}/request-feedback` - Request feedback
- `DELETE /interviews/{id}` - Cancel interview

### Feedback (5)
- `GET /feedback` - List feedback
- `POST /feedback` - Submit feedback
- `GET /feedback/{id}` - Get feedback
- `PUT /feedback/{id}` - Update feedback
- `DELETE /feedback/{id}` - Delete feedback

### Dashboards (4)
- `GET /dashboard/admin` - Admin dashboard
- `GET /dashboard/recruiter/{id}` - Recruiter dashboard
- `GET /dashboard/interviewer/{id}` - Interviewer dashboard
- `GET /dashboard/candidate/{id}` - Candidate dashboard

### Health (1)
- `GET /health` - API health check

## Key Features

- **Multi-Role Support**: Users can have multiple roles (ADMIN, RECRUITER, INTERVIEWER, CANDIDATE)
- **Email Uniqueness**: Single account per email across system
- **Interview Lifecycle**: Schedule → Confirm → Complete → Result → Next Round
- **Mock Notifications**: Logged notifications ready for email/SMS integration
- **Invitation System**: Token-based invitations for interviewers and candidates
- **Dashboard Analytics**: Role-specific statistics and metrics
- **Pagination**: All list endpoints support pagination
- **Filtering**: Advanced filtering on most GET endpoints

## User Registration & Authentication Flow

### Overview
The system maintains a **single source of truth** for user authentication in the `users` collection. All user types (Recruiters, Interviewers, Candidates) must have a corresponding User account to login.

### Recruiter Registration Flow

**Step 1: Register Recruiter Organization**
```http
POST /recruiters
Content-Type: application/json

{
  "name": "Tech Corp",
  "registrationNumber": "REG12345",
  "contactEmail": "contact@techcorp.com",
  "contactPhone": "+1234567890",
  "website": "https://techcorp.com",
  "description": "Leading tech company",
  "adminFirstName": "John",
  "adminLastName": "Doe",
  "adminEmail": "john.doe@techcorp.com",
  "adminPassword": "SecurePass123!",
  "adminPhone": "+1234567890",
  "address": {
    "street": "123 Tech Street",
    "city": "San Francisco",
    "state": "CA",
    "country": "USA",
    "postalCode": "94102"
  }
}
```

**What happens:**
1. Creates a `Recruiter` entity in the `recruiters` collection
2. Creates an admin `User` account in the `users` collection with RECRUITER role
3. Links the recruiter to the admin user via `adminUserId` and `recruiterId`
4. User account is initially **inactive** (isActive: false)
5. Recruiter verification status is set to **PENDING**

**Step 2: Admin Verifies Recruiter**
```http
PUT /recruiters/{recruiterId}/verify
```

**What happens:**
1. Updates recruiter status to **VERIFIED**
2. **Activates the admin user account** (isActive: true)
3. Admin can now login

**Step 3: Admin Login**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john.doe@techcorp.com",
  "password": "SecurePass123!"
}
```

**Returns:**
- Access token (JWT)
- Refresh token
- User details with roles

### Interviewer Registration Flow

**Step 1: Recruiter Invites Interviewer**
```http
POST /interviewers/invite
Content-Type: application/json

{
  "email": "interviewer@techcorp.com",
  "recruiterId": "recruiter123"
}
```

**What happens:**
1. Creates an `Interviewer` entity with invitation token
2. Sends invitation email (mocked - logs to console)
3. Interviewer record is marked as **not registered** (isRegistered: false)

**Step 2: Interviewer Completes Registration**
```http
POST /interviewers/complete-registration
Content-Type: application/json

{
  "invitationToken": "uuid-token-from-email",
  "password": "SecurePass123!",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1234567890",
  "department": "Engineering",
  "expertise": ["Java", "Spring Boot", "System Design"],
  "yearsOfExperience": 5
}
```

**What happens:**
1. Validates invitation token
2. Creates a `User` account with INTERVIEWER role
3. Updates interviewer record with user reference
4. Marks interviewer as **registered** (isRegistered: true)
5. **Automatically logs in** - returns access token and refresh token

**Step 3: Subsequent Logins**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "interviewer@techcorp.com",
  "password": "SecurePass123!"
}
```

### Candidate Registration Flow

Candidates typically don't register themselves - they are invited by recruiters:

**Step 1: Recruiter Creates Candidate**
```http
POST /candidates
Content-Type: application/json

{
  "firstName": "Alice",
  "lastName": "Johnson",
  "email": "alice@example.com",
  "phone": "+1234567890",
  "position": "Senior Software Engineer",
  "experience": 5.5,
  "skills": ["Java", "Python", "AWS"],
  "recruiterId": "recruiter123"
}
```

**Step 2: Send Interview Invitation**
```http
POST /candidates/invite
Content-Type: application/json

{
  "candidateId": "candidate123",
  "interviewId": "interview123"
}
```

**Note:** Candidates currently don't have user accounts for login. They receive invitations via email/token for interview participation.

### Important Design Principles

1. **Single User Collection**: All authentication happens through the `users` collection
2. **Role-Based Access**: Users can have multiple roles in the `roles` Set field
3. **Entity Linking**: 
   - `User.recruiterId` → links to Recruiter entity
   - `Interviewer.user` → DBRef to User entity
   - `Recruiter.adminUserId` → links to admin User entity
4. **Verification Workflow**: Recruiters must be verified by admin before their accounts are activated
5. **Invitation System**: Interviewers complete registration via invitation tokens
6. **Email Uniqueness**: Each email can only have one user account across the entire system

## Enums

- **UserRole**: ADMIN, RECRUITER, INTERVIEWER, CANDIDATE
- **InterviewStatus**: SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, RESCHEDULED
- **InterviewType**: TECHNICAL, HR, CULTURAL_FIT, MANAGERIAL
- **InterviewResult**: SELECTED, REJECTED, NEXT_ROUND
- **CandidateStatus**: APPLIED, SCREENING, INTERVIEW_SCHEDULED, INTERVIEWED, SELECTED, REJECTED
- **VerificationStatus**: PENDING, VERIFIED, REJECTED
- **FeedbackRecommendation**: STRONG_HIRE, HIRE, HOLD, NO_HIRE

## Configuration

### application.properties
```properties
server.port=8080
server.servlet.context-path=/api/v1
spring.data.mongodb.uri=mongodb://localhost:27017/interview_organiser
```

### Environment Profiles
- **local**: Development mode (application-local.properties)
- **prod**: Production mode (application-prod.properties)

## Security

- JWT-based authentication
- Bearer token required for protected endpoints
- Role-based access control
- Password encryption with BCrypt

## Error Handling

Global exception handler returns consistent error responses:
```json
{
  "error": "ERROR_CODE",
  "message": "Error description",
  "timestamp": "2025-11-13T...",
  "path": "/api/v1/endpoint"
}
```

## Testing

```bash
# Run tests
mvn test

# Run with coverage
mvn clean test jacoco:report
```

## Deployment

```bash
# Build JAR
mvn clean package

# Run JAR
java -jar target/organiser-0.0.1-SNAPSHOT.jar

# With profile
java -jar -Dspring.profiles.active=prod target/organiser-0.0.1-SNAPSHOT.jar
```

## Documentation

- **API.md**: Complete API endpoint documentation
- **api.yaml**: OpenAPI 3.0 specification
- **Postman Collection**: Import for testing

## Support

For issues or questions, refer to the complete API documentation in `src/main/resources/API.md`.

