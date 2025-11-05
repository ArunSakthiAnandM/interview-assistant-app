# Interview Organiser API Documentation

## Overview
The Interview Organiser API provides a comprehensive solution for managing the interview process, from candidate application to feedback collection. This RESTful API supports authentication, user management, candidate tracking, interviewer coordination, interview scheduling, and feedback management.

## Base URL
- **Local Development**: `http://localhost:8080/api/v1`
- **Production**: `https://api.intervieworganiser.com/v1`

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

## API Endpoints

### 1. Health Check
- **GET** `/health` - Check application health status

### 2. Authentication
- **POST** `/auth/register` - Register a new user
- **POST** `/auth/login` - Login and receive JWT tokens
- **POST** `/auth/refresh` - Refresh access token using refresh token
- **POST** `/auth/logout` - Logout user (requires authentication)

### 3. User Management
- **GET** `/users` - Get all users (with pagination and filtering)
- **GET** `/users/{userId}` - Get user by ID
- **PUT** `/users/{userId}` - Update user details
- **DELETE** `/users/{userId}` - Delete user

### 4. Candidate Management
- **GET** `/candidates` - Get all candidates (with pagination, filtering, and search)
- **POST** `/candidates` - Create new candidate
- **GET** `/candidates/{candidateId}` - Get candidate by ID
- **PUT** `/candidates/{candidateId}` - Update candidate details
- **DELETE** `/candidates/{candidateId}` - Delete candidate

### 5. Interviewer Management
- **GET** `/interviewers` - Get all interviewers (with pagination and filtering)
- **POST** `/interviewers` - Create new interviewer profile
- **GET** `/interviewers/{interviewerId}` - Get interviewer by ID
- **PUT** `/interviewers/{interviewerId}` - Update interviewer details
- **DELETE** `/interviewers/{interviewerId}` - Delete interviewer

### 6. Interview Management
- **GET** `/interviews` - Get all interviews (with pagination and filtering)
- **POST** `/interviews` - Schedule new interview
- **GET** `/interviews/{interviewId}` - Get interview by ID
- **PUT** `/interviews/{interviewId}` - Update interview details
- **DELETE** `/interviews/{interviewId}` - Cancel interview
- **PATCH** `/interviews/{interviewId}/status` - Update interview status

### 7. Feedback Management
- **GET** `/feedback` - Get all feedback (with pagination and filtering)
- **POST** `/feedback` - Submit new feedback
- **GET** `/feedback/{feedbackId}` - Get feedback by ID
- **PUT** `/feedback/{feedbackId}` - Update feedback
- **DELETE** `/feedback/{feedbackId}` - Delete feedback

## Data Models

### User Roles
- `ADMIN` - Full system access
- `RECRUITER` - Manage candidates and schedule interviews
- `INTERVIEWER` - Conduct interviews and provide feedback
- `CANDIDATE` - Limited access to own profile and interviews

### Candidate Status
- `APPLIED` - Initial application received
- `SCREENING` - Under screening review
- `INTERVIEW_SCHEDULED` - Interview scheduled
- `INTERVIEWED` - Interview completed
- `SELECTED` - Candidate selected
- `REJECTED` - Candidate rejected

### Interview Status
- `SCHEDULED` - Interview scheduled
- `IN_PROGRESS` - Interview in progress
- `COMPLETED` - Interview completed
- `CANCELLED` - Interview cancelled
- `RESCHEDULED` - Interview rescheduled

### Interview Types
- `TECHNICAL` - Technical skills assessment
- `HR` - HR and administrative interview
- `CULTURAL_FIT` - Cultural fit assessment
- `MANAGERIAL` - Management/leadership interview

### Feedback Recommendation
- `STRONG_HIRE` - Highly recommended
- `HIRE` - Recommended with confidence
- `HOLD` - Needs further consideration
- `NO_HIRE` - Not recommended

## Error Handling
All errors return a standard error response:
```json
{
  "error": "ERROR_TYPE",
  "message": "Detailed error message",
  "timestamp": "2025-11-01T10:30:00Z",
  "path": "/api/v1/resource"
}
```

### HTTP Status Codes
- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error

## Pagination
List endpoints support pagination with the following query parameters:
- `page` - Page number (default: 0)
- `size` - Page size (default: 10)

Response includes:
```json
{
  "content": [...],
  "page": 0,
  "size": 10,
  "totalElements": 100,
  "totalPages": 10
}
```

## Rate Limiting
API requests are rate-limited to prevent abuse:
- Authenticated users: 1000 requests per hour
- Unauthenticated users: 100 requests per hour

## Best Practices
1. Always include authentication token for protected endpoints
2. Use appropriate HTTP methods (GET for read, POST for create, PUT for update, DELETE for delete)
3. Handle pagination for list endpoints
4. Implement proper error handling on client side
5. Use HTTPS in production
6. Store refresh tokens securely
7. Implement token refresh logic before token expiration

## Example Workflows

### 1. User Registration and Login
```
1. POST /auth/register - Create account
2. POST /auth/login - Login and receive tokens
3. Use access token for subsequent requests
4. POST /auth/refresh - Refresh token when expired
```

### 2. Interview Scheduling Flow
```
1. POST /candidates - Create candidate profile
2. GET /interviewers?available=true - Find available interviewers
3. POST /interviews - Schedule interview
4. PATCH /interviews/{id}/status - Update status to IN_PROGRESS
5. POST /feedback - Submit feedback after interview
6. PATCH /interviews/{id}/status - Mark as COMPLETED
```

### 3. Candidate Management Flow
```
1. POST /candidates - Add new candidate
2. GET /candidates?status=APPLIED - View applied candidates
3. PUT /candidates/{id} - Update candidate status to SCREENING
4. POST /interviews - Schedule interviews
5. GET /feedback?candidateId={id} - Review feedback
6. PUT /candidates/{id} - Update final status (SELECTED/REJECTED)
```

## Security Considerations
- All passwords are hashed using bcrypt
- JWT tokens expire after 1 hour (access token) and 7 days (refresh token)
- Sensitive data is encrypted at rest
- API uses HTTPS in production
- CORS is configured for allowed origins
- Input validation on all endpoints
- SQL injection protection through MongoDB
- XSS protection enabled

## MongoDB Collections
The application uses the following MongoDB collections:
- `users` - User accounts
- `candidates` - Candidate profiles
- `interviewers` - Interviewer profiles
- `interviews` - Interview schedules
- `feedback` - Interview feedback
- `refresh_tokens` - Refresh token storage

## Support
For API support or questions:
- Email: support@intervieworganiser.com
- Documentation: https://docs.intervieworganiser.com
- Issue Tracker: https://github.com/intervieworganiser/api/issues

