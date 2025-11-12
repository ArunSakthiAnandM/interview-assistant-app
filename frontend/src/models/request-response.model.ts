/**
 * Request/Response Models
 * Contains all request and response interfaces used across services
 */

import { Interview, InterviewResult } from './interview.model';
import { Recruiter } from './recruiter.model';
import { Interviewer } from './interviewer.model';
import { Candidate } from './candidate.model';

/**
 * Backend Paginated Response (as per API.md)
 * This matches the Spring Boot backend pagination format
 */
export interface BackendPaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/**
 * Paginated Recruiter Response
 */
export interface PaginatedRecruiterResponse extends BackendPaginatedResponse<Recruiter> {}

/**
 * Paginated Interviewer Response
 */
export interface PaginatedInterviewerResponse extends BackendPaginatedResponse<Interviewer> {}

/**
 * Paginated Candidate Response
 */
export interface PaginatedCandidateResponse extends BackendPaginatedResponse<Candidate> {}

/**
 * Paginated Interview Response
 */
export interface PaginatedInterviewResponse extends BackendPaginatedResponse<Interview> {}

/**
 * Candidate Invite Request
 */
export interface CandidateInviteRequest {
  candidateId: string;
}

/**
 * Invitation Response Request
 */
export interface InvitationResponseRequest {
  token: string;
  response: 'ACCEPT' | 'REJECT';
}

/**
 * Interview Confirmation Request
 */
export interface InterviewConfirmRequest {
  interviewId: string;
  candidateId: string;
  confirmed: boolean;
  notes?: string;
}

/**
 * Interview Result Request
 */
export interface InterviewResultRequest {
  interviewId: string;
  result: InterviewResult;
  comments?: string;
}

/**
 * Next Round Interview Request
 */
export interface NextRoundInterviewRequest {
  previousInterviewId: string;
  scheduledAt: Date;
  duration: number;
  interviewType: string;
  interviewerIds: string[];
  meetingLink?: string;
  location?: string;
  notes?: string;
}
