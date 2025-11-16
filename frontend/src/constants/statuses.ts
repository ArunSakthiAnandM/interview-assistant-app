import {
  InterviewStatus,
  InterviewType,
  CandidateStatus,
  RoundStatus,
  FeedbackRecommendation,
  RoundDecision,
} from '../models/interview.model';
import { VerificationStatus } from '../models/organisation.model';
import { InvitationStatus } from '../models/invitation.model';
import { AvailabilityStatus } from '../models/user.model';

/**
 * Interview Status Display Names
 */
export const INTERVIEW_STATUS_DISPLAY: Record<InterviewStatus, string> = {
  [InterviewStatus.SCHEDULED]: 'Scheduled',
  [InterviewStatus.IN_PROGRESS]: 'In Progress',
  [InterviewStatus.COMPLETED]: 'Completed',
  [InterviewStatus.CANCELLED]: 'Cancelled',
  [InterviewStatus.RESCHEDULED]: 'Rescheduled',
};

/**
 * Interview Status Colors (for badges/chips)
 */
export const INTERVIEW_STATUS_COLORS: Record<InterviewStatus, string> = {
  [InterviewStatus.SCHEDULED]: 'primary',
  [InterviewStatus.IN_PROGRESS]: 'accent',
  [InterviewStatus.COMPLETED]: 'success',
  [InterviewStatus.CANCELLED]: 'warn',
  [InterviewStatus.RESCHEDULED]: 'primary',
};

/**
 * Interview Type Display Names
 */
export const INTERVIEW_TYPE_DISPLAY: Record<InterviewType, string> = {
  [InterviewType.TECHNICAL]: 'Technical',
  [InterviewType.HR]: 'HR',
  [InterviewType.CULTURAL_FIT]: 'Cultural Fit',
  [InterviewType.MANAGERIAL]: 'Managerial',
};

/**
 * Interview Type Icons
 */
export const INTERVIEW_TYPE_ICONS: Record<InterviewType, string> = {
  [InterviewType.TECHNICAL]: 'code',
  [InterviewType.HR]: 'people',
  [InterviewType.CULTURAL_FIT]: 'diversity_3',
  [InterviewType.MANAGERIAL]: 'business',
};

/**
 * Candidate Status Display Names
 */
export const CANDIDATE_STATUS_DISPLAY: Record<CandidateStatus, string> = {
  [CandidateStatus.INVITED]: 'Invited',
  [CandidateStatus.INVITATION_ACCEPTED]: 'Accepted',
  [CandidateStatus.INVITATION_DECLINED]: 'Declined',
  [CandidateStatus.SELECT_FOR_NEXT_ROUND]: 'Selected for Next Round',
  [CandidateStatus.SELECTED]: 'Selected',
  [CandidateStatus.REJECTED]: 'Rejected',
};

/**
 * Candidate Status Colors
 */
export const CANDIDATE_STATUS_COLORS: Record<CandidateStatus, string> = {
  [CandidateStatus.INVITED]: 'primary',
  [CandidateStatus.INVITATION_ACCEPTED]: 'accent',
  [CandidateStatus.INVITATION_DECLINED]: 'warn',
  [CandidateStatus.SELECT_FOR_NEXT_ROUND]: 'success',
  [CandidateStatus.SELECTED]: 'success',
  [CandidateStatus.REJECTED]: 'warn',
};

/**
 * Round Status Display Names
 */
export const ROUND_STATUS_DISPLAY: Record<RoundStatus, string> = {
  [RoundStatus.SCHEDULED]: 'Scheduled',
  [RoundStatus.IN_PROGRESS]: 'In Progress',
  [RoundStatus.COMPLETED]: 'Completed',
  [RoundStatus.CANCELLED]: 'Cancelled',
};

/**
 * Feedback Recommendation Display Names
 */
export const FEEDBACK_RECOMMENDATION_DISPLAY: Record<FeedbackRecommendation, string> = {
  [FeedbackRecommendation.STRONG_HIRE]: 'Strong Hire',
  [FeedbackRecommendation.HIRE]: 'Hire',
  [FeedbackRecommendation.HOLD]: 'Hold',
  [FeedbackRecommendation.NO_HIRE]: 'No Hire',
};

/**
 * Feedback Recommendation Colors
 */
export const FEEDBACK_RECOMMENDATION_COLORS: Record<FeedbackRecommendation, string> = {
  [FeedbackRecommendation.STRONG_HIRE]: 'success',
  [FeedbackRecommendation.HIRE]: 'accent',
  [FeedbackRecommendation.HOLD]: 'warn',
  [FeedbackRecommendation.NO_HIRE]: 'error',
};

/**
 * Round Decision Display Names
 */
export const ROUND_DECISION_DISPLAY: Record<RoundDecision, string> = {
  [RoundDecision.SELECT_FOR_NEXT_ROUND]: 'Select for Next Round',
  [RoundDecision.SELECTED]: 'Selected',
  [RoundDecision.REJECTED]: 'Rejected',
};

/**
 * Verification Status Display Names
 */
export const VERIFICATION_STATUS_DISPLAY: Record<VerificationStatus, string> = {
  [VerificationStatus.PENDING]: 'Pending Verification',
  [VerificationStatus.VERIFIED]: 'Verified',
  [VerificationStatus.REJECTED]: 'Rejected',
};

/**
 * Verification Status Colors
 */
export const VERIFICATION_STATUS_COLORS: Record<VerificationStatus, string> = {
  [VerificationStatus.PENDING]: 'warn',
  [VerificationStatus.VERIFIED]: 'success',
  [VerificationStatus.REJECTED]: 'error',
};

/**
 * Invitation Status Display Names
 */
export const INVITATION_STATUS_DISPLAY: Record<InvitationStatus, string> = {
  [InvitationStatus.PENDING]: 'Pending',
  [InvitationStatus.ACCEPTED]: 'Accepted',
  [InvitationStatus.DECLINED]: 'Declined',
  [InvitationStatus.EXPIRED]: 'Expired',
};

/**
 * Invitation Status Colors
 */
export const INVITATION_STATUS_COLORS: Record<InvitationStatus, string> = {
  [InvitationStatus.PENDING]: 'primary',
  [InvitationStatus.ACCEPTED]: 'success',
  [InvitationStatus.DECLINED]: 'warn',
  [InvitationStatus.EXPIRED]: 'error',
};

/**
 * Availability Status Display Names
 */
export const AVAILABILITY_STATUS_DISPLAY: Record<AvailabilityStatus, string> = {
  [AvailabilityStatus.AVAILABLE]: 'Available',
  [AvailabilityStatus.BUSY]: 'Busy',
  [AvailabilityStatus.UNAVAILABLE]: 'Unavailable',
};

/**
 * Availability Status Colors
 */
export const AVAILABILITY_STATUS_COLORS: Record<AvailabilityStatus, string> = {
  [AvailabilityStatus.AVAILABLE]: 'success',
  [AvailabilityStatus.BUSY]: 'warn',
  [AvailabilityStatus.UNAVAILABLE]: 'error',
};

/**
 * Default Interview Duration Options (in minutes)
 */
export const INTERVIEW_DURATION_OPTIONS = [30, 45, 60, 90, 120];

/**
 * Default Invitation Expiry Options (in days)
 */
export const INVITATION_EXPIRY_OPTIONS = [3, 7, 14, 30];

/**
 * Rating Scale (for feedback)
 */
export const RATING_MIN = 0;
export const RATING_MAX = 10;

/**
 * Pagination Defaults
 */
export const PAGINATION_DEFAULTS = {
  PAGE: 0,
  SIZE: 10,
  SIZE_OPTIONS: [5, 10, 25, 50, 100],
};

/**
 * File Upload Limits
 */
export const FILE_UPLOAD_LIMITS = {
  RESUME: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
  KYC_DOCUMENT: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
  },
  FEEDBACK_ATTACHMENT: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'],
  },
};

/**
 * Date Format Patterns
 */
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy hh:mm a',
  API: "yyyy-MM-dd'T'HH:mm:ss",
  DATE_ONLY: 'yyyy-MM-dd',
  TIME_ONLY: 'hh:mm a',
};

/**
 * Toast Notification Durations (in ms)
 */
export const TOAST_DURATIONS = {
  SUCCESS: 3000,
  ERROR: 5000,
  WARNING: 4000,
  INFO: 3000,
};
