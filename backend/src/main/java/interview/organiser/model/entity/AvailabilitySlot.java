package interview.organiser.model.entity;

import interview.organiser.constants.RecurringPatternType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

/**
 * Entity representing interviewer availability slots
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "availability_slots")
public class AvailabilitySlot {

    @Id
    private String id;

    @Indexed
    private String interviewerId;

    private LocalDateTime startDateTime;

    private LocalDateTime endDateTime;

    // Recurring pattern support
    private RecurringPatternType recurringPattern;

    private LocalTime recurringStartTime;  // For recurring slots

    private LocalTime recurringEndTime;    // For recurring slots

    private List<DayOfWeek> recurringDays; // For WEEKLY pattern

    private LocalDateTime recurringUntil;  // End date for recurring pattern

    // Auto-blocking
    @Builder.Default
    private Boolean blocked = false;

    private String blockedByRoundId;  // Round ID that blocked this slot

    private String blockedByInterviewId;

    // Audit fields
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Builder.Default
    private Boolean deleted = false;
}

