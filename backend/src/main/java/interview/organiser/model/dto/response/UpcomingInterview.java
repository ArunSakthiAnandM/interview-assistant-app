package interview.organiser.model.dto.response;

import interview.organiser.constants.InterviewType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for upcoming interview details
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpcomingInterview {

    private String interviewId;
    private String roundId;
    private String candidateName;
    private String jobPosition;
    private InterviewType roundType;
    private LocalDateTime scheduledDate;
    private Integer durationMinutes;
}

