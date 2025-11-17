package interview.organiser.service;

import interview.organiser.constants.NotificationType;
import interview.organiser.model.dto.response.NotificationResponse;
import interview.organiser.model.entity.Interview;
import interview.organiser.model.entity.InterviewRound;
import java.util.List;

/**
 * Service interface for sending notifications (email + in-app)
 */
public interface NotificationService {

    // Email notifications (existing)

    /**
     * Send invitation email to recruiter/interviewer
     */
    void sendOrganisationInvitation(String email, String organisationName, String role, String invitationLink);

    /**
     * Send interview invitation to candidate
     */
    void sendInterviewInvitation(String candidateEmail, String candidateName, Interview interview);

    /**
     * Send round notification to candidate
     */
    void sendRoundNotification(String candidateEmail, String candidateName, Interview interview, InterviewRound round);

    /**
     * Send round result notification to candidate
     */
    void sendRoundResultNotification(String candidateEmail, String candidateName, Interview interview,
                                     InterviewRound round, String decision);

    /**
     * Send organisation disassociation notification
     */
    void sendDisassociationNotification(String email, String userName, String organisationName);

    /**
     * Send password reset email
     */
    void sendPasswordResetEmail(String email, String resetToken);

    /**
     * Send interviewer assignment notification
     */
    void sendInterviewerAssignmentNotification(String interviewerEmail, String interviewerName,
                                               Interview interview, InterviewRound round);

    // In-app notifications (new)

    /**
     * Create in-app notification
     */
    NotificationResponse createNotification(String userId, NotificationType type, String title,
                                           String message, String relatedEntityId, String relatedEntityType);

    /**
     * Get user notifications
     */
    List<NotificationResponse> getUserNotifications(String userId, Boolean unreadOnly);

    /**
     * Mark notification as read
     */
    NotificationResponse markAsRead(String notificationId);

    /**
     * Mark all user notifications as read
     */
    void markAllAsRead(String userId);

    /**
     * Get unread notification count
     */
    Long getUnreadCount(String userId);

    /**
     * Delete notification
     */
    void deleteNotification(String notificationId);

    /**
     * Cleanup read notifications older than retention period
     */
    void cleanupOldNotifications();
}
