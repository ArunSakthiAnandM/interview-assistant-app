/**
 * Application configuration constants
 */

/**
 * File upload configuration
 */
export const FILE_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB in bytes
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  ALLOWED_EXTENSIONS: ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'],
} as const;

/**
 * Form validation patterns
 */
export const VALIDATION_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  MOBILE: /^[6-9]\d{9}$/, // Indian mobile number pattern
  MOBILE_INTERNATIONAL: /^\+?[1-9]\d{1,14}$/, // International format
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  POSTAL_CODE: /^[1-9][0-9]{5}$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  NAME: /^[a-zA-Z\s'-]+$/,
} as const;

/**
 * Validation messages
 */
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required.',
  EMAIL_INVALID: 'Please enter a valid email address.',
  MOBILE_INVALID: 'Please enter a valid mobile number.',
  PASSWORD_WEAK:
    'Password must be at least 8 characters with uppercase, lowercase, number, and special character.',
  URL_INVALID: 'Please enter a valid URL.',
  POSTAL_CODE_INVALID: 'Please enter a valid postal code.',
  NAME_INVALID: 'Name can only contain letters, spaces, hyphens, and apostrophes.',
  MIN_LENGTH: (min: number) => `Minimum ${min} characters required.`,
  MAX_LENGTH: (max: number) => `Maximum ${max} characters allowed.`,
  MIN_VALUE: (min: number) => `Minimum value is ${min}.`,
  MAX_VALUE: (max: number) => `Maximum value is ${max}.`,
} as const;

/**
 * OTP configuration
 */
export const OTP_CONFIG = {
  LENGTH: 6,
  EXPIRY_TIME: 10 * 60 * 1000, // 10 minutes in milliseconds
  RESEND_COOLDOWN: 60 * 1000, // 1 minute in milliseconds
  MAX_ATTEMPTS: 3,
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
} as const;

/**
 * Date/Time formats
 */
export const DATE_TIME_FORMATS = {
  DATE: 'dd/MM/yyyy',
  TIME: 'HH:mm',
  DATETIME: 'dd/MM/yyyy HH:mm',
  DATETIME_FULL: 'dd/MM/yyyy HH:mm:ss',
  ISO: "yyyy-MM-dd'T'HH:mm:ss",
} as const;

/**
 * Interview configuration
 */
export const INTERVIEW_CONFIG = {
  MIN_DURATION: 15, // minutes
  MAX_DURATION: 480, // 8 hours
  DEFAULT_DURATION: 60, // 1 hour
  NOTIFICATION_BEFORE: [24 * 60, 60, 15], // minutes before interview (1 day, 1 hour, 15 mins)
} as const;

/**
 * Application routes
 */
export const APP_ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  REGISTER: {
    ORGANISATION: '/register/organisation',
    CANDIDATE: '/register/candidate',
    INTERVIEWER: '/register/interviewer',
  },
  DASHBOARD: {
    ADMIN: '/dashboard/admin',
    ORGANISATION: '/dashboard/organisation',
    INTERVIEWER: '/dashboard/interviewer',
    CANDIDATE: '/dashboard/candidate',
  },
  INTERVIEW: {
    LIST: '/interviews',
    CREATE: '/interviews/create',
    DETAIL: (id: string) => `/interviews/${id}`,
    FEEDBACK: (id: string) => `/interviews/${id}/feedback`,
  },
  PROFILE: '/profile',
  NOT_FOUND: '/404',
} as const;
