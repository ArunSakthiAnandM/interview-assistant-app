package interview.organiser.service.impl;

import interview.organiser.constants.NotificationType;
import interview.organiser.exception.InvalidOperationException;
import interview.organiser.exception.ResourceNotFoundException;
import interview.organiser.model.dto.response.NotificationResponse;
import interview.organiser.model.entity.Interview;
import interview.organiser.model.entity.InterviewRound;
import interview.organiser.model.entity.Notification;
import interview.organiser.repository.NotificationRepository;
import interview.organiser.repository.UserRepository;
import interview.organiser.service.NotificationService;
import interview.organiser.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Implementation of NotificationService with email (mocked) + in-app notifications
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Value("${notification.read-retention-days:30}")
    private Integer readRetentionDays;

    // Email notifications (mocked) - existing methods


    @Override
    public void sendOrganisationInvitation(String email, String organisationName, String role, String invitationLink) {
        log.info("📧 [MOCK EMAIL] Sending organisation invitation");
        log.info("   To: {}", email);
        log.info("   Organisation: {}", organisationName);
        log.info("   Role: {}", role);
        log.info("   Invitation Link: {}", invitationLink);
        log.info("   Subject: Invitation to join {} as {}", organisationName, role);
    }

    @Override
    public void sendInterviewInvitation(String candidateEmail, String candidateName, Interview interview) {
        log.info("📧 [MOCK EMAIL] Sending interview invitation");
        log.info("   To: {}", candidateEmail);
        log.info("   Candidate: {}", candidateName);
        log.info("   Job Position: {}", interview.getJobPosition());
        log.info("   Total Rounds: {}", interview.getRounds() != null ? interview.getRounds().size() : 0);
        log.info("   Subject: Interview Invitation for {}", interview.getJobPosition());
    }

    @Override
    public void sendRoundNotification(String candidateEmail, String candidateName, Interview interview, InterviewRound round) {
        log.info("📧 [MOCK EMAIL] Sending round notification");
        log.info("   To: {}", candidateEmail);
        log.info("   Candidate: {}", candidateName);
        log.info("   Job Position: {}", interview.getJobPosition());
        log.info("   Round: {} - {}", round.getRoundNumber(), round.getType());
        log.info("   Scheduled: {}", round.getScheduledDate());
        log.info("   Duration: {} minutes", round.getDurationMinutes());
        log.info("   Subject: Interview Round {} scheduled for {}", round.getRoundNumber(), interview.getJobPosition());
    }

    @Override
    public void sendRoundResultNotification(String candidateEmail, String candidateName, Interview interview,
                                           InterviewRound round, String decision) {
        log.info("📧 [MOCK EMAIL] Sending round result notification");
        log.info("   To: {}", candidateEmail);
        log.info("   Candidate: {}", candidateName);
        log.info("   Job Position: {}", interview.getJobPosition());
        log.info("   Round: {} - {}", round.getRoundNumber(), round.getType());
        log.info("   Decision: {}", decision);
        log.info("   Subject: Interview Round {} Result for {}", round.getRoundNumber(), interview.getJobPosition());
    }

    @Override
    public void sendDisassociationNotification(String email, String userName, String organisationName) {
        log.info("📧 [MOCK EMAIL] Sending disassociation notification");
        log.info("   To: {}", email);
        log.info("   User: {}", userName);
        log.info("   Organisation: {}", organisationName);
        log.info("   Subject: Organisation Disassociation Notice");
    }

    @Override
    public void sendPasswordResetEmail(String email, String resetToken) {
        log.info("📧 [MOCK EMAIL] Sending password reset email");
        log.info("   To: {}", email);
        log.info("   Reset Token: {}", resetToken);
        log.info("   Reset Link: http://localhost:3000/reset-password?token={}", resetToken);
        log.info("   Subject: Password Reset Request");
    }

    @Override
    public void sendInterviewerAssignmentNotification(String interviewerEmail, String interviewerName,
                                                     Interview interview, InterviewRound round) {
        log.info("📧 [MOCK EMAIL] Sending interviewer assignment notification");
        log.info("   To: {}", interviewerEmail);
        log.info("   Interviewer: {}", interviewerName);
        log.info("   Job Position: {}", interview.getJobPosition());
        log.info("   Candidate: {}", interview.getCandidateEmail());
        log.info("   Round: {} - {}", round.getRoundNumber(), round.getType());
        log.info("   Scheduled: {}", round.getScheduledDate());
        log.info("   Subject: Interview Assignment - {} Round {}", interview.getJobPosition(), round.getRoundNumber());
    }

    // In-app notifications (new implementation)

    @Override
    public NotificationResponse createNotification(String userId, NotificationType type, String title,
                                                   String message, String relatedEntityId, String relatedEntityType) {
        log.info("Creating in-app notification for user {} of type {}", userId, type);

        Notification notification = Notification.builder()
                .userId(userId)
                .type(type)
                .title(title)
                .message(message)
                .relatedEntityId(relatedEntityId)
                .relatedEntityType(relatedEntityType)
                .read(false)
                .createdAt(LocalDateTime.now())
                .deleted(false)
                .build();

        Notification saved = notificationRepository.save(notification);
        return mapToResponse(saved);
    }

    @Override
    public Page<NotificationResponse> getUserNotifications(String userId, Boolean unreadOnly, Pageable pageable) {
        log.info("Getting notifications for user {}, unreadOnly={}", userId, unreadOnly);

        // Verify user is requesting their own notifications or is admin
        String currentUserId = SecurityUtil.getCurrentUserId();
        if (!currentUserId.equals(userId) && !SecurityUtil.hasRole("ADMIN")) {
            throw new InvalidOperationException("You can only view your own notifications");
        }

        Page<Notification> notifications = unreadOnly != null && unreadOnly ?
                notificationRepository.findByUserIdAndReadFalseAndDeletedFalseOrderByCreatedAtDesc(userId, pageable) :
                notificationRepository.findByUserIdAndDeletedFalseOrderByCreatedAtDesc(userId, pageable);

        return notifications.map(this::mapToResponse);
    }

    @Override
    public NotificationResponse markAsRead(String notificationId) {
        log.info("Marking notification {} as read", notificationId);

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        // Verify user owns this notification
        String currentUserId = SecurityUtil.getCurrentUserId();
        if (!notification.getUserId().equals(currentUserId) && !SecurityUtil.hasRole("ADMIN")) {
            throw new InvalidOperationException("You can only mark your own notifications as read");
        }

        notification.setRead(true);
        notification.setReadAt(LocalDateTime.now());
        Notification saved = notificationRepository.save(notification);

        return mapToResponse(saved);
    }

    @Override
    public void markAllAsRead(String userId) {
        log.info("Marking all notifications as read for user {}", userId);

        // Verify user is marking their own notifications
        String currentUserId = SecurityUtil.getCurrentUserId();
        if (!currentUserId.equals(userId) && !SecurityUtil.hasRole("ADMIN")) {
            throw new InvalidOperationException("You can only mark your own notifications as read");
        }

        List<Notification> unreadNotifications = notificationRepository
                .findByUserIdAndReadFalseAndDeletedFalseOrderByCreatedAtDesc(userId, Pageable.unpaged())
                .getContent();

        for (Notification notification : unreadNotifications) {
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
            notificationRepository.save(notification);
        }

        log.info("Marked {} notifications as read", unreadNotifications.size());
    }

    @Override
    public Long getUnreadCount(String userId) {
        log.info("Getting unread count for user {}", userId);

        // Verify user is getting their own count
        String currentUserId = SecurityUtil.getCurrentUserId();
        if (!currentUserId.equals(userId) && !SecurityUtil.hasRole("ADMIN")) {
            throw new InvalidOperationException("You can only view your own notification count");
        }

        return notificationRepository.countByUserIdAndReadFalseAndDeletedFalse(userId);
    }

    @Override
    public void deleteNotification(String notificationId) {
        log.info("Deleting notification {}", notificationId);

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        // Verify user owns this notification
        String currentUserId = SecurityUtil.getCurrentUserId();
        if (!notification.getUserId().equals(currentUserId) && !SecurityUtil.hasRole("ADMIN")) {
            throw new InvalidOperationException("You can only delete your own notifications");
        }

        notification.setDeleted(true);
        notificationRepository.save(notification);
    }

    @Override
    @Scheduled(cron = "${notification.cleanup.cron:0 0 2 * * ?}")  // 2 AM daily
    public void cleanupOldNotifications() {
        log.info("Running notification cleanup job");

        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(readRetentionDays);
        List<Notification> oldNotifications = notificationRepository.findByReadTrueAndCreatedAtBefore(cutoffDate);

        for (Notification notification : oldNotifications) {
            notification.setDeleted(true);
            notificationRepository.save(notification);
        }

        log.info("Cleaned up {} old notifications", oldNotifications.size());
    }

    // Helper methods

    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .type(notification.getType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .relatedEntityId(notification.getRelatedEntityId())
                .relatedEntityType(notification.getRelatedEntityType())
                .read(notification.getRead())
                .readAt(notification.getReadAt())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
