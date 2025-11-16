package interview.organiser.model.dto.response;

import interview.organiser.constants.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for notification response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

    private String id;
    private NotificationType type;
    private String title;
    private String message;
    private String relatedEntityId;
    private String relatedEntityType;
    private Boolean read;
    private LocalDateTime readAt;
    private LocalDateTime createdAt;
}

