/**
 * Interview Status
 */
export enum InterviewStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  RESCHEDULED = 'RESCHEDULED',
}

/**
 * Interview Type (Round Type)
 */
export enum InterviewType {
  TECHNICAL = 'TECHNICAL',
  HR = 'HR',
  CULTURAL_FIT = 'CULTURAL_FIT',
  MANAGERIAL = 'MANAGERIAL',
}

/**
 * Candidate Status in Interview Process
 */
export enum CandidateStatus {
  INVITED = 'INVITED',
  INVITATION_ACCEPTED = 'INVITATION_ACCEPTED',
  INVITATION_DECLINED = 'INVITATION_DECLINED',
  SELECT_FOR_NEXT_ROUND = 'SELECT_FOR_NEXT_ROUND',
  SELECTED = 'SELECTED',
  REJECTED = 'REJECTED',
}

/**
 * Round Status
 */
export enum RoundStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/**
 * Feedback Recommendation
 */
export enum FeedbackRecommendation {
  STRONG_HIRE = 'STRONG_HIRE',
  HIRE = 'HIRE',
  HOLD = 'HOLD',
  NO_HIRE = 'NO_HIRE',
}

/**
 * Round Decision
 */
export enum RoundDecision {
  SELECT_FOR_NEXT_ROUND = 'SELECT_FOR_NEXT_ROUND',
  SELECTED = 'SELECTED',
  REJECTED = 'REJECTED',
}

/**
 * Interviewer Info (minimal info for display)
 */
export interface InterviewerInfo {
  id: string;
  name: string;
  email: string;
  expertise?: string;
  yearsOfExperience?: number;
  feedbackSubmitted?: boolean;
}

/**
 * Feedback Interface
 */
export interface Feedback {
  interviewerId: string;
  interviewerName?: string;
  recommendation: FeedbackRecommendation;
  rating: number;
  comments: string;
  strengths?: string[];
  improvements?: string[];
  submittedAt: string;
}

/**
 * Interview Round Interface
 */
export interface InterviewRound {
  roundId: string;
  roundNumber: number;
  type: InterviewType;
  scheduledDate: string;
  durationMinutes: number;
  interviewerIds: string[];
  interviewers?: InterviewerInfo[];
  status: RoundStatus;
  feedback: Feedback[];
  autoRecommendation?: FeedbackRecommendation;
  recruiterDecision?: RoundDecision;
  decidedBy?: string;
  decidedByName?: string;
  decidedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Interview Interface
 */
export interface Interview {
  id: string;
  organisationId: string;
  organisationName?: string;
  jobPosition: string;
  jobDescription?: string;
  candidateEmail: string;
  candidateId?: string;
  candidateName?: string;
  candidateStatus: CandidateStatus;
  overallStatus: InterviewStatus;
  createdBy?: string;
  createdByName?: string;
  totalRounds?: number;
  completedRounds?: number;
  currentRoundNumber?: number;
  rounds: InterviewRound[];
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interview Response (from API)
 */
export interface InterviewResponse extends Interview {}

/**
 * Create Interview DTO
 */
export interface CreateInterviewDto {
  jobPosition: string;
  jobDescription?: string;
  candidateEmail: string;
  rounds: CreateRoundDto[];
}

/**
 * Create Round DTO
 */
export interface CreateRoundDto {
  roundNumber: number;
  type: InterviewType;
  scheduledDate: string;
  durationMinutes: number;
  interviewerIds: string[];
}

/**
 * Update Interview DTO
 */
export interface UpdateInterviewDto {
  jobPosition?: string;
  jobDescription?: string;
  rounds?: CreateRoundDto[];
}

/**
 * Update Round DTO
 */
export interface UpdateRoundDto {
  type?: InterviewType;
  scheduledDate?: string;
  durationMinutes?: number;
  interviewerIds?: string[];
}

/**
 * Submit Feedback DTO
 */
export interface SubmitFeedbackDto {
  recommendation: FeedbackRecommendation;
  rating: number;
  comments: string;
  strengths?: string[];
  improvements?: string[];
}

/**
 * Make Decision DTO
 */
export interface MakeDecisionDto {
  decision: RoundDecision;
}

/**
 * Cancel Interview DTO
 */
export interface CancelInterviewDto {
  reason: string;
}

/**
 * Feedback History Entry
 */
export interface FeedbackHistoryEntry {
  roundId: string;
  roundNumber: number;
  roundType: InterviewType;
  autoRecommendation?: FeedbackRecommendation;
  recruiterDecision?: RoundDecision;
  feedbackList: Feedback[];
  decidedBy?: string;
  decidedByName?: string;
  decidedAt?: string;
}

/**
 * Interview Filter Options
 */
export interface InterviewFilterOptions {
  candidateEmail?: string;
  candidateName?: string;
  interviewerId?: string;
  status?: InterviewStatus[];
  startDate?: string;
  endDate?: string;
  jobPosition?: string;
}

/**
 * Upcoming Interview (for dashboard)
 */
export interface UpcomingInterview {
  interviewId: string;
  roundId: string;
  roundNumber: number;
  roundType: InterviewType;
  jobPosition: string;
  candidateName: string;
  scheduledDate: string;
  durationMinutes: number;
}
