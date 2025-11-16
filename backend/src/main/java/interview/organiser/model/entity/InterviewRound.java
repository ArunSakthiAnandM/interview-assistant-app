package interview.organiser.model.entity;

import interview.organiser.constants.InterviewStatus;
import interview.organiser.constants.InterviewType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Embedded document representing an Interview Round
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewRound {

    private String roundId;

    private Integer roundNumber;

    private InterviewType type;

    private InterviewStatus status;

    private LocalDateTime scheduledDate;

    private Integer durationMinutes;

    private List<String> interviewerIds;

    private List<InterviewerFeedback> feedbacks;

    private String finalDecision; // SELECT_FOR_NEXT_ROUND, SELECTED, REJECTED

    private String decisionBy; // User ID of recruiter who made the decision

    private LocalDateTime decisionAt;

    private String autoRecommendation; // System-generated recommendation

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

