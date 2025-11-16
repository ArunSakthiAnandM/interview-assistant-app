package interview.organiser.controller;

import interview.organiser.model.dto.response.MessageResponse;
import interview.organiser.model.dto.response.NotificationResponse;
import interview.organiser.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for in-app notifications
 */
@Slf4j
@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * Get current user's notifications
     */
    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(
            @RequestParam(required = false) Boolean unreadOnly) {
        log.info("Get my notifications request, unreadOnly={}", unreadOnly);
        String userId = interview.organiser.util.SecurityUtil.getCurrentUserId();
        List<NotificationResponse> response = notificationService.getUserNotifications(userId, unreadOnly);
        return ResponseEntity.ok(response);
    }

    /**
     * Mark notification as read
     */
    @PostMapping("/{id}/mark-read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<NotificationResponse> markAsRead(@PathVariable String id) {
        log.info("Mark notification as read request: {}", id);
        NotificationResponse response = notificationService.markAsRead(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Mark all notifications as read
     */
    @PostMapping("/mark-all-read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> markAllAsRead() {
        log.info("Mark all notifications as read request");
        String userId = interview.organiser.util.SecurityUtil.getCurrentUserId();
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("All notifications marked as read")
                .build());
    }

    /**
     * Get unread notification count
     */
    @GetMapping("/unread-count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        log.info("Get unread notification count request");
        String userId = interview.organiser.util.SecurityUtil.getCurrentUserId();
        Long count = notificationService.getUnreadCount(userId);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete notification
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> deleteNotification(@PathVariable String id) {
        log.info("Delete notification request: {}", id);
        notificationService.deleteNotification(id);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Notification deleted successfully")
                .build());
    }
}

