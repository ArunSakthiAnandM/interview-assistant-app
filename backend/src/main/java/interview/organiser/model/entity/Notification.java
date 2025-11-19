package interview.organiser.model.entity;

import interview.organiser.constants.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Entity representing in-app notifications
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    @Indexed
    private String userId;

    private NotificationType type;

    private String title;

    private String message;

    private String relatedEntityId;  // Interview ID, Invitation ID, etc.

    private String relatedEntityType; // "INTERVIEW", "INVITATION", etc.
    
    private String actionUrl;  // URL to navigate to when notification is clicked
    
    private String actionText; // Text for action button (e.g., "View Interview", "Accept Invitation")
    
    private Map<String, Object> metadata; // Additional metadata for the notification

    @Builder.Default
    private Boolean read = false;

    private LocalDateTime readAt;

    private LocalDateTime createdAt;

    // Soft delete
    @Builder.Default
    private Boolean deleted = false;
}

