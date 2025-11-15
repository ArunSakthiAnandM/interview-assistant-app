import { environment } from '../environments/environment.development';

/**
 * Application-wide constants
 */

/**
 * API configuration
 * Base URL is determined by the environment configuration
 */
export const API_CONFIG = {
  BASE_URL: environment.apiBaseUrl,
  TIMEOUT: 30000, // 30 seconds
} as const;

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    REGISTER: '/auth/register',
  },

  // Users
  USER: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },

  // Recruiter
  RECRUITER: {
    BASE: '/recruiters',
    BY_ID: (id: string) => `/recruiters/${id}`,
    CREATE: '/recruiters',
    UPDATE: (id: string) => `/recruiters/${id}`,
    VERIFY: (id: string) => `/recruiters/${id}/verify`,
    UNVERIFY: (id: string) => `/recruiters/${id}/unverify`,
    REJECT: (id: string) => `/recruiters/${id}/reject`,
    DELETE: (id: string) => `/recruiters/${id}`,
  },

  // Candidate
  CANDIDATE: {
    BASE: '/candidates',
    BY_ID: (id: string) => `/candidates/${id}`,
    CREATE: '/candidates',
    UPDATE: (id: string) => `/candidates/${id}`,
    DELETE: (id: string) => `/candidates/${id}`,
    INVITE: '/candidates/invite',
    INVITATION_RESPOND: '/candidates/invitation/respond',
  },

  // Interviewer
  INTERVIEWER: {
    BASE: '/interviewers',
    BY_ID: (id: string) => `/interviewers/${id}`,
    CREATE: '/interviewers',
    INVITE: '/interviewers/invite',
    UPDATE: (id: string) => `/interviewers/${id}`,
    DELETE: (id: string) => `/interviewers/${id}`,
  },

  // Interview
  INTERVIEW: {
    BASE: '/interviews',
    BY_ID: (id: string) => `/interviews/${id}`,
    CREATE: '/interviews',
    UPDATE: (id: string) => `/interviews/${id}`,
    UPDATE_STATUS: (id: string) => `/interviews/${id}/status`,
    CONFIRM: (id: string) => `/interviews/${id}/confirm`,
    RESULT: (id: string) => `/interviews/${id}/result`,
    NEXT_ROUND: (id: string) => `/interviews/${id}/next-round`,
    REQUEST_FEEDBACK: (id: string) => `/interviews/${id}/request-feedback`,
    CANCEL: (id: string) => `/interviews/${id}`,
  },

  // Feedback
  FEEDBACK: {
    BASE: '/feedback',
    BY_ID: (id: string) => `/feedback/${id}`,
    CREATE: '/feedback',
    UPDATE: (id: string) => `/feedback/${id}`,
    DELETE: (id: string) => `/feedback/${id}`,
  },

  // OTP
  OTP: {
    SEND: '/otp/send',
    VERIFY: '/otp/verify',
    RESEND: '/otp/resend',
  },

  // File Upload
  FILE: {
    UPLOAD: '/files/upload',
    DOWNLOAD: (fileId: string) => `/files/${fileId}`,
    DELETE: (fileId: string) => `/files/${fileId}`,
  },

  // Dashboard
  DASHBOARD: {
    ADMIN: '/dashboard/admin',
    RECRUITER: (recruiterId: string) => `/dashboard/recruiter/${recruiterId}`,
    INTERVIEWER: (interviewerId: string) => `/dashboard/interviewer/${interviewerId}`,
    CANDIDATE: (candidateId: string) => `/dashboard/candidate/${candidateId}`,
  },
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  USER_ROLE: 'user_role',
  THEME_PREFERENCE: 'theme_preference',
} as const;

/**
 * HTTP headers
 */
export const HTTP_HEADERS = {
  AUTHORIZATION: 'Authorization',
  CONTENT_TYPE: 'Content-Type',
  ACCEPT: 'Accept',
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  // Network and connection errors
  NETWORK_ERROR:
    'Unable to connect to the server. Please check your internet connection and try again.',
  TIMEOUT_ERROR: 'Request timed out. The server is taking too long to respond. Please try again.',

  // Authentication errors
  UNAUTHORIZED: 'Your session has expired. Please login again.',
  INVALID_CREDENTIALS: 'Invalid email or password. Please check your credentials and try again.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  ACCOUNT_LOCKED: 'Your account has been locked. Please contact support.',

  // Authorization errors
  FORBIDDEN: 'You do not have permission to perform this action.',
  ACCESS_DENIED: 'Access denied. You are not authorized to view this resource.',

  // Server errors
  SERVER_ERROR: 'Something went wrong on our end. Please try again in a few moments.',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable. Please try again later.',
  GATEWAY_TIMEOUT: 'Server is not responding. Please try again later.',

  // Validation errors
  VALIDATION_ERROR: 'Please check the form for errors and try again.',
  INVALID_INPUT: 'Invalid input provided. Please check your data and try again.',
  MISSING_REQUIRED_FIELDS: 'Please fill in all required fields.',

  // Resource errors
  NOT_FOUND: 'The requested resource was not found.',
  ALREADY_EXISTS: 'This resource already exists. Please use a different value.',
  CONFLICT: 'A conflict occurred. The resource may already exist or be in use.',

  // Rate limiting
  TOO_MANY_REQUESTS: 'Too many requests. Please wait a moment and try again.',
  RATE_LIMIT_EXCEEDED: 'You have exceeded the rate limit. Please try again after some time.',

  // File upload errors
  FILE_UPLOAD_ERROR: 'Failed to upload file. Please try again.',
  FILE_SIZE_ERROR: 'File size exceeds the maximum limit of 5MB.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a valid file (PDF, JPG, PNG).',
  FILE_PROCESSING_ERROR: 'Error processing file. Please try uploading again.',

  // OTP errors
  OTP_EXPIRED: 'OTP has expired. Please request a new one.',
  OTP_INVALID: 'Invalid OTP. Please check and try again.',
  OTP_MAX_ATTEMPTS: 'Maximum OTP attempts exceeded. Please request a new OTP.',
  OTP_SEND_FAILED: 'Failed to send OTP. Please try again.',

  // Registration errors
  REGISTRATION_FAILED: 'Registration failed. Please check your information and try again.',
  EMAIL_ALREADY_EXISTS: 'This email is already registered. Please use a different email or login.',
  MOBILE_ALREADY_EXISTS: 'This mobile number is already registered.',

  // Interview errors
  INTERVIEW_NOT_FOUND: 'Interview not found or has been deleted.',
  INTERVIEW_ALREADY_SCHEDULED: 'An interview is already scheduled for this time slot.',
  CANNOT_MODIFY_INTERVIEW: 'Cannot modify a completed or cancelled interview.',

  // Generic fallback
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: 'Registration successful! Please wait for verification.',
  LOGIN_SUCCESS: 'Login successful!',
  PROFILE_UPDATED: 'Profile updated successfully.',
  FILE_UPLOADED: 'File uploaded successfully.',
  OTP_SENT: 'OTP sent successfully.',
  OTP_VERIFIED: 'Verification successful.',
  INTERVIEW_CREATED: 'Interview created successfully.',
  FEEDBACK_SUBMITTED: 'Feedback submitted successfully.',
} as const;
