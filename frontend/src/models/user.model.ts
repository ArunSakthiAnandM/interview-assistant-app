/**
 * User role enumeration
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  RECRUITER = 'RECRUITER',
  INTERVIEWER = 'INTERVIEWER',
  CANDIDATE = 'CANDIDATE',
}

/**
 * User verification status
 */
export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

/**
 * Base user interface
 */
export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  // Optional fields that may be present in extended models
  firstName?: string;
  lastName?: string;
  recruiterId?: string;
  recruiterName?: string;
}

/**
 * Authentication response from backend
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  user: User;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}
