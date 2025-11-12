# Interview Organiser API Documentation

Complete REST API reference for the Interview Organiser system.

## Base URL

```
Local: http://localhost:8080/api/v1
```

## Authentication

Most endpoints require JWT authentication via Bearer token:
```
Authorization: Bearer <your_access_token>
```

## Response Format

### Success Response
```json
{
  "id": "string",
  "field": "value",
  ...
}
```

### Error Response
```json
{
  "error": "ERROR_CODE",
  "message": "Error description",
  "timestamp": "2025-11-13T10:00:00",
  "path": "/api/v1/endpoint"
}
```

### Paginated Response
```json
{
  "content": [...],
  "page": 0,
  "size": 10,
  "totalElements": 100,
  "totalPages": 10
}
```

---

## 1. Health

### Check API Health
```http
GET /health
```

**Response**: `200 OK`
```json
{
  "status": "UP",
  "timestamp": "2025-11-13T10:00:00",
  "message": "Interview Organiser API is running"
}
```

---

## 2. Authentication

### Register User
```http
POST /auth/register
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "RECRUITER"
}
```

**Response**: `201 Created`
```json
{
  "accessToken": "eyJhbG...",
  "refreshToken": "eyJhbG...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "RECRUITER",
    "isActive": true,
    "createdAt": "2025-11-13T10:00:00"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**: `200 OK` (same as register response)

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json
```

**Request Body**:
```json
{
  "refreshToken": "eyJhbG..."
}
```

**Response**: `200 OK` (returns new tokens)

### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

**Response**: `200 OK`
```json
{
  "message": "Logout successful",
  "timestamp": "2025-11-13T10:00:00"
}
```

---

## 3. Users

### Get All Users
```http
GET /users?role=RECRUITER&page=0&size=10
Authorization: Bearer <token>
```

**Query Parameters**:
- `role` (optional): ADMIN, RECRUITER, INTERVIEWER, CANDIDATE
- `page` (default: 0): Page number
- `size` (default: 10): Page size

**Response**: `200 OK` (paginated user list)

### Get User by ID
```http
GET /users/{userId}
Authorization: Bearer <token>
```

**Response**: `200 OK`
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "RECRUITER",
  "isActive": true,
  "createdAt": "2025-11-13T10:00:00",
  "updatedAt": "2025-11-13T10:00:00"
}
```

### Update User
```http
PUT /users/{userId}
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890",
  "isActive": true
}
```

**Response**: `200 OK` (updated user object)

### Delete User
```http
DELETE /users/{userId}
Authorization: Bearer <token>
```

**Response**: `200 OK`
```json
{
  "message": "User deleted successfully",
  "timestamp": "2025-11-13T10:00:00"
}
```

---

## 4. Recruiters

### Get All Recruiters
```http
GET /recruiters?status=VERIFIED&isActive=true&page=0&size=10
Authorization: Bearer <token>
```

**Query Parameters**:
- `status` (optional): PENDING, VERIFIED, REJECTED
- `isActive` (optional): true/false
- `page` (default: 0)
- `size` (default: 10)

**Response**: `200 OK` (paginated recruiter list)

### Create Recruiter
```http
POST /recruiters
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Tech Corp",
  "registrationNumber": "REG123",
  "address": {
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "country": "USA",
    "postalCode": "94105"
  },
  "contactEmail": "contact@techcorp.com",
  "contactPhone": "+1234567890",
  "website": "https://techcorp.com",
  "description": "Leading tech recruitment"
}
```

**Response**: `201 Created` (recruiter object)

### Get Recruiter by ID
```http
GET /recruiters/{recruiterId}
Authorization: Bearer <token>
```

**Response**: `200 OK` (recruiter object)

### Update Recruiter
```http
PUT /recruiters/{recruiterId}
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Tech Corp Inc",
  "contactEmail": "new@techcorp.com",
  "contactPhone": "+1234567890",
  "website": "https://techcorp.com",
  "description": "Updated description"
}
```

**Response**: `200 OK` (updated recruiter)

### Verify Recruiter (Admin Only)
```http
PUT /recruiters/{recruiterId}/verify
Authorization: Bearer <token>
```

**Response**: `200 OK` (recruiter with status VERIFIED)

### Unverify Recruiter (Admin Only)
```http
PUT /recruiters/{recruiterId}/unverify?reason=Suspicious%20activity
Authorization: Bearer <token>
```

**Query Parameters**:
- `reason` (required): Reason for unverifying

**Response**: `200 OK` (recruiter with status REJECTED)

### Reject Recruiter (Admin Only)
```http
PUT /recruiters/{recruiterId}/reject?reason=Invalid%20documents
Authorization: Bearer <token>
```

**Query Parameters**:
- `reason` (required): Reason for rejection

**Response**: `200 OK` (recruiter with status REJECTED)

### Delete Recruiter
```http
DELETE /recruiters/{recruiterId}
Authorization: Bearer <token>
```

**Response**: `200 OK`
```json
{
  "message": "Recruiter deleted successfully",
  "timestamp": "2025-11-13T10:00:00"
}
```

---

## 5. Candidates

### Get All Candidates
```http
GET /candidates?status=APPLIED&search=developer&page=0&size=10
Authorization: Bearer <token>
```

**Query Parameters**:
- `status` (optional): APPLIED, SCREENING, INTERVIEW_SCHEDULED, INTERVIEWED, SELECTED, REJECTED
- `search` (optional): Search by name, email, position, skills
- `page` (default: 0)
- `size` (default: 10)

**Response**: `200 OK` (paginated candidate list)

### Create Candidate
```http
POST /candidates
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "position": "Software Engineer",
  "experience": 5.5,
  "skills": ["Java", "Spring Boot", "MongoDB"],
  "resumeUrl": "https://example.com/resume.pdf",
  "linkedinUrl": "https://linkedin.com/in/jane",
  "githubUrl": "https://github.com/jane",
  "recruiterId": "recruiter_id"
}
```

**Response**: `201 Created` (candidate object)

### Get Candidate by ID
```http
GET /candidates/{candidateId}
Authorization: Bearer <token>
```

**Response**: `200 OK` (candidate object)

### Update Candidate
```http
PUT /candidates/{candidateId}
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "phone": "+1234567890",
  "position": "Senior Software Engineer",
  "experience": 6.0,
  "skills": ["Java", "Kubernetes"],
  "status": "SCREENING"
}
```

**Response**: `200 OK` (updated candidate)

### Delete Candidate
```http
DELETE /candidates/{candidateId}
Authorization: Bearer <token>
```

**Response**: `200 OK` (message response)

### Invite Candidate
```http
POST /candidates/invite
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "candidateId": "candidate_id"
}
```

**Response**: `200 OK`
```json
{
  "message": "Invitation sent successfully",
  "timestamp": "2025-11-13T10:00:00"
}
```

### Respond to Invitation
```http
POST /candidates/invitation/respond
Content-Type: application/json
```

**Request Body**:
```json
{
  "token": "invitation_token",
  "response": "ACCEPT"
}
```

**Response**: `200 OK` (message response)

---

## 6. Interviewers

### Get All Interviewers
```http
GET /interviewers?expertise=Java&available=true&page=0&size=10
Authorization: Bearer <token>
```

**Query Parameters**:
- `expertise` (optional): Filter by skill/expertise
- `available` (optional): true/false
- `page` (default: 0)
- `size` (default: 10)

**Response**: `200 OK` (paginated interviewer list)

### Create Interviewer
```http
POST /interviewers
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "userId": "user_id",
  "department": "Engineering",
  "expertise": ["Java", "Spring Boot"],
  "yearsOfExperience": 10,
  "availability": true
}
```

**Response**: `201 Created` (interviewer object)

### Invite Interviewer
```http
POST /interviewers/invite
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "interviewer@example.com",
  "recruiterId": "recruiter_id",
  "message": "Join our interview panel"
}
```

**Response**: `200 OK` (message response)

### Get Interviewer by ID
```http
GET /interviewers/{interviewerId}
Authorization: Bearer <token>
```

**Response**: `200 OK` (interviewer object)

### Update Interviewer
```http
PUT /interviewers/{interviewerId}
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "department": "Engineering",
  "expertise": ["Java", "Cloud"],
  "yearsOfExperience": 12,
  "availability": false
}
```

**Response**: `200 OK` (updated interviewer)

### Delete Interviewer
```http
DELETE /interviewers/{interviewerId}
Authorization: Bearer <token>
```

**Response**: `200 OK` (message response)

---

## 7. Interviews

### Get All Interviews
```http
GET /interviews?status=SCHEDULED&candidateId={id}&page=0&size=10
Authorization: Bearer <token>
```

**Query Parameters**:
- `status` (optional): SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, RESCHEDULED
- `candidateId` (optional): Filter by candidate
- `interviewerId` (optional): Filter by interviewer
- `fromDate` (optional): ISO 8601 format
- `toDate` (optional): ISO 8601 format
- `page` (default: 0)
- `size` (default: 10)

**Response**: `200 OK` (paginated interview list)

### Schedule Interview
```http
POST /interviews
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "recruiterId": "recruiter_id",
  "candidateId": "candidate_id",
  "interviewerIds": ["interviewer_id_1"],
  "scheduledAt": "2025-11-15T14:00:00",
  "duration": 60,
  "interviewType": "TECHNICAL",
  "round": 1,
  "meetingLink": "https://meet.google.com/abc",
  "location": "Office Room 301",
  "notes": "Focus on Java and system design"
}
```

**Response**: `201 Created` (interview object)

### Get Interview by ID
```http
GET /interviews/{interviewId}
Authorization: Bearer <token>
```

**Response**: `200 OK` (interview object)

### Update Interview
```http
PUT /interviews/{interviewId}
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "scheduledAt": "2025-11-15T15:00:00",
  "duration": 90,
  "meetingLink": "https://meet.google.com/xyz",
  "notes": "Updated notes"
}
```

**Response**: `200 OK` (updated interview)

### Update Interview Status
```http
PATCH /interviews/{interviewId}/status
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "status": "COMPLETED",
  "reason": "Interview completed successfully"
}
```

**Response**: `200 OK` (updated interview)

### Confirm Interview (Candidate)
```http
POST /interviews/{interviewId}/confirm
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "interviewId": "interview_id",
  "candidateId": "candidate_id",
  "confirmed": true,
  "notes": "Looking forward to it"
}
```

**Response**: `200 OK` (interview with confirmation details)

### Mark Interview Result
```http
POST /interviews/{interviewId}/result
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "interviewId": "interview_id",
  "result": "NEXT_ROUND",
  "comments": "Good performance, proceed to next round"
}
```

**Values for result**: SELECTED, REJECTED, NEXT_ROUND

**Response**: `200 OK` (interview with result)

### Create Next Round Interview
```http
POST /interviews/{interviewId}/next-round
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "previousInterviewId": "interview_id",
  "scheduledAt": "2025-11-20T14:00:00",
  "duration": 60,
  "interviewType": "TECHNICAL",
  "interviewerIds": ["interviewer_id_2"],
  "meetingLink": "https://meet.google.com/next",
  "location": "Office Room 401",
  "notes": "Round 2 - Advanced topics"
}
```

**Response**: `201 Created` (new interview object with round incremented)

### Request Feedback
```http
POST /interviews/{interviewId}/request-feedback
Authorization: Bearer <token>
```

**Response**: `200 OK`
```json
{
  "message": "Feedback requests sent to interviewers and candidate",
  "timestamp": "2025-11-13T10:00:00"
}
```

### Cancel Interview
```http
DELETE /interviews/{interviewId}
Authorization: Bearer <token>
```

**Response**: `200 OK` (message response)

---

## 8. Feedback

### Get All Feedback
```http
GET /feedback?interviewId={id}&page=0&size=10
Authorization: Bearer <token>
```

**Query Parameters**:
- `interviewId` (optional): Filter by interview
- `candidateId` (optional): Filter by candidate
- `interviewerId` (optional): Filter by interviewer
- `page` (default: 0)
- `size` (default: 10)

**Response**: `200 OK` (paginated feedback list)

### Submit Feedback
```http
POST /feedback
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "interviewId": "interview_id",
  "rating": 8,
  "technicalSkills": 8,
  "communicationSkills": 9,
  "problemSolving": 8,
  "culturalFit": 9,
  "strengths": "Strong problem-solving",
  "weaknesses": "Limited cloud experience",
  "comments": "Great candidate overall",
  "recommendation": "HIRE"
}
```

**Recommendation values**: STRONG_HIRE, HIRE, HOLD, NO_HIRE

**Response**: `201 Created` (feedback object)

### Get Feedback by ID
```http
GET /feedback/{feedbackId}
Authorization: Bearer <token>
```

**Response**: `200 OK` (feedback object)

### Update Feedback
```http
PUT /feedback/{feedbackId}
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "rating": 9,
  "technicalSkills": 9,
  "comments": "Updated after review",
  "recommendation": "STRONG_HIRE"
}
```

**Response**: `200 OK` (updated feedback)

### Delete Feedback
```http
DELETE /feedback/{feedbackId}
Authorization: Bearer <token>
```

**Response**: `200 OK` (message response)

---

## 9. Dashboards

### Admin Dashboard
```http
GET /dashboard/admin
Authorization: Bearer <token>
```

**Response**: `200 OK`
```json
{
  "stats": {
    "totalRecruiters": 50,
    "verifiedRecruiters": 45,
    "pendingRecruiters": 5,
    "totalUsers": 200,
    "totalInterviews": 500,
    "totalCandidates": 150,
    "activeInterviews": 25
  },
  "pendingRecruiters": [],
  "recentRecruiters": [],
  "recentUsers": []
}
```

### Recruiter Dashboard
```http
GET /dashboard/recruiter/{recruiterId}
Authorization: Bearer <token>
```

**Response**: `200 OK`
```json
{
  "stats": {
    "totalCandidates": 30,
    "activeCandidates": 25,
    "totalInterviews": 100,
    "upcomingInterviews": 10,
    "completedInterviews": 85,
    "totalInterviewers": 15,
    "pendingFeedbacks": 5
  },
  "recentCandidates": [],
  "upcomingInterviews": [],
  "availableInterviewers": []
}
```

### Interviewer Dashboard
```http
GET /dashboard/interviewer/{interviewerId}
Authorization: Bearer <token>
```

**Response**: `200 OK`
```json
{
  "stats": {
    "totalInterviews": 50,
    "upcomingInterviews": 5,
    "completedInterviews": 45,
    "pendingFeedbacks": 2,
    "availability": true
  },
  "assignedInterviews": [],
  "upcomingInterviews": [],
  "pendingFeedback": []
}
```

### Candidate Dashboard
```http
GET /dashboard/candidate/{candidateId}
Authorization: Bearer <token>
```

**Response**: `200 OK`
```json
{
  "stats": {
    "totalInterviews": 3,
    "upcomingInterviews": 1,
    "completedInterviews": 2,
    "pendingConfirmations": 1,
    "currentStatus": "INTERVIEW_SCHEDULED"
  },
  "upcomingInterviews": [],
  "pastInterviews": [],
  "pendingConfirmations": []
}
```

---

## Enums Reference

### UserRole
- ADMIN
- RECRUITER
- INTERVIEWER
- CANDIDATE

### InterviewStatus
- SCHEDULED
- IN_PROGRESS
- COMPLETED
- CANCELLED
- RESCHEDULED

### InterviewType
- TECHNICAL
- HR
- CULTURAL_FIT
- MANAGERIAL

### InterviewResult
- SELECTED
- REJECTED
- NEXT_ROUND

### CandidateStatus
- APPLIED
- SCREENING
- INTERVIEW_SCHEDULED
- INTERVIEWED
- SELECTED
- REJECTED

### VerificationStatus
- PENDING
- VERIFIED
- REJECTED

### FeedbackRecommendation
- STRONG_HIRE
- HIRE
- HOLD
- NO_HIRE

---

## HTTP Status Codes

- `200 OK`: Success
- `201 Created`: Resource created
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Access denied
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `500 Internal Server Error`: Server error

