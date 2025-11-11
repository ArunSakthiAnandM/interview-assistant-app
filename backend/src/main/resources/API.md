# Interview Organiser API Documentation

## Overview

The Interview Organiser API provides a comprehensive solution for managing the complete interview process, from candidate application to feedback collection. This RESTful API supports authentication, user management, candidate tracking, interviewer coordination, interview scheduling, and feedback management.

## Base URL

- **Local Development**: `http://localhost:8080/api/v1`
- **Production**: `https://api.intervieworganiser.com/api/v1`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

## User Roles

The system supports four user roles:

- **ADMIN** - Full system access and administrative capabilities
- **RECRUITER** - Manage candidates, schedule interviews, point of contact for organizations
- **INTERVIEWER** - Conduct interviews and provide feedback
- **CANDIDATE** - Limited access to own profile and interviews

---

## API Endpoints

### 1. Health Check

#### Check API Health Status

```http
GET /health
```

**Response:**
```json
{
  "status": "UP",
  "timestamp": "2025-11-11T10:30:00",
  "message": "Interview Organiser API is running"
}
```

---

### 2. Authentication

#### Register User

```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "RECRUITER"
}
```

**Response (201 Created):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "RECRUITER",
    "isActive": true
  }
}
```

#### Login

```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "RECRUITER"
  }
}
```

#### Refresh Token

```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

#### Logout

```http
POST /auth/logout
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Logout successful",
  "timestamp": "2025-11-11T10:30:00"
}
```

---

### 3. User Management

#### Get All Users

```http
GET /users?role=RECRUITER&page=0&size=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `role` (optional): Filter by user role (ADMIN, RECRUITER, INTERVIEWER, CANDIDATE)
- `page` (default: 0): Page number
- `size` (default: 10): Page size

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "role": "RECRUITER",
      "isActive": true,
      "createdAt": "2025-11-11T10:30:00",
      "updatedAt": "2025-11-11T10:30:00"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 25,
  "totalPages": 3
}
```

#### Get User by ID

```http
GET /users/{userId}
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "RECRUITER",
  "isActive": true,
  "createdAt": "2025-11-11T10:30:00",
  "updatedAt": "2025-11-11T10:30:00"
}
```

#### Update User

```http
PUT /users/{userId}
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "isActive": true
}
```

**Response (200 OK):**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "RECRUITER",
  "isActive": true,
  "updatedAt": "2025-11-11T11:00:00"
}
```

#### Delete User

```http
DELETE /users/{userId}
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "User deleted successfully",
  "timestamp": "2025-11-11T10:30:00"
}
```

---

### 4. Recruiter Management

#### Get All Recruiters

```http
GET /recruiters?status=VERIFIED&isActive=true&page=0&size=10
```

**Query Parameters:**
- `status` (optional): Filter by verification status (PENDING, VERIFIED, REJECTED)
- `isActive` (optional): Filter by active status
- `page` (default: 0): Page number
- `size` (default: 10): Page size

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": "recruiter_id",
      "name": "Tech Solutions Inc.",
      "registrationNumber": "REG123456",
      "address": {
        "street": "123 Main St",
        "city": "San Francisco",
        "state": "CA",
        "country": "USA",
        "postalCode": "94105"
      },
      "contactEmail": "contact@techsolutions.com",
      "contactPhone": "+1234567890",
      "website": "https://techsolutions.com",
      "description": "Leading tech recruiting firm",
      "verificationStatus": "VERIFIED",
      "adminUserId": "admin_user_id",
      "isActive": true,
      "createdAt": "2025-11-11T10:30:00",
      "updatedAt": "2025-11-11T10:30:00"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 15,
  "totalPages": 2
}
```

#### Create Recruiter

```http
POST /recruiters
```

**Request Body:**
```json
{
  "name": "Tech Solutions Inc.",
  "registrationNumber": "REG123456",
  "address": {
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "country": "USA",
    "postalCode": "94105"
  },
  "contactEmail": "contact@techsolutions.com",
  "contactPhone": "+1234567890",
  "website": "https://techsolutions.com",
  "description": "Leading tech recruiting firm"
}
```

**Response (201 Created):**
```json
{
  "id": "recruiter_id",
  "name": "Tech Solutions Inc.",
  "verificationStatus": "PENDING",
  "isActive": false,
  "createdAt": "2025-11-11T10:30:00"
}
```

#### Get Recruiter by ID

```http
GET /recruiters/{recruiterId}
```

#### Update Recruiter

```http
PUT /recruiters/{recruiterId}
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Tech Solutions Inc.",
  "contactEmail": "newcontact@techsolutions.com",
  "contactPhone": "+1234567890",
  "website": "https://techsolutions.com",
  "description": "Updated description"
}
```

#### Verify Recruiter

```http
PUT /recruiters/{recruiterId}/verify
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": "recruiter_id",
  "name": "Tech Solutions Inc.",
  "verificationStatus": "VERIFIED",
  "isActive": true,
  "updatedAt": "2025-11-11T11:00:00"
}
```

#### Reject Recruiter

```http
PUT /recruiters/{recruiterId}/reject?reason=Incomplete+documentation
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": "recruiter_id",
  "verificationStatus": "REJECTED",
  "isActive": false,
  "updatedAt": "2025-11-11T11:00:00"
}
```

#### Delete Recruiter

```http
DELETE /recruiters/{recruiterId}
Authorization: Bearer <token>
```

---

### 5. Candidate Management

#### Get All Candidates

```http
GET /candidates?status=APPLIED&search=developer&page=0&size=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by candidate status (APPLIED, SCREENING, INTERVIEW_SCHEDULED, INTERVIEWED, SELECTED, REJECTED)
- `search` (optional): Search by name, email, or skills
- `page` (default: 0): Page number
- `size` (default: 10): Page size

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": "candidate_id",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "phone": "+1234567890",
      "position": "Senior Software Engineer",
      "experience": 5.5,
      "skills": ["Java", "Spring Boot", "MongoDB", "React"],
      "resumeUrl": "https://example.com/resumes/jane_smith.pdf",
      "linkedinUrl": "https://linkedin.com/in/janesmith",
      "githubUrl": "https://github.com/janesmith",
      "status": "APPLIED",
      "createdAt": "2025-11-11T10:30:00",
      "updatedAt": "2025-11-11T10:30:00"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 50,
  "totalPages": 5
}
```

#### Create Candidate

```http
POST /candidates
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phone": "+1234567890",
  "position": "Senior Software Engineer",
  "experience": 5.5,
  "skills": ["Java", "Spring Boot", "MongoDB", "React"],
  "resumeUrl": "https://example.com/resumes/jane_smith.pdf",
  "linkedinUrl": "https://linkedin.com/in/janesmith",
  "githubUrl": "https://github.com/janesmith",
  "recruiterId": "recruiter_id"
}
```

**Response (201 Created):**
```json
{
  "id": "candidate_id",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "status": "APPLIED",
  "createdAt": "2025-11-11T10:30:00"
}
```

#### Get Candidate by ID

```http
GET /candidates/{candidateId}
Authorization: Bearer <token>
```

#### Update Candidate

```http
PUT /candidates/{candidateId}
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "phone": "+1234567890",
  "position": "Lead Software Engineer",
  "experience": 6.0,
  "skills": ["Java", "Spring Boot", "MongoDB", "React", "Kubernetes"],
  "status": "SCREENING"
}
```

#### Delete Candidate

```http
DELETE /candidates/{candidateId}
Authorization: Bearer <token>
```

#### Invite Candidate

```http
POST /candidates/invite
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "candidateId": "candidate_id"
}
```

**Response (200 OK):**
```json
{
  "message": "Invitation sent successfully to jane.smith@example.com",
  "timestamp": "2025-11-11T10:30:00"
}
```

#### Respond to Invitation

```http
POST /candidates/invitation/respond
```

**Request Body:**
```json
{
  "token": "invitation_token_here",
  "response": "ACCEPT"
}
```

**Response (200 OK):**
```json
{
  "message": "Invitation accepted successfully",
  "timestamp": "2025-11-11T10:30:00"
}
```

---

### 6. Interviewer Management

#### Get All Interviewers

```http
GET /interviewers?expertise=Java&available=true&page=0&size=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `expertise` (optional): Filter by expertise/skill
- `available` (optional): Filter by availability
- `page` (default: 0): Page number
- `size` (default: 10): Page size

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": "interviewer_id",
      "userId": "user_id",
      "expertise": ["Java", "Spring Boot", "Microservices"],
      "experienceYears": 10,
      "department": "Engineering",
      "available": true,
      "maxInterviewsPerDay": 3,
      "createdAt": "2025-11-11T10:30:00",
      "updatedAt": "2025-11-11T10:30:00"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 20,
  "totalPages": 2
}
```

#### Create Interviewer

```http
POST /interviewers
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "userId": "user_id",
  "expertise": ["Java", "Spring Boot", "Microservices"],
  "experienceYears": 10,
  "department": "Engineering",
  "available": true,
  "maxInterviewsPerDay": 3
}
```

**Response (201 Created):**
```json
{
  "id": "interviewer_id",
  "userId": "user_id",
  "expertise": ["Java", "Spring Boot", "Microservices"],
  "available": true,
  "createdAt": "2025-11-11T10:30:00"
}
```

#### Get Interviewer by ID

```http
GET /interviewers/{interviewerId}
Authorization: Bearer <token>
```

#### Update Interviewer

```http
PUT /interviewers/{interviewerId}
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "expertise": ["Java", "Spring Boot", "Microservices", "Cloud"],
  "available": false,
  "maxInterviewsPerDay": 2
}
```

#### Delete Interviewer

```http
DELETE /interviewers/{interviewerId}
Authorization: Bearer <token>
```

---

### 7. Interview Management

#### Get All Interviews

```http
GET /interviews?status=SCHEDULED&candidateId=candidate_id&page=0&size=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by status (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, RESCHEDULED)
- `candidateId` (optional): Filter by candidate
- `interviewerId` (optional): Filter by interviewer
- `fromDate` (optional): Filter from date (ISO 8601 format)
- `toDate` (optional): Filter to date (ISO 8601 format)
- `page` (default: 0): Page number
- `size` (default: 10): Page size

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": "interview_id",
      "candidate": {
        "id": "candidate_id",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane.smith@example.com"
      },
      "interviewer": {
        "id": "interviewer_id",
        "expertise": ["Java", "Spring Boot"]
      },
      "scheduledAt": "2025-11-15T14:00:00",
      "duration": 60,
      "interviewType": "TECHNICAL",
      "round": 1,
      "status": "SCHEDULED",
      "meetingLink": "https://meet.google.com/abc-defg-hij",
      "notes": "Technical round focusing on Java and Spring Boot",
      "createdAt": "2025-11-11T10:30:00",
      "updatedAt": "2025-11-11T10:30:00"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 35,
  "totalPages": 4
}
```

#### Schedule Interview

```http
POST /interviews
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "recruiterId": "recruiter_id",
  "candidateId": "candidate_id",
  "interviewerIds": ["interviewer_id_1", "interviewer_id_2"],
  "scheduledAt": "2025-11-15T14:00:00",
  "duration": 60,
  "interviewType": "TECHNICAL",
  "round": 1,
  "meetingLink": "https://meet.google.com/abc-defg-hij",
  "notes": "Technical round focusing on Java, Spring Boot, and system design"
}
```

**Response (201 Created):**
```json
{
  "id": "interview_id",
  "scheduledAt": "2025-11-15T14:00:00",
  "status": "SCHEDULED",
  "createdAt": "2025-11-11T10:30:00"
}
```

#### Get Interview by ID

```http
GET /interviews/{interviewId}
Authorization: Bearer <token>
```

#### Update Interview

```http
PUT /interviews/{interviewId}
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "scheduledAt": "2025-11-15T15:00:00",
  "duration": 90,
  "meetingLink": "https://meet.google.com/new-link",
  "notes": "Updated notes"
}
```

#### Update Interview Status

```http
PATCH /interviews/{interviewId}/status
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "COMPLETED"
}
```

**Response (200 OK):**
```json
{
  "id": "interview_id",
  "status": "COMPLETED",
  "updatedAt": "2025-11-15T15:00:00"
}
```

#### Cancel Interview

```http
DELETE /interviews/{interviewId}
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Interview cancelled successfully",
  "timestamp": "2025-11-11T10:30:00"
}
```

---

### 8. Feedback Management

#### Get All Feedback

```http
GET /feedback?interviewId=interview_id&page=0&size=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `interviewId` (optional): Filter by interview
- `candidateId` (optional): Filter by candidate
- `interviewerId` (optional): Filter by interviewer
- `page` (default: 0): Page number
- `size` (default: 10): Page size

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": "feedback_id",
      "interview": {
        "id": "interview_id",
        "scheduledAt": "2025-11-15T14:00:00",
        "status": "COMPLETED"
      },
      "rating": 8,
      "technicalSkills": 8,
      "communicationSkills": 9,
      "problemSolving": 8,
      "culturalFit": 9,
      "strengths": "Strong problem-solving skills, excellent communication",
      "weaknesses": "Limited experience with microservices",
      "comments": "Candidate shows great potential",
      "recommendation": "HIRE",
      "submittedAt": "2025-11-15T16:00:00",
      "createdAt": "2025-11-15T16:00:00",
      "updatedAt": "2025-11-15T16:00:00"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 30,
  "totalPages": 3
}
```

#### Submit Feedback

```http
POST /feedback
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "interviewId": "interview_id",
  "rating": 8,
  "technicalSkills": 8,
  "communicationSkills": 9,
  "problemSolving": 8,
  "culturalFit": 9,
  "strengths": "Strong problem-solving skills, excellent communication",
  "weaknesses": "Limited experience with microservices",
  "comments": "Candidate shows great potential and fits well with our team culture",
  "recommendation": "HIRE"
}
```

**Response (201 Created):**
```json
{
  "id": "feedback_id",
  "interviewId": "interview_id",
  "recommendation": "HIRE",
  "createdAt": "2025-11-15T16:00:00"
}
```

#### Get Feedback by ID

```http
GET /feedback/{feedbackId}
Authorization: Bearer <token>
```

#### Update Feedback

```http
PUT /feedback/{feedbackId}
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "technicalSkills": 5,
  "overallRating": 5,
  "comments": "Updated comments after further consideration",
  "recommendation": "STRONG_HIRE"
}
```

#### Delete Feedback

```http
DELETE /feedback/{feedbackId}
Authorization: Bearer <token>
```

---

## Data Models

### Enums

#### UserRole
- `ADMIN`
- `RECRUITER`
- `INTERVIEWER`
- `CANDIDATE`

#### VerificationStatus (Recruiter)
- `PENDING`
- `VERIFIED`
- `REJECTED`

#### CandidateStatus
- `APPLIED`
- `SCREENING`
- `INTERVIEW_SCHEDULED`
- `INTERVIEWED`
- `SELECTED`
- `REJECTED`

#### InterviewType
- `TECHNICAL`
- `HR`
- `CULTURAL_FIT`
- `MANAGERIAL`

#### InterviewStatus
- `SCHEDULED`
- `IN_PROGRESS`
- `COMPLETED`
- `CANCELLED`
- `RESCHEDULED`

#### Recommendation (Feedback)
- `STRONG_HIRE`
- `HIRE`
- `HOLD`
- `NO_HIRE`

---

## Error Handling

All errors return a standard error response format:

```json
{
  "error": "ERROR_CODE",
  "message": "Detailed error message",
  "timestamp": "2025-11-11T10:30:00",
  "path": "/api/endpoint"
}
```

### Common HTTP Status Codes

- **200 OK** - Request succeeded
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Authentication required or failed
- **403 Forbidden** - Access denied
- **404 Not Found** - Resource not found
- **409 Conflict** - Resource already exists
- **500 Internal Server Error** - Server error

---

## Rate Limiting

- **Rate Limit**: 100 requests per minute per IP
- **Headers**:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time when limit resets (Unix timestamp)

---

## Pagination

All list endpoints support pagination with the following parameters:

- `page` (default: 0): Zero-based page number
- `size` (default: 10): Number of items per page

Pagination response includes:
- `content`: Array of items
- `page`: Current page number
- `size`: Page size
- `totalElements`: Total number of items
- `totalPages`: Total number of pages

---

## Best Practices

1. **Always include Authorization header** for protected endpoints
2. **Use HTTPS** in production environments
3. **Validate input data** before sending requests
4. **Handle errors gracefully** in your application
5. **Implement token refresh** logic for seamless user experience
6. **Store refresh tokens securely** (e.g., HTTP-only cookies)
7. **Logout users** when token expires or user logs out
8. **Use appropriate HTTP methods** (GET, POST, PUT, PATCH, DELETE)
9. **Filter and paginate** large result sets
10. **Monitor rate limits** to avoid throttling

---

## Support

For API support or questions:
- **Email**: support@intervieworganiser.com
- **Documentation**: See `api.yaml` for OpenAPI specification
- **Postman Collection**: Import the collection for easy API testing

---

## Version History

### v1.0.0 (2025-11-11)
- Initial API release
- User authentication and management
- Recruiter management
- Candidate tracking
- Interviewer coordination
- Interview scheduling
- Feedback system

