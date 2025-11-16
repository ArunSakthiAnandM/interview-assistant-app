package interview.organiser.model.entity;

import interview.organiser.constants.FeedbackRecommendation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Embedded document representing Interviewer Feedback
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewerFeedback {

    private String interviewerId;

    private String interviewerName;

    private FeedbackRecommendation recommendation;

    private Integer rating; // Out of 10

    private String comments;

    private LocalDateTime submittedAt;
}
