package interview.organiser.model.dto.response;

import interview.organiser.constants.InterviewStatus;
import interview.organiser.constants.InterviewType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for interview round response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoundResponse {

    private String roundId;
    private Integer roundNumber;
    private InterviewType type;
    private InterviewStatus status;
    private LocalDateTime scheduledDate;
    private Integer durationMinutes;
    private List<InterviewerInfo> interviewers;
    private List<FeedbackResponse> feedbacks;
    private String finalDecision;
    private String decisionBy;
    private String decisionByName;
    private LocalDateTime decisionAt;
    private String autoRecommendation;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

