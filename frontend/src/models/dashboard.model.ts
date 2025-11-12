/**
 * Dashboard Models
 * Contains all dashboard-related interfaces for different user roles
 */

/**
 * Admin Dashboard Stats
 */
export interface AdminDashboardStats {
  stats: {
    totalRecruiters: number;
    verifiedRecruiters: number;
    pendingRecruiters: number;
    totalUsers: number;
    totalInterviews: number;
    totalCandidates: number;
    activeInterviews: number;
  };
  pendingRecruiters: any[];
  recentRecruiters: any[];
  recentUsers: any[];
}

/**
 * Recruiter Dashboard Stats
 */
export interface RecruiterDashboardStats {
  stats: {
    totalCandidates: number;
    activeCandidates: number;
    totalInterviews: number;
    upcomingInterviews: number;
    completedInterviews: number;
    totalInterviewers: number;
    pendingFeedbacks: number;
  };
  recentCandidates: any[];
  upcomingInterviews: any[];
  availableInterviewers: any[];
}

/**
 * Interviewer Dashboard Stats
 */
export interface InterviewerDashboardStats {
  stats: {
    totalInterviews: number;
    upcomingInterviews: number;
    completedInterviews: number;
    pendingFeedbacks: number;
    availability: boolean;
  };
  assignedInterviews: any[];
  upcomingInterviews: any[];
  pendingFeedback: any[];
}

/**
 * Candidate Dashboard Stats
 */
export interface CandidateDashboardStats {
  stats: {
    totalInterviews: number;
    upcomingInterviews: number;
    completedInterviews: number;
    pendingConfirmations: number;
    currentStatus: string;
  };
  upcomingInterviews: any[];
  pastInterviews: any[];
  pendingConfirmations: any[];
}
