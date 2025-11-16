package interview.organiser.model.dto.response;

import interview.organiser.constants.RecurringPatternType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

/**
 * DTO for availability slot response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilitySlotResponse {

    private String id;
    private String interviewerId;
    private String interviewerName;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private RecurringPatternType recurringPattern;
    private LocalTime recurringStartTime;
    private LocalTime recurringEndTime;
    private List<DayOfWeek> recurringDays;
    private LocalDateTime recurringUntil;
    private Boolean blocked;
    private String blockedByRoundId;
    private String blockedByInterviewId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

