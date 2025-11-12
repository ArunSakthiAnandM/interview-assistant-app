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

## API Endpoints (52 total)

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

### Interviewers (6)
- `GET /interviewers` - List interviewers
- `POST /interviewers` - Create interviewer
- `POST /interviewers/invite` - Invite interviewer
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

