/**
 * Interview details
 */
export interface Interview {
  id: string;
  title: string;
  description?: string;
  organisationId: string;
  candidateId?: string;
  interviewerIds: string[];
  scheduledDate?: Date;
  duration: number; // minutes
  type: InterviewType;
  round: number;
  status: InterviewStatus;
  location?: string; // physical location or meeting link
  notes?: string;
  feedback?: InterviewFeedback[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interview type enumeration
 */
export enum InterviewType {
  TECHNICAL = 'TECHNICAL',
  HR = 'HR',
  MANAGERIAL = 'MANAGERIAL',
  CODING = 'CODING',
  BEHAVIORAL = 'BEHAVIORAL',
  SYSTEM_DESIGN = 'SYSTEM_DESIGN',
}

/**
 * Interview status enumeration
 */
export enum InterviewStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

/**
 * Interview outcome enumeration
 */
export enum InterviewOutcome {
  SELECTED = 'SELECTED',
  SELECTED_NEXT_ROUND = 'SELECTED_NEXT_ROUND',
  REJECTED = 'REJECTED',
  ON_HOLD = 'ON_HOLD',
  PENDING = 'PENDING',
}

/**
 * Interview feedback
 */
export interface InterviewFeedback {
  interviewerId: string;
  rating: number; // 1-5 or 1-10
  comments?: string;
  strengths?: string[];
  weaknesses?: string[];
  outcome: InterviewOutcome;
  submittedAt: Date;
}

/**
 * Interview creation request
 */
export interface InterviewCreateRequest {
  title: string;
  description?: string;
  candidateEmail?: string; // if inviting specific candidate
  interviewerIds: string[];
  scheduledDate?: Date;
  duration: number;
  type: InterviewType;
  round: number;
  location?: string;
}

/**
 * Candidate interview link
 */
export interface CandidateInviteLink {
  interviewId: string;
  token: string;
  expiresAt: Date;
  isUsed: boolean;
}
