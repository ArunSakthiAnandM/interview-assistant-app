/**
 * User Role Enum
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  ORGANISATION_ADMIN = 'ORGANISATION_ADMIN',
  RECRUITER = 'RECRUITER',
  INTERVIEWER = 'INTERVIEWER',
  CANDIDATE = 'CANDIDATE',
}

/**
 * Availability Status for Interviewers
 */
export enum AvailabilityStatus {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  UNAVAILABLE = 'UNAVAILABLE',
}

/**
 * User Interface - Complete user profile
 */
export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  address?: string;
  role: UserRole;
  skills?: string;
  experience?: string;
  expertise?: string;
  yearsOfExperience?: number;
  specialization?: string;
  resumeUrl?: string;
  resumeVersions?: FileVersion[];
  expectedSalary?: number;
  organisationId?: string;
  organisationName?: string;
  availabilityStatus?: AvailabilityStatus;
  lastActive?: string;
  interviewsCompleted?: number;
  averageRating?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * File Version Interface
 */
export interface FileVersion {
  id: string;
  version: number;
  url: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: string;
}

/**
 * User Response (from API)
 */
export interface UserResponse extends User {}

/**
 * Register User DTO
 */
export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: UserRole;
  address?: string;
  skills?: string;
  experience?: string;
  expertise?: string;
  yearsOfExperience?: number;
  specialization?: string;
  resumeBase64?: string;
  expectedSalary?: number;
}

/**
 * Update User DTO
 */
export interface UpdateUserDto {
  name?: string;
  phoneNumber?: string;
  address?: string;
  skills?: string;
  experience?: string;
  expertise?: string;
  yearsOfExperience?: number;
  specialization?: string;
  resumeBase64?: string;
  expectedSalary?: number;
  availabilityStatus?: AvailabilityStatus;
}

/**
 * User Filter Options
 */
export interface UserFilterOptions {
  role?: UserRole;
  organisationId?: string;
  name?: string;
  email?: string;
  skills?: string;
  minExperience?: number;
  maxExperience?: number;
}

/**
 * Interviewer with Match Score (for filtering)
 */
export interface InterviewerWithScore extends User {
  matchScore: number;
  availableSlots: number;
}
