import { User } from './user.model';

/**
 * Interviewer profile
 */
export interface Interviewer extends User {
  firstName: string;
  lastName: string;
  organisationId: string;
  department?: string;
  designation: string;
  mobile?: string;
  expertise?: string[]; // Technical skills or domains
  yearsOfExperience?: number;
  isActive: boolean;
}

/**
 * Interviewer registration request
 */
export interface InterviewerRegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  organisationId: string;
  department?: string;
  designation: string;
  mobile?: string;
  expertise?: string[];
  password: string;
}

/**
 * Interviewer invite request (sent by org admin)
 */
export interface InterviewerInviteRequest {
  email: string;
  firstName: string;
  lastName: string;
  designation: string;
  department?: string;
}
