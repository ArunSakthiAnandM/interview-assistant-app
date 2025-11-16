/**
 * Application Route Paths
 */
export const ROUTES = {
  // Public routes
  HOME: '',
  LOGIN: 'login',
  REGISTER: 'register',
  FORGOT_PASSWORD: 'forgot-password',
  RESET_PASSWORD: 'reset-password',
  ORG_REGISTER: 'org-register',

  // Authenticated base
  APP: 'app',

  // Admin routes
  ADMIN: {
    BASE: 'admin',
    DASHBOARD: 'admin/dashboard',
    ORGANISATIONS: 'admin/organisations',
    ORGANISATION_DETAIL: 'admin/organisations/:id',
    ORGANISATION_VERIFY: 'admin/organisations/:id/verify',
    USERS: 'admin/users',
    USER_DETAIL: 'admin/users/:id',
    INTERVIEWS: 'admin/interviews',
    ANALYTICS: 'admin/analytics',
  },

  // Organisation Admin routes
  ORGANISATION: {
    BASE: 'organisation',
    DASHBOARD: 'organisation/dashboard',
    PROFILE: 'organisation/profile',
    EDIT: 'organisation/edit',
    VERIFICATION: 'organisation/verification',
    VERIFICATION_HISTORY: 'organisation/verification-history',
    RESUBMIT: 'organisation/resubmit',
    RECRUITERS: 'organisation/recruiters',
    INTERVIEWERS: 'organisation/interviewers',
    INVITE: 'organisation/invite',
    INTERVIEWS: 'organisation/interviews',
  },

  // Recruiter routes
  RECRUITER: {
    BASE: 'recruiter',
    DASHBOARD: 'recruiter/dashboard',
    INTERVIEWS: 'recruiter/interviews',
    INTERVIEW_CREATE: 'recruiter/interviews/create',
    INTERVIEW_DETAIL: 'recruiter/interviews/:id',
    INTERVIEW_EDIT: 'recruiter/interviews/:id/edit',
    ROUND_ADD: 'recruiter/interviews/:id/rounds/add',
    ROUND_EDIT: 'recruiter/interviews/:id/rounds/:roundId/edit',
    DECISION: 'recruiter/interviews/:id/rounds/:roundId/decision',
    ANALYTICS: 'recruiter/analytics',
    CANDIDATES: 'recruiter/candidates',
  },

  // Interviewer routes
  INTERVIEWER: {
    BASE: 'interviewer',
    DASHBOARD: 'interviewer/dashboard',
    INTERVIEWS: 'interviewer/interviews',
    INTERVIEW_DETAIL: 'interviewer/interviews/:id',
    FEEDBACK: 'interviewer/interviews/:interviewId/rounds/:roundId/feedback',
    AVAILABILITY: 'interviewer/availability',
    CALENDAR: 'interviewer/calendar',
  },

  // Candidate routes
  CANDIDATE: {
    BASE: 'candidate',
    DASHBOARD: 'candidate/dashboard',
    INTERVIEWS: 'candidate/interviews',
    INTERVIEW_DETAIL: 'candidate/interviews/:id',
    PROFILE: 'candidate/profile',
  },

  // Shared routes (all authenticated users)
  PROFILE: 'profile',
  PROFILE_EDIT: 'profile/edit',
  NOTIFICATIONS: 'notifications',
  INVITATIONS: 'invitations',
  INVITATION_DETAIL: 'invitations/:id',

  // Error routes
  UNAUTHORIZED: 'unauthorized',
  NOT_FOUND: '404',
  ERROR: 'error',
} as const;

/**
 * Helper function to build route with parameters
 */
export function buildRoute(route: string, params: Record<string, string>): string {
  let builtRoute = route;
  Object.entries(params).forEach(([key, value]) => {
    builtRoute = builtRoute.replace(`:${key}`, value);
  });
  return builtRoute;
}

/**
 * Route Titles for breadcrumbs and page titles
 */
export const ROUTE_TITLES: Record<string, string> = {
  // Public
  [ROUTES.HOME]: 'Home',
  [ROUTES.LOGIN]: 'Login',
  [ROUTES.REGISTER]: 'Register',
  [ROUTES.FORGOT_PASSWORD]: 'Forgot Password',
  [ROUTES.RESET_PASSWORD]: 'Reset Password',
  [ROUTES.ORG_REGISTER]: 'Organisation Registration',

  // Admin
  [ROUTES.ADMIN.DASHBOARD]: 'Admin Dashboard',
  [ROUTES.ADMIN.ORGANISATIONS]: 'Organisations',
  [ROUTES.ADMIN.USERS]: 'Users',
  [ROUTES.ADMIN.INTERVIEWS]: 'All Interviews',
  [ROUTES.ADMIN.ANALYTICS]: 'System Analytics',

  // Organisation
  [ROUTES.ORGANISATION.DASHBOARD]: 'Organisation Dashboard',
  [ROUTES.ORGANISATION.PROFILE]: 'Organisation Profile',
  [ROUTES.ORGANISATION.RECRUITERS]: 'Recruiters',
  [ROUTES.ORGANISATION.INTERVIEWERS]: 'Interviewers',
  [ROUTES.ORGANISATION.INTERVIEWS]: 'Interviews',

  // Recruiter
  [ROUTES.RECRUITER.DASHBOARD]: 'Recruiter Dashboard',
  [ROUTES.RECRUITER.INTERVIEWS]: 'My Interviews',
  [ROUTES.RECRUITER.INTERVIEW_CREATE]: 'Create Interview',
  [ROUTES.RECRUITER.ANALYTICS]: 'Analytics',
  [ROUTES.RECRUITER.CANDIDATES]: 'Candidates',

  // Interviewer
  [ROUTES.INTERVIEWER.DASHBOARD]: 'Interviewer Dashboard',
  [ROUTES.INTERVIEWER.INTERVIEWS]: 'Assigned Interviews',
  [ROUTES.INTERVIEWER.AVAILABILITY]: 'My Availability',
  [ROUTES.INTERVIEWER.CALENDAR]: 'Calendar',

  // Candidate
  [ROUTES.CANDIDATE.DASHBOARD]: 'My Dashboard',
  [ROUTES.CANDIDATE.INTERVIEWS]: 'My Interviews',
  [ROUTES.CANDIDATE.PROFILE]: 'My Profile',

  // Shared
  [ROUTES.PROFILE]: 'Profile',
  [ROUTES.NOTIFICATIONS]: 'Notifications',
  [ROUTES.INVITATIONS]: 'Invitations',

  // Error
  [ROUTES.UNAUTHORIZED]: 'Unauthorized',
  [ROUTES.NOT_FOUND]: 'Page Not Found',
  [ROUTES.ERROR]: 'Error',
};
