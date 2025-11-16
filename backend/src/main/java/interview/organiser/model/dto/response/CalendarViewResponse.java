package interview.organiser.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for calendar view response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalendarViewResponse {

    private Integer month;
    private Integer year;
    private List<CalendarDay> days;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CalendarDay {
        private LocalDateTime date;
        private List<AvailabilitySlotResponse> availableSlots;
        private List<BookedSlot> bookedSlots;
        private Integer totalAvailableHours;
        private Integer totalBookedHours;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookedSlot {
        private String roundId;
        private String interviewId;
        private String candidateName;
        private String jobPosition;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
    }
}

