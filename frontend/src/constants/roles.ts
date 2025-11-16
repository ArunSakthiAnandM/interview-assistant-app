import { UserRole } from '../models/user.model';

/**
 * Role Display Names
 */
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'System Administrator',
  [UserRole.ORGANISATION_ADMIN]: 'Organisation Admin',
  [UserRole.RECRUITER]: 'Recruiter',
  [UserRole.INTERVIEWER]: 'Interviewer',
  [UserRole.CANDIDATE]: 'Candidate',
};

/**
 * Role Descriptions
 */
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Full system access with ability to manage all organisations and users',
  [UserRole.ORGANISATION_ADMIN]:
    'Manage organisation profile, invite users, and oversee all interviews',
  [UserRole.RECRUITER]: 'Create and manage interviews, schedule rounds, and make hiring decisions',
  [UserRole.INTERVIEWER]: 'Conduct interviews and provide feedback on candidates',
  [UserRole.CANDIDATE]: 'View interview invitations and track application status',
};

/**
 * Role Permissions
 */
export const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: [
    'VIEW_ALL_ORGANISATIONS',
    'VERIFY_ORGANISATIONS',
    'DELETE_ORGANISATIONS',
    'VIEW_ALL_USERS',
    'CREATE_USERS',
    'UPDATE_USERS',
    'DELETE_USERS',
    'VIEW_ALL_INTERVIEWS',
    'VIEW_SYSTEM_ANALYTICS',
  ],
  [UserRole.ORGANISATION_ADMIN]: [
    'VIEW_OWN_ORGANISATION',
    'UPDATE_OWN_ORGANISATION',
    'INVITE_USERS',
    'VIEW_ORG_USERS',
    'VIEW_ORG_INTERVIEWS',
    'CREATE_INTERVIEWS',
    'UPDATE_INTERVIEWS',
    'DELETE_INTERVIEWS',
    'VIEW_FEEDBACK',
    'MAKE_DECISIONS',
  ],
  [UserRole.RECRUITER]: [
    'VIEW_OWN_ORGANISATION',
    'INVITE_INTERVIEWERS',
    'CREATE_INTERVIEWS',
    'UPDATE_INTERVIEWS',
    'DELETE_INTERVIEWS',
    'SCHEDULE_ROUNDS',
    'ASSIGN_INTERVIEWERS',
    'VIEW_FEEDBACK',
    'MAKE_DECISIONS',
  ],
  [UserRole.INTERVIEWER]: [
    'VIEW_ASSIGNED_INTERVIEWS',
    'SUBMIT_FEEDBACK',
    'VIEW_ROUND_FEEDBACK',
    'MANAGE_AVAILABILITY',
  ],
  [UserRole.CANDIDATE]: [
    'VIEW_OWN_INTERVIEWS',
    'ACCEPT_INTERVIEWS',
    'DECLINE_INTERVIEWS',
    'UPDATE_PROFILE',
  ],
} as const;

/**
 * Role Hierarchy (higher number = higher privileges)
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.ADMIN]: 5,
  [UserRole.ORGANISATION_ADMIN]: 4,
  [UserRole.RECRUITER]: 3,
  [UserRole.INTERVIEWER]: 2,
  [UserRole.CANDIDATE]: 1,
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] as readonly string[];
  return permissions.includes(permission);
}

/**
 * Check if a role has higher or equal hierarchy level
 */
export function hasHigherOrEqualRole(role: UserRole, comparisonRole: UserRole): boolean {
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[comparisonRole];
}

/**
 * Get allowed roles for invitation (based on current user role)
 */
export function getAllowedInvitationRoles(currentRole: UserRole): UserRole[] {
  switch (currentRole) {
    case UserRole.ADMIN:
      return [UserRole.ORGANISATION_ADMIN];
    case UserRole.ORGANISATION_ADMIN:
      return [UserRole.RECRUITER, UserRole.INTERVIEWER];
    case UserRole.RECRUITER:
      return [UserRole.INTERVIEWER];
    default:
      return [];
  }
}

/**
 * Get navigation routes based on user role
 */
export function getNavigationRoutes(role: UserRole): string[] {
  switch (role) {
    case UserRole.ADMIN:
      return [
        '/app/admin/dashboard',
        '/app/admin/organisations',
        '/app/admin/users',
        '/app/admin/interviews',
      ];
    case UserRole.ORGANISATION_ADMIN:
      return [
        '/app/organisation/dashboard',
        '/app/organisation/profile',
        '/app/organisation/recruiters',
        '/app/organisation/interviewers',
        '/app/organisation/interviews',
      ];
    case UserRole.RECRUITER:
      return [
        '/app/recruiter/dashboard',
        '/app/recruiter/interviews',
        '/app/recruiter/candidates',
        '/app/recruiter/analytics',
      ];
    case UserRole.INTERVIEWER:
      return [
        '/app/interviewer/dashboard',
        '/app/interviewer/interviews',
        '/app/interviewer/availability',
      ];
    case UserRole.CANDIDATE:
      return ['/app/candidate/dashboard', '/app/candidate/interviews', '/app/candidate/profile'];
    default:
      return [];
  }
}

/**
 * Get default route after login based on role
 */
export function getDefaultRouteForRole(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return '/app/admin/dashboard';
    case UserRole.ORGANISATION_ADMIN:
      return '/app/organisation/dashboard';
    case UserRole.RECRUITER:
      return '/app/recruiter/dashboard';
    case UserRole.INTERVIEWER:
      return '/app/interviewer/dashboard';
    case UserRole.CANDIDATE:
      return '/app/candidate/dashboard';
    default:
      return '/';
  }
}
