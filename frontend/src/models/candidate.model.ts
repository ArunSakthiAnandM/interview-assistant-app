import { User } from './user.model';

/**
 * Candidate profile
 */
export interface Candidate extends User {
  firstName: string;
  lastName: string;
  mobile: string;
  mobileVerified: boolean;
  emailVerified: boolean;
  resume?: string; // URL to resume
  skills?: string[];
  experience?: number; // years of experience
  education?: Education[];
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

/**
 * Education details
 */
export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  grade?: string;
}

/**
 * Candidate registration request
 */
export interface CandidateRegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
}

/**
 * OTP verification request
 */
export interface OTPVerificationRequest {
  identifier: string; // email or mobile
  otp: string;
  verificationType: OTPType;
}

/**
 * OTP send request
 */
export interface OTPSendRequest {
  identifier: string; // email or mobile
  type: OTPType;
}

/**
 * OTP type enumeration
 */
export enum OTPType {
  EMAIL = 'EMAIL',
  MOBILE = 'MOBILE',
}

/**
 * OTP verification response
 */
export interface OTPVerificationResponse {
  verified: boolean;
  message: string;
}
