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
    VERIFY_TOKEN: '/auth/verify',
    REGISTER: '/auth/register',
  },

  // Recruiter
  RECRUITER: {
    BASE: '/recruiters',
    REGISTER: '/recruiters/register',
    BY_ID: (id: string) => `/recruiters/${id}`,
    VERIFY: (id: string) => `/recruiters/${id}/verify`,
    REJECT: (id: string) => `/recruiters/${id}/reject`,
    KYC_UPLOAD: (id: string) => `/recruiters/${id}/kyc`,
  },

  // Candidate
  CANDIDATE: {
    BASE: '/candidates',
    REGISTER: '/candidates/register',
    BY_ID: (id: string) => `/candidates/${id}`,
    PROFILE: '/candidates/profile',
    UPDATE_PROFILE: '/candidates/profile/update',
  },

  // Interviewer
  INTERVIEWER: {
    BASE: '/interviewers',
    REGISTER: '/interviewers/register',
    BY_ID: (id: string) => `/interviewers/${id}`,
    BY_RECRUITER: (recruiterId: string) => `/interviewers/recruiter/${recruiterId}`,
    INVITE: '/interviewers/invite',
  },

  // Interview
  INTERVIEW: {
    BASE: '/interviews',
    CREATE: '/interviews/create',
    BY_ID: (id: string) => `/interviews/${id}`,
    BY_RECRUITER: (recruiterId: string) => `/interviews/recruiter/${recruiterId}`,
    BY_CANDIDATE: (candidateId: string) => `/interviews/candidate/${candidateId}`,
    UPDATE_STATUS: (id: string) => `/interviews/${id}/status`,
    SUBMIT_FEEDBACK: (id: string) => `/interviews/${id}/feedback`,
    GENERATE_INVITE: (id: string) => `/interviews/${id}/invite`,
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
