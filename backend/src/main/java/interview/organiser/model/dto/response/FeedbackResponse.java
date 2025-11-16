package interview.organiser.model.dto.response;

import interview.organiser.constants.FeedbackRecommendation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for feedback response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackResponse {

    private String interviewerId;
    private String interviewerName;
    private FeedbackRecommendation recommendation;
    private Integer rating;
    private String comments;
    private LocalDateTime submittedAt;
}

