/**
 * Application Configuration Constants
 */

/**
 * API Configuration
 */
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

/**
 * Storage Keys for LocalStorage/SessionStorage
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_STATE: 'sidebar_state',
  DRAFT_INTERVIEW: 'draft_interview',
  DRAFT_ORG_REGISTRATION: 'draft_org_registration',
};

/**
 * Validation Patterns
 */
export const VALIDATION_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^[0-9]{10}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-zA-Z\d@$!%*?&]{8,}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
};

/**
 * Validation Error Messages
 */
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL: 'Please enter a valid email address',
  PHONE: 'Please enter a valid 10-digit phone number',
  PASSWORD:
    'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
  PASSWORD_MISMATCH: 'Passwords do not match',
  MIN_LENGTH: (min: number) => `Minimum ${min} characters required`,
  MAX_LENGTH: (max: number) => `Maximum ${max} characters allowed`,
  MIN_VALUE: (min: number) => `Minimum value is ${min}`,
  MAX_VALUE: (max: number) => `Maximum value is ${max}`,
  FILE_SIZE: (maxSizeMB: number) => `File size must not exceed ${maxSizeMB}MB`,
  FILE_TYPE: (types: string[]) => `Allowed file types: ${types.join(', ')}`,
};

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access forbidden.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  VALIDATION_ERROR: 'Please fix the errors in the form.',
  FILE_UPLOAD_ERROR: 'File upload failed. Please try again.',
  FILE_DOWNLOAD_ERROR: 'File download failed. Please try again.',
};

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  LOGOUT: 'Logged out successfully.',
  REGISTER: 'Registration successful!',
  ORG_REGISTERED: 'Organisation registered successfully! Waiting for admin verification.',
  PASSWORD_RESET_EMAIL_SENT: 'Password reset email sent! Please check your inbox.',
  PASSWORD_RESET: 'Password reset successful! Please login with your new password.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  INTERVIEW_CREATED: 'Interview created successfully.',
  INTERVIEW_UPDATED: 'Interview updated successfully.',
  INTERVIEW_CANCELLED: 'Interview cancelled successfully.',
  FEEDBACK_SUBMITTED: 'Feedback submitted successfully.',
  DECISION_MADE: 'Decision recorded successfully.',
  INVITATION_SENT: 'Invitation sent successfully.',
  INVITATION_ACCEPTED: 'Invitation accepted successfully.',
  INVITATION_DECLINED: 'Invitation declined.',
  FILE_UPLOADED: 'File uploaded successfully.',
  FILE_DELETED: 'File deleted successfully.',
  NOTIFICATION_MARKED_READ: 'Notification marked as read.',
  ORGANISATION_VERIFIED: 'Organisation verified successfully.',
  ORGANISATION_REJECTED: 'Organisation verification rejected.',
};

/**
 * Confirmation Messages
 */
export const CONFIRMATION_MESSAGES = {
  DELETE_USER: 'Are you sure you want to delete this user? This action cannot be undone.',
  DELETE_ORGANISATION:
    'Are you sure you want to delete this organisation? All associated data will be removed.',
  CANCEL_INTERVIEW:
    'Are you sure you want to cancel this interview? The candidate will be notified.',
  DECLINE_INVITATION: 'Are you sure you want to decline this invitation?',
  LOGOUT: 'Are you sure you want to logout?',
  DISCARD_CHANGES: 'You have unsaved changes. Are you sure you want to discard them?',
  DELETE_FILE: 'Are you sure you want to delete this file?',
};

/**
 * Loading Messages
 */
export const LOADING_MESSAGES = {
  LOADING: 'Loading...',
  PROCESSING: 'Processing...',
  UPLOADING: 'Uploading file...',
  DOWNLOADING: 'Downloading file...',
  SAVING: 'Saving...',
  DELETING: 'Deleting...',
  SENDING: 'Sending...',
};

/**
 * Empty State Messages
 */
export const EMPTY_STATE_MESSAGES = {
  NO_DATA: 'No data available',
  NO_INTERVIEWS: 'No interviews found',
  NO_USERS: 'No users found',
  NO_ORGANISATIONS: 'No organisations found',
  NO_INVITATIONS: 'No invitations found',
  NO_NOTIFICATIONS: 'No notifications',
  NO_FEEDBACK: 'No feedback submitted yet',
  NO_RESULTS: 'No results found for your search',
};

/**
 * Application Metadata
 */
export const APP_METADATA = {
  NAME: 'Interview Organiser',
  DESCRIPTION: 'Professional interview management platform',
  VERSION: '1.0.0',
  AUTHOR: 'Interview Assistant Team',
  SUPPORT_EMAIL: 'support@intervieworganiser.com',
};

/**
 * Feature Flags (for progressive feature rollout)
 */
export const FEATURE_FLAGS = {
  REAL_TIME_NOTIFICATIONS: false, // Enable WebSocket notifications
  BULK_OPERATIONS: false, // Enable bulk user operations
  EXPORT_TO_CSV: false, // Enable CSV export
  ADVANCED_ANALYTICS: false, // Enable advanced analytics dashboard
  EMAIL_TEMPLATES_PREVIEW: false, // Enable email template preview
  BREADCRUMBS: false, // Enable breadcrumb navigation
  PWA: false, // Enable PWA features
};

/**
 * Theme Configuration
 */
export const THEME_CONFIG = {
  DEFAULT_THEME: 'light',
  AVAILABLE_THEMES: ['light', 'dark'],
  PRIMARY_COLOR: 'blue',
  ACCENT_COLOR: 'azure',
};
