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
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check the form for errors.',
  FILE_UPLOAD_ERROR: 'Failed to upload file. Please try again.',
  FILE_SIZE_ERROR: 'File size exceeds the maximum limit.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a valid file.',
  OTP_EXPIRED: 'OTP has expired. Please request a new one.',
  OTP_INVALID: 'Invalid OTP. Please try again.',
  REGISTRATION_FAILED: 'Registration failed. Please try again.',
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
