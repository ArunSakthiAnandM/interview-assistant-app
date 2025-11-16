/**
 * Base API URL
 * Note: In production, this should be configured via environment variables
 */
const API_BASE_URL = 'http://localhost:8080/api/v1';

/**
 * API Endpoints organized by feature
 */
export const API_ENDPOINTS = {
  /**
   * Health Check Endpoints
   */
  HEALTH: {
    BASE: `${API_BASE_URL}/health`,
    DETAILED: `${API_BASE_URL}/health/detailed`,
    PING: `${API_BASE_URL}/health/ping`,
    READY: `${API_BASE_URL}/health/ready`,
    LIVE: `${API_BASE_URL}/health/live`,
  },

  /**
   * Authentication Endpoints
   */
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  },

  /**
   * Organisation Endpoints
   */
  ORGANISATIONS: {
    BASE: `${API_BASE_URL}/organisations`,
    REGISTER: `${API_BASE_URL}/organisations/register`,
    MY: `${API_BASE_URL}/organisations/my`,
    DETAIL: (id: string) => `${API_BASE_URL}/organisations/${id}`,
    VERIFY: (id: string) => `${API_BASE_URL}/organisations/${id}/verify`,
    RESUBMIT: (id: string) => `${API_BASE_URL}/organisations/${id}/resubmit`,
    VERIFICATION_HISTORY: (id: string) =>
      `${API_BASE_URL}/organisations/${id}/verification-history`,
    BY_STATUS: (status: string) => `${API_BASE_URL}/organisations/status/${status}`,
    SEARCH: `${API_BASE_URL}/organisations/search`,
  },

  /**
   * User Endpoints
   */
  USERS: {
    BASE: `${API_BASE_URL}/users`,
    REGISTER: `${API_BASE_URL}/users/register`,
    ME: `${API_BASE_URL}/users/me`,
    DETAIL: (id: string) => `${API_BASE_URL}/users/${id}`,
    BY_ROLE: (role: string) => `${API_BASE_URL}/users/role/${role}`,
    BY_ORGANISATION: (orgId: string) => `${API_BASE_URL}/users/organisation/${orgId}`,
    SEARCH: `${API_BASE_URL}/users/search`,
  },

  /**
   * Invitation Endpoints
   */
  INVITATIONS: {
    BASE: `${API_BASE_URL}/invitations`,
    SEND: `${API_BASE_URL}/invitations/send`,
    DETAIL: (id: string) => `${API_BASE_URL}/invitations/${id}`,
    ACCEPT: (id: string) => `${API_BASE_URL}/invitations/${id}/accept`,
    DECLINE: (id: string) => `${API_BASE_URL}/invitations/${id}/decline`,
    EXTEND: (id: string) => `${API_BASE_URL}/invitations/${id}/extend`,
    MY: `${API_BASE_URL}/invitations/my`,
    BY_ORGANISATION: (orgId: string) => `${API_BASE_URL}/invitations/organisation/${orgId}`,
  },

  /**
   * Interview Endpoints
   */
  INTERVIEWS: {
    BASE: `${API_BASE_URL}/interviews`,
    DETAIL: (id: string) => `${API_BASE_URL}/interviews/${id}`,
    ACCEPT: (id: string) => `${API_BASE_URL}/interviews/${id}/accept`,
    DECLINE: (id: string) => `${API_BASE_URL}/interviews/${id}/decline`,
    CANCEL: (id: string) => `${API_BASE_URL}/interviews/${id}/cancel`,
    BY_ORGANISATION: (orgId: string) => `${API_BASE_URL}/interviews/organisation/${orgId}`,
    BY_RECRUITER: (recruiterId: string) => `${API_BASE_URL}/interviews/recruiter/${recruiterId}`,
    BY_INTERVIEWER: (interviewerId: string) =>
      `${API_BASE_URL}/interviews/interviewer/${interviewerId}`,
    BY_CANDIDATE: (candidateId: string) => `${API_BASE_URL}/interviews/candidate/${candidateId}`,
    SEARCH: `${API_BASE_URL}/interviews/search`,
    FEEDBACK_HISTORY: (id: string) => `${API_BASE_URL}/interviews/${id}/feedback-history`,

    // Round Endpoints
    ROUNDS: {
      ADD: (interviewId: string) => `${API_BASE_URL}/interviews/${interviewId}/rounds`,
      UPDATE: (interviewId: string, roundId: string) =>
        `${API_BASE_URL}/interviews/${interviewId}/rounds/${roundId}`,
      FEEDBACK: (interviewId: string, roundId: string) =>
        `${API_BASE_URL}/interviews/${interviewId}/rounds/${roundId}/feedback`,
      DECISION: (interviewId: string, roundId: string) =>
        `${API_BASE_URL}/interviews/${interviewId}/rounds/${roundId}/decision`,
    },
  },

  /**
   * Dashboard Endpoints
   */
  DASHBOARD: {
    ADMIN: `${API_BASE_URL}/dashboard/admin`,
    ORGANISATION: (id: string) => `${API_BASE_URL}/dashboard/organisation/${id}`,
    RECRUITER: (id: string) => `${API_BASE_URL}/dashboard/recruiter/${id}`,
    INTERVIEWER: (id: string) => `${API_BASE_URL}/dashboard/interviewer/${id}`,
    CANDIDATE: (id: string) => `${API_BASE_URL}/dashboard/candidate/${id}`,
  },

  /**
   * Notification Endpoints (New)
   */
  NOTIFICATIONS: {
    BASE: `${API_BASE_URL}/notifications`,
    MY: `${API_BASE_URL}/notifications/my`,
    DETAIL: (id: string) => `${API_BASE_URL}/notifications/${id}`,
    MARK_READ: (id: string) => `${API_BASE_URL}/notifications/${id}/mark-read`,
    MARK_ALL_READ: `${API_BASE_URL}/notifications/mark-all-read`,
    UNREAD_COUNT: `${API_BASE_URL}/notifications/unread-count`,
    DELETE: (id: string) => `${API_BASE_URL}/notifications/${id}`,
  },

  /**
   * Interviewer Availability Endpoints (New)
   */
  AVAILABILITY: {
    GET: (interviewerId: string) => `${API_BASE_URL}/interviewers/${interviewerId}/availability`,
    SET: (interviewerId: string) => `${API_BASE_URL}/interviewers/${interviewerId}/availability`,
    CALENDAR: (interviewerId: string) => `${API_BASE_URL}/interviewers/${interviewerId}/calendar`,
  },

  /**
   * Interviewer Filter Endpoints (New)
   */
  INTERVIEWERS: {
    FILTER: (orgId: string) => `${API_BASE_URL}/users/organisation/${orgId}/interviewers/filter`,
  },

  /**
   * File Management Endpoints (New)
   */
  FILES: {
    UPLOAD: `${API_BASE_URL}/files/upload`,
    PREVIEW: (fileId: string) => `${API_BASE_URL}/files/preview/${fileId}`,
    DOWNLOAD: (fileId: string) => `${API_BASE_URL}/files/download/${fileId}`,
    VERSIONS: (entityType: string, entityId: string) =>
      `${API_BASE_URL}/files/versions/${entityType}/${entityId}`,
    DELETE: (fileId: string) => `${API_BASE_URL}/files/${fileId}`,
  },
} as const;
