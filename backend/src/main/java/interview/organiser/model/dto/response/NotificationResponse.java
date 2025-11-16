package interview.organiser.model.dto.response;

import interview.organiser.constants.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * DTO for notification response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

    private String id;
    private String userId;
    private NotificationType type;
    private String title;
    private String message;
    private String relatedEntityId;
    private String relatedEntityType;
    private String actionUrl;
    private String actionText;
    private Map<String, Object> metadata;
    private Boolean read;
    private LocalDateTime readAt;
    private LocalDateTime createdAt;
}

