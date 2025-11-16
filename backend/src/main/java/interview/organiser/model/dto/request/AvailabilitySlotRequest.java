package interview.organiser.model.dto.request;

import interview.organiser.constants.RecurringPatternType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

/**
 * DTO for creating/updating availability slot
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilitySlotRequest {

    @NotNull(message = "Start date time is required")
    private LocalDateTime startDateTime;

    @NotNull(message = "End date time is required")
    private LocalDateTime endDateTime;

    // Recurring pattern (optional)
    private RecurringPatternType recurringPattern;

    private LocalTime recurringStartTime;

    private LocalTime recurringEndTime;

    private List<DayOfWeek> recurringDays;  // For WEEKLY pattern

    private LocalDateTime recurringUntil;  // End date for recurring pattern
}

