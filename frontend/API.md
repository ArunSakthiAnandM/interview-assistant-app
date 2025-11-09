# Interview Assistant App - API Documentation

> Complete API reference for the Interview Assistant platform backend. This document outlines all endpoints, request/response structures, and integration requirements.

**Base URL**: `http://localhost:8080/api/v1`

**API Version**: v1

**Last Updated**: October 26, 2025

---

## 📋 Table of Contents

- [Authentication](#authentication)
- [Organisation Management](#organisation-management)
- [Candidate Management](#candidate-management)
- [Interviewer Management](#interviewer-management)
- [Interview Management](#interview-management)
- [OTP Verification](#otp-verification)
- [File Management](#file-management)
- [Notification Service](#notification-service)
- [Common Structures](#common-structures)
- [Error Handling](#error-handling)

---

## 🔐 Authentication

All authenticated endpoints require a JWT bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### POST /auth/login

Authenticate user with credentials.

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "role": "RECRUITER",
      "firstName": "John",
      "lastName": "Doe",
      "organisationId": "org-uuid",
      "organisationName": "TechCorp",
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    }
  },
  "message": "Login successful",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

**Error Response** (401 Unauthorized):

```json
{
  "success": false,
  "message": "Invalid email or password",
  "error": "INVALID_CREDENTIALS",
  "statusCode": 401,
  "timestamp": "2025-10-26T14:30:00Z"
}
```

---

### POST /auth/logout

Logout user and invalidate tokens.

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{}
```

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Logout successful",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

---

### POST /auth/refresh

Refresh access token using refresh token.

**Request Body**:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  },
  "message": "Token refreshed successfully",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

---

### POST /auth/verify

Verify if current token is valid.

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "valid": true,
    "expiresAt": "2025-10-26T15:30:00Z"
  },
  "message": "Token is valid",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

---

## 🏢 Organisation Management

### POST /organisations/register

Register a new organisation with KYC documents.

**Request Body**:

```json
{
  "name": "TechCorp Solutions",
  "registrationNumber": "REG-2025-12345",
  "address": {
    "street": "123 Business Park",
    "city": "San Francisco",
    "state": "California",
    "country": "USA",
    "postalCode": "94105"
  },
  "contactEmail": "contact@techcorp.com",
  "contactPhone": "+1-555-1234",
  "website": "https://techcorp.com",
  "description": "Leading software development company",
  "adminEmail": "admin@techcorp.com",
  "adminName": "John Doe",
  "adminPassword": "SecurePass123!"
}
```

**Response** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": "org-uuid",
    "name": "TechCorp Solutions",
    "registrationNumber": "REG-2025-12345",
    "address": {
      "street": "123 Business Park",
      "city": "San Francisco",
      "state": "California",
      "country": "USA",
      "postalCode": "94105"
    },
    "contactEmail": "contact@techcorp.com",
    "contactPhone": "+1-555-1234",
    "website": "https://techcorp.com",
    "description": "Leading software development company",
    "kycDocuments": [],
    "verificationStatus": "PENDING",
    "adminUserId": "user-uuid",
    "createdAt": "2025-10-26T14:30:00Z",
    "updatedAt": "2025-10-26T14:30:00Z"
  },
  "message": "Organisation registered successfully. Awaiting admin verification.",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

---

### GET /organisations/:id

Get organisation details by ID.

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "org-uuid",
    "name": "TechCorp Solutions",
    "registrationNumber": "REG-2025-12345",
    "address": { ... },
    "contactEmail": "contact@techcorp.com",
    "contactPhone": "+1-555-1234",
    "website": "https://techcorp.com",
    "description": "Leading software development company",
    "kycDocuments": [
      {
        "id": "doc-uuid",
        "documentType": "BUSINESS_LICENSE",
        "documentName": "business_license.pdf",
        "fileUrl": "https://s3.amazonaws.com/files/doc-uuid.pdf",
        "fileSize": 2048576,
        "uploadedAt": "2025-10-26T14:30:00Z"
      }
    ],
    "verificationStatus": "VERIFIED",
    "adminUserId": "user-uuid",
    "createdAt": "2025-10-26T14:30:00Z",
    "updatedAt": "2025-10-26T14:30:00Z"
  },
  "message": "Organisation retrieved successfully",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

---

### PUT /organisations/:id/verify

Verify organisation (Admin only).

**Headers**: `Authorization: Bearer <admin-token>`

**Request Body**:

```json
{}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "org-uuid",
    "verificationStatus": "VERIFIED",
    "updatedAt": "2025-10-26T14:30:00Z"
  },
  "message": "Organisation verified successfully",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

---

### PUT /organisations/:id/reject

Reject organisation (Admin only).

**Headers**: `Authorization: Bearer <admin-token>`

**Request Body**:

```json
{
  "reason": "Incomplete documentation"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "org-uuid",
    "verificationStatus": "REJECTED",
    "rejectionReason": "Incomplete documentation",
    "updatedAt": "2025-10-26T14:30:00Z"
  },
  "message": "Organisation rejected",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

---

### POST /organisations/:id/kyc

Upload KYC documents for organisation.

**Headers**:

- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data**:

- `file`: File (PDF, JPEG, PNG, max 5MB)
- `documentType`: String (BUSINESS_LICENSE, TAX_CERTIFICATE, INCORPORATION_CERTIFICATE, BANK_STATEMENT, OTHER)

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "doc-uuid",
    "documentType": "BUSINESS_LICENSE",
    "documentName": "business_license.pdf",
    "fileUrl": "https://s3.amazonaws.com/files/doc-uuid.pdf",
    "fileSize": 2048576,
    "uploadedAt": "2025-10-26T14:30:00Z"
  },
  "message": "KYC document uploaded successfully",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

---

## 👤 Candidate Management

### POST /candidates/register

Register a new candidate.

**Request Body**:

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "mobile": "+1-555-5678",
  "password": "SecurePass123!"
}
```

**Response** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": "candidate-uuid",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "mobile": "+1-555-5678",
    "role": "CANDIDATE",
    "mobileVerified": false,
    "emailVerified": false,
    "createdAt": "2025-10-26T14:30:00Z",
    "updatedAt": "2025-10-26T14:30:00Z"
  },
  "message": "Candidate registered successfully. Please verify your email and mobile.",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

---

### GET /candidates/profile

Get current candidate profile (requires authentication).

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "candidate-uuid",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "mobile": "+1-555-5678",
    "role": "CANDIDATE",
    "mobileVerified": true,
    "emailVerified": true,
    "resume": "https://s3.amazonaws.com/resumes/candidate-uuid.pdf",
    "skills": ["JavaScript", "React", "Node.js"],
    "experience": 5,
    "education": [
      {
        "institution": "Stanford University",
        "degree": "Bachelor of Science",
        "fieldOfStudy": "Computer Science",
        "startDate": "2015-09-01T00:00:00Z",
        "endDate": "2019-06-01T00:00:00Z",
        "current": false,
        "grade": "3.8 GPA"
      }
    ],
    "linkedinUrl": "https://linkedin.com/in/janesmith",
    "githubUrl": "https://github.com/janesmith",
    "portfolioUrl": "https://janesmith.dev",
    "createdAt": "2025-10-26T14:30:00Z",
    "updatedAt": "2025-10-26T14:30:00Z"
  },
  "message": "Profile retrieved successfully",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

---

### PUT /candidates/profile/update

Update candidate profile.

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "mobile": "+1-555-5678",
  "skills": ["JavaScript", "React", "Node.js", "TypeScript"],
  "experience": 6,
  "linkedinUrl": "https://linkedin.com/in/janesmith",
  "githubUrl": "https://github.com/janesmith",
  "portfolioUrl": "https://janesmith.dev"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "candidate-uuid",
    "firstName": "Jane",
    "lastName": "Smith",
    "skills": ["JavaScript", "React", "Node.js", "TypeScript"],
    "experience": 6,
    "updatedAt": "2025-10-26T14:30:00Z"
  },
  "message": "Profile updated successfully",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

---

### GET /candidates/:id

Get candidate by ID (restricted access).

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "candidate-uuid",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "mobile": "+1-555-5678",
    "role": "CANDIDATE",
    "skills": ["JavaScript", "React", "Node.js"],
    "experience": 5,
    "resume": "https://s3.amazonaws.com/resumes/candidate-uuid.pdf"
  },
  "message": "Candidate retrieved successfully",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

---

## 👨‍💼 Interviewer Management

### POST /interviewers/register

Register a new interviewer (linked to organisation).

**Headers**: `Authorization: Bearer <org-admin-token>`

**Request Body**:

```json
{
  "firstName": "Robert",
  "lastName": "Johnson",
  "email": "robert.j@techcorp.com",
  "organisationId": "org-uuid",
  "department": "Engineering",
  "designation": "Senior Software Engineer",
  "expertise": ["JavaScript", "System Design", "Architecture"]
}
```

**Response** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": "interviewer-uuid",
    "firstName": "Robert",
    "lastName": "Johnson",
    "email": "robert.j@techcorp.com",
    "role": "INTERVIEWER",
    "organisationId": "org-uuid",
    "department": "Engineering",
    "designation": "Senior Software Engineer",
    "expertise": ["JavaScript", "System Design", "Architecture"],
    "createdAt": "2025-10-26T14:30:00Z",
    "updatedAt": "2025-10-26T14:30:00Z"
  },
  "message": "Interviewer registered successfully",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

---

### GET /interviewers/:id

Get interviewer details by ID.

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "interviewer-uuid",
    "firstName": "Robert",
    "lastName": "Johnson",
    "email": "robert.j@techcorp.com",
    "role": "INTERVIEWER",
    "organisationId": "org-uuid",
    "department": "Engineering",
    "designation": "Senior Software Engineer",
    "expertise": ["JavaScript", "System Design", "Architecture"],
    "createdAt": "2025-10-26T14:30:00Z"
  },
  "message": "Interviewer retrieved successfully",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

---

### GET /interviewers/organisation/:orgId

Get all interviewers for an organisation.

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

- `page`: number (default: 0)
- `size`: number (default: 10)

**Response** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "id": "interviewer-uuid-1",
      "firstName": "Robert",
      "lastName": "Johnson",
      "email": "robert.j@techcorp.com",
      "department": "Engineering",
      "designation": "Senior Software Engineer"
    },
    {
      "id": "interviewer-uuid-2",
      "firstName": "Sarah",
      "lastName": "Williams",
      "email": "sarah.w@techcorp.com",
      "department": "HR",
      "designation": "HR Manager"
    }
  ],
  "pagination": {
    "currentPage": 0,
    "pageSize": 10,
    "totalPages": 1,
    "totalItems": 2,
    "hasNext": false,
    "hasPrevious": false
  },
  "message": "Interviewers retrieved successfully",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

---

### POST /interviewers/invite

Send invitation to register as interviewer.

**Headers**: `Authorization: Bearer <org-admin-token>`

**Request Body**:

```json
{
  "email": "newinterviewer@techcorp.com",
  "firstName": "Sarah",
  "lastName": "Williams",
  "designation": "Senior Engineer",
  "department": "Engineering"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "inviteToken": "invite-token-uuid",
    "email": "newinterviewer@techcorp.com",
    "expiresAt": "2025-11-02T14:30:00Z"
  },
  "message": "Invitation sent successfully",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

---

## 📅 Interview Management

### POST /interviews/create

Create a new interview.

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "title": "Senior Frontend Developer - Round 1",
  "description": "Technical interview focusing on React and TypeScript",
  "candidateEmail": "jane.smith@example.com",
  "interviewerIds": ["interviewer-uuid-1", "interviewer-uuid-2"],
  "scheduledDate": "2025-11-01T10:00:00Z",
  "duration": 60,
  "type": "TECHNICAL",
  "round": 1,
  "location": "https://meet.google.com/abc-defg-hij"
}
```

**Response** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": "interview-uuid",
    "title": "Senior Frontend Developer - Round 1",
    "description": "Technical interview focusing on React and TypeScript",
    "organisationId": "org-uuid",
    "candidateId": "candidate-uuid",
    "interviewerIds": ["interviewer-uuid-1", "interviewer-uuid-2"],
    "scheduledDate": "2025-11-01T10:00:00Z",
    "duration": 60,
    "type": "TECHNICAL",
    "round": 1,
    "status": "SCHEDULED",
    "location": "https://meet.google.com/abc-defg-hij",
    "feedback": [],
    "createdAt": "2025-10-26T14:30:00Z",
    "updatedAt": "2025-10-26T14:30:00Z"
  },
  "message": "Interview created successfully",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

---

### GET /interviews/:id

Get interview details by ID.

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "interview-uuid",
    "title": "Senior Frontend Developer - Round 1",
    "description": "Technical interview focusing on React and TypeScript",
    "organisationId": "org-uuid",
    "candidateId": "candidate-uuid",
    "interviewerIds": ["interviewer-uuid-1"],
    "scheduledDate": "2025-11-01T10:00:00Z",
    "duration": 60,
    "type": "TECHNICAL",
    "round": 1,
    "status": "COMPLETED",
    "location": "https://meet.google.com/abc-defg-hij",
    "notes": "Candidate showed strong technical skills",
    "feedback": [
      {
        "interviewerId": "interviewer-uuid-1",
        "rating": 4,
        "comments": "Strong technical knowledge, good problem-solving skills",
        "strengths": ["React expertise", "Clean code", "Communication"],
        "weaknesses": ["Limited system design experience"],
        "outcome": "SELECTED_NEXT_ROUND",
        "submittedAt": "2025-11-01T11:30:00Z"
      }
    ],
    "createdAt": "2025-10-26T14:30:00Z",
    "updatedAt": "2025-11-01T11:30:00Z"
  },
  "message": "Interview retrieved successfully",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

---

### GET /interviews/organisation/:orgId

Get all interviews for an organisation.

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

- `page`: number (default: 0)
- `size`: number (default: 10)
- `status`: InterviewStatus (optional filter)
- `type`: InterviewType (optional filter)
- `from`: ISO date string (optional filter)
- `to`: ISO date string (optional filter)

**Response** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "id": "interview-uuid-1",
      "title": "Senior Frontend Developer - Round 1",
      "candidateId": "candidate-uuid-1",
      "scheduledDate": "2025-11-01T10:00:00Z",
      "duration": 60,
      "type": "TECHNICAL",
      "status": "SCHEDULED"
    },
    {
      "id": "interview-uuid-2",
      "title": "Backend Developer - Round 1",
      "candidateId": "candidate-uuid-2",
      "scheduledDate": "2025-11-02T14:00:00Z",
      "duration": 90,
      "type": "TECHNICAL",
      "status": "SCHEDULED"
    }
  ],
  "pagination": {
    "currentPage": 0,
    "pageSize": 10,
    "totalPages": 1,
    "totalItems": 2,
    "hasNext": false,
    "hasPrevious": false
  },
  "message": "Interviews retrieved successfully",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

---

### GET /interviews/candidate/:candidateId

Get all interviews for a candidate.

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "id": "interview-uuid",
      "title": "Senior Frontend Developer - Round 1",
      "organisationId": "org-uuid",
      "scheduledDate": "2025-11-01T10:00:00Z",
      "duration": 60,
      "type": "TECHNICAL",
      "round": 1,
      "status": "SCHEDULED",
      "location": "https://meet.google.com/abc-defg-hij"
    }
  ],
  "message": "Interviews retrieved successfully",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

---

### PUT /interviews/:id/status

Update interview status.

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "status": "IN_PROGRESS"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "interview-uuid",
    "status": "IN_PROGRESS",
    "updatedAt": "2025-11-01T10:05:00Z"
  },
  "message": "Interview status updated successfully",
  "timestamp": "2025-11-01T10:05:00Z"
}
```

**Valid Status Values**:

- `SCHEDULED`
- `IN_PROGRESS`
- `COMPLETED`
- `CANCELLED`
- `NO_SHOW`

---

### POST /interviews/:id/feedback

Submit interview feedback.

**Headers**: `Authorization: Bearer <interviewer-token>`

**Request Body**:

```json
{
  "interviewerId": "interviewer-uuid",
  "rating": 4,
  "comments": "Strong technical knowledge, good problem-solving skills",
  "strengths": ["React expertise", "Clean code", "Communication"],
  "weaknesses": ["Limited system design experience"],
  "outcome": "SELECTED_NEXT_ROUND"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "interview-uuid",
    "feedback": [
      {
        "interviewerId": "interviewer-uuid",
        "rating": 4,
        "comments": "Strong technical knowledge, good problem-solving skills",
        "strengths": ["React expertise", "Clean code", "Communication"],
        "weaknesses": ["Limited system design experience"],
        "outcome": "SELECTED_NEXT_ROUND",
        "submittedAt": "2025-11-01T11:30:00Z"
      }
    ],
    "updatedAt": "2025-11-01T11:30:00Z"
  },
  "message": "Feedback submitted successfully",
  "timestamp": "2025-11-01T11:30:00Z"
}
```

**Valid Outcome Values**:

- `SELECTED`
- `SELECTED_NEXT_ROUND`
- `REJECTED`
- `ON_HOLD`
- `PENDING`

---

### POST /interviews/:id/invite

Generate candidate invite link.

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "interviewId": "interview-uuid",
    "token": "invite-token-uuid",
    "expiresAt": "2025-11-01T09:00:00Z",
    "isUsed": false
  },
  "message": "Invite link generated successfully",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

---

### PUT /interviews/:id

Update interview details.

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "title": "Senior Frontend Developer - Round 1 (Updated)",
  "scheduledDate": "2025-11-02T10:00:00Z",
  "duration": 90,
  "location": "https://meet.google.com/new-link",
  "notes": "Additional notes"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "interview-uuid",
    "title": "Senior Frontend Developer - Round 1 (Updated)",
    "scheduledDate": "2025-11-02T10:00:00Z",
    "duration": 90,
    "location": "https://meet.google.com/new-link",
    "updatedAt": "2025-10-26T14:35:00Z"
  },
  "message": "Interview updated successfully",
  "timestamp": "2025-10-26T14:35:00Z"
}
```

---

### DELETE /interviews/:id

Delete interview.

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Interview deleted successfully",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

---

## 📱 OTP Verification

### POST /otp/send

Send OTP to email or mobile.

**Request Body**:

```json
{
  "identifier": "jane.smith@example.com",
  "type": "EMAIL"
}
```

Or for mobile:

```json
{
  "identifier": "+1-555-5678",
  "type": "MOBILE"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

**OTP Configuration**:

- Length: 6 digits
- Expiry: 10 minutes
- Resend Cooldown: 60 seconds

---

### POST /otp/verify

Verify OTP.

**Request Body**:

```json
{
  "identifier": "jane.smith@example.com",
  "otp": "123456",
  "verificationType": "EMAIL"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "verified": true,
    "message": "Verification successful"
  },
  "message": "OTP verified successfully",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

**Error Response** (400 Bad Request):

```json
{
  "success": false,
  "data": {
    "verified": false,
    "message": "Invalid or expired OTP"
  },
  "message": "Invalid OTP",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

---

### POST /otp/resend

Resend OTP (same as /otp/send but with cooldown check).

**Request Body**:

```json
{
  "identifier": "jane.smith@example.com",
  "type": "EMAIL"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "message": "OTP resent successfully",
  "timestamp": "2025-10-26T14:31:00Z"
}
```

**Error Response** (429 Too Many Requests):

```json
{
  "success": false,
  "message": "Please wait 45 seconds before requesting a new OTP",
  "statusCode": 429,
  "timestamp": "2025-10-26T14:30:30Z"
}
```

---

## 📎 File Management

### POST /files/upload

Upload file (KYC documents, resumes, etc.).

**Headers**:

- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data**:

- `file`: File (PDF, JPEG, PNG)
- `documentType`: String (optional)

**File Constraints**:

- Max Size: 5MB
- Allowed Types: PDF, JPEG, PNG
- Allowed Extensions: .pdf, .jpg, .jpeg, .png

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "fileUrl": "https://s3.amazonaws.com/files/file-uuid.pdf",
    "fileName": "document.pdf",
    "fileSize": 2048576,
    "mimeType": "application/pdf",
    "uploadedAt": "2025-10-26T14:30:00Z"
  },
  "message": "File uploaded successfully",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

**Error Response** (413 Payload Too Large):

```json
{
  "success": false,
  "message": "File size exceeds 5MB limit",
  "statusCode": 413,
  "timestamp": "2025-10-26T14:30:00Z"
}
```

**Error Response** (415 Unsupported Media Type):

```json
{
  "success": false,
  "message": "Invalid file type. Only PDF, JPEG, and PNG are allowed",
  "statusCode": 415,
  "timestamp": "2025-10-26T14:30:00Z"
}
```

---

### GET /files/:fileId

Download or get file URL.

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "fileUrl": "https://s3.amazonaws.com/files/file-uuid.pdf?signature=...",
    "fileName": "document.pdf",
    "fileSize": 2048576,
    "mimeType": "application/pdf"
  },
  "message": "File retrieved successfully",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

---

### DELETE /files/:fileId

Delete file.

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):

```json
{
  "success": true,
  "message": "File deleted successfully",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

---

## 📧 Notification Service

### POST /notifications/email

Send email notification (internal use).

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "to": ["candidate@example.com"],
  "type": "INTERVIEW_INVITATION",
  "data": {
    "interviewId": "interview-uuid",
    "title": "Senior Frontend Developer - Round 1",
    "scheduledDate": "2025-11-01T10:00:00Z",
    "location": "https://meet.google.com/abc-defg-hij",
    "interviewLink": "https://app.example.com/interviews/interview-uuid"
  },
  "cc": ["hr@techcorp.com"],
  "bcc": []
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Email sent successfully",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

**Email Types**:

- `INTERVIEW_INVITATION`
- `INTERVIEW_REMINDER`
- `INTERVIEW_CANCELLED`
- `INTERVIEW_RESCHEDULED`
- `INTERVIEW_FEEDBACK`
- `CANDIDATE_SELECTED`
- `CANDIDATE_REJECTED`
- `ORGANISATION_VERIFIED`
- `ORGANISATION_REJECTED`
- `WELCOME`
- `PASSWORD_RESET`

**Backend Integration**:

- Use SendGrid, AWS SES, or similar service
- Configure email templates for each notification type

---

### POST /notifications/sms

Send SMS notification (internal use).

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "to": ["+1-555-5678"],
  "type": "INTERVIEW_REMINDER",
  "data": {
    "title": "Senior Frontend Developer - Round 1",
    "scheduledDate": "2025-11-01T10:00:00Z",
    "location": "Online"
  }
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "message": "SMS sent successfully",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

**SMS Types**:

- `INTERVIEW_REMINDER`
- `OTP_VERIFICATION`
- `INTERVIEW_CANCELLED`
- `URGENT_UPDATE`

**Backend Integration**:

- Use Twilio, AWS SNS, or similar service
- Keep SMS messages concise (160 characters limit)

---

## 📦 Common Structures

### User Roles

```typescript
enum UserRole {
  ADMIN = 'ADMIN',
  RECRUITER = 'RECRUITER',
  INTERVIEWER = 'INTERVIEWER',
  CANDIDATE = 'CANDIDATE',
}
```

### Verification Status

```typescript
enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}
```

### Interview Types

```typescript
enum InterviewType {
  TECHNICAL = 'TECHNICAL',
  HR = 'HR',
  MANAGERIAL = 'MANAGERIAL',
  CODING = 'CODING',
  BEHAVIORAL = 'BEHAVIORAL',
  SYSTEM_DESIGN = 'SYSTEM_DESIGN',
}
```

### Interview Status

```typescript
enum InterviewStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}
```

### Interview Outcome

```typescript
enum InterviewOutcome {
  SELECTED = 'SELECTED',
  SELECTED_NEXT_ROUND = 'SELECTED_NEXT_ROUND',
  REJECTED = 'REJECTED',
  ON_HOLD = 'ON_HOLD',
  PENDING = 'PENDING',
}
```

### Pagination Response Structure

```typescript
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 0,
    "pageSize": 10,
    "totalPages": 5,
    "totalItems": 50,
    "hasNext": true,
    "hasPrevious": false
  },
  "message": "...",
  "timestamp": "2025-10-26T14:30:00Z"
}
```

---

## ⚠️ Error Handling

### Standard Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "statusCode": 400,
  "timestamp": "2025-10-26T14:30:00Z",
  "path": "/api/v1/endpoint"
}
```

### Validation Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required",
      "code": "REQUIRED_FIELD"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters",
      "code": "MIN_LENGTH"
    }
  ],
  "statusCode": 400,
  "timestamp": "2025-10-26T14:30:00Z"
}
```

### HTTP Status Codes

| Status Code | Meaning                | Usage                              |
| ----------- | ---------------------- | ---------------------------------- |
| 200         | OK                     | Successful GET, PUT, DELETE        |
| 201         | Created                | Successful POST (resource created) |
| 400         | Bad Request            | Validation errors, invalid input   |
| 401         | Unauthorized           | Authentication required or failed  |
| 403         | Forbidden              | Authenticated but not authorized   |
| 404         | Not Found              | Resource not found                 |
| 409         | Conflict               | Resource already exists            |
| 413         | Payload Too Large      | File size exceeds limit            |
| 415         | Unsupported Media Type | Invalid file type                  |
| 429         | Too Many Requests      | Rate limit exceeded                |
| 500         | Internal Server Error  | Server-side error                  |
| 503         | Service Unavailable    | Service temporarily unavailable    |

### Error Codes

| Code                  | Description                      |
| --------------------- | -------------------------------- |
| `INVALID_CREDENTIALS` | Email or password incorrect      |
| `SESSION_EXPIRED`     | JWT token expired                |
| `UNAUTHORIZED`        | No authentication token provided |
| `FORBIDDEN`           | Insufficient permissions         |
| `VALIDATION_ERROR`    | Input validation failed          |
| `RESOURCE_NOT_FOUND`  | Requested resource not found     |
| `DUPLICATE_RESOURCE`  | Resource already exists          |
| `FILE_TOO_LARGE`      | File exceeds size limit          |
| `INVALID_FILE_TYPE`   | File type not allowed            |
| `OTP_EXPIRED`         | OTP has expired                  |
| `OTP_INVALID`         | OTP is incorrect                 |
| `RATE_LIMIT_EXCEEDED` | Too many requests                |
| `SERVER_ERROR`        | Internal server error            |

---

## 🔒 Security

### Authentication

- Use JWT (JSON Web Tokens) for authentication
- Access tokens expire in 1 hour
- Refresh tokens expire in 7 days
- Implement token rotation for refresh tokens

### Rate Limiting

Apply rate limits to prevent abuse:

| Endpoint        | Limit                                     |
| --------------- | ----------------------------------------- |
| `/auth/login`   | 5 requests per 15 minutes per IP          |
| `/otp/send`     | 5 requests per 15 minutes per identifier  |
| `/otp/verify`   | 10 requests per 15 minutes per identifier |
| File uploads    | 10 requests per hour per user             |
| Other endpoints | 100 requests per minute per user          |

### CORS

Configure CORS to allow requests only from trusted origins:

```
Access-Control-Allow-Origin: https://yourapp.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type
```

### Data Protection

- All passwords must be hashed using bcrypt (cost factor: 12)
- Store sensitive data encrypted at rest
- Use HTTPS for all communications
- Sanitize all user inputs to prevent injection attacks
- Implement CSRF protection for state-changing operations

---

## 📝 Notes

### Backend Implementation Requirements

1. **Spring Boot** setup with:

   - Spring Security for authentication/authorization
   - MongoDB for database
   - AWS S3 (or similar) for file storage
   - Redis for caching and rate limiting

2. **Third-Party Services**:

   - **SendGrid or AWS SES** for email notifications
   - **Twilio or AWS SNS** for SMS notifications

3. **Database Schema**:

   - Users collection
   - Organisations collection
   - Interviews collection
   - Files collection
   - OTP collection (with TTL index)

4. **Testing**:

   - Unit tests for all services
   - Integration tests for all endpoints
   - Load testing for critical paths

5. **Monitoring**:
   - Log all API requests and errors
   - Set up alerts for failures
   - Monitor API performance metrics

---

**API Version**: 1.0.0  
**Last Updated**: October 26, 2025  
**Maintained by**: Interview Assistant Development Team
