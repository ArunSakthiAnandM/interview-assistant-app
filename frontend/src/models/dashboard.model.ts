import { UpcomingInterview } from './interview.model';

/**
 * Admin Dashboard Response
 */
export interface AdminDashboardResponse {
  totalOrganisations: number;
  verifiedOrganisations: number;
  pendingVerifications: number;
  rejectedOrganisations: number;
  totalUsers: number;
  usersByRole: {
    RECRUITER: number;
    INTERVIEWER: number;
    CANDIDATE: number;
    ORGANISATION_ADMIN: number;
  };
  activeInterviews: number;
  completedInterviews: number;
  interviewsByStatus: {
    SCHEDULED: number;
    IN_PROGRESS: number;
    COMPLETED: number;
    CANCELLED: number;
  };
  recentActivity: ActivityEntry[];
}

/**
 * Organisation Dashboard Response
 */
export interface OrganisationDashboardResponse {
  organisationId: string;
  organisationName: string;
  totalRecruiters: number;
  totalInterviewers: number;
  totalCandidates: number;
  interviewsInProgress: number;
  interviewsCompleted: number;
  pendingDecisions: number;
  upcomingInterviews: UpcomingInterview[];
  successRate?: number;
  averageInterviewDuration?: number;
}

/**
 * Recruiter Dashboard Response
 */
export interface RecruiterDashboardResponse {
  recruiterId: string;
  recruiterName: string;
  interviewsCreated: number;
  candidatesInPipeline: number;
  upcomingInterviews: UpcomingInterview[];
  pendingDecisions: number;
  completedThisMonth: number;
  successRate: number;
  recentInterviews: RecentInterviewSummary[];
}

/**
 * Interviewer Dashboard Response
 */
export interface InterviewerDashboardResponse {
  interviewerId: string;
  interviewerName: string;
  assignedInterviews: number;
  pendingFeedback: number;
  upcomingInterviews: UpcomingInterview[];
  feedbackSubmittedCount: number;
  averageRatingGiven: number;
  nextScheduledRound?: UpcomingInterview;
  recentFeedback: RecentFeedbackSummary[];
}

/**
 * Candidate Dashboard Response
 */
export interface CandidateDashboardResponse {
  candidateId: string;
  candidateName: string;
  totalInterviews: number;
  upcomingRounds: number;
  interviewsByStatus: {
    IN_PROGRESS: number;
    CANCELLED: number;
    COMPLETED: number;
    RESCHEDULED: number;
    SCHEDULED: number;
  };
  selectedCount: number;
  rejectedCount: number;
  inProgressCount: number;
  upcomingSchedule: UpcomingInterview[];
}

/**
 * Activity Entry (for Admin Dashboard)
 */
export interface ActivityEntry {
  id: string;
  type:
    | 'ORGANISATION_REGISTERED'
    | 'ORGANISATION_VERIFIED'
    | 'INTERVIEW_CREATED'
    | 'INTERVIEW_COMPLETED'
    | 'USER_REGISTERED';
  description: string;
  timestamp: string;
  actorId?: string;
  actorName?: string;
}

/**
 * Recent Interview Summary
 */
export interface RecentInterviewSummary {
  interviewId: string;
  jobPosition: string;
  candidateName: string;
  status: string;
  currentRound: number;
  totalRounds: number;
  lastUpdated: string;
}

/**
 * Recent Feedback Summary
 */
export interface RecentFeedbackSummary {
  interviewId: string;
  roundNumber: number;
  jobPosition: string;
  candidateName: string;
  recommendation: string;
  rating: number;
  submittedAt: string;
}

/**
 * Recent Update Entry (for Candidate Dashboard)
 */
export interface RecentUpdateEntry {
  id: string;
  interviewId: string;
  jobPosition: string;
  updateType: 'INVITATION' | 'SCHEDULED' | 'COMPLETED' | 'DECISION';
  message: string;
  timestamp: string;
}
