package interview.organiser.model.dto.request;

import interview.organiser.constants.FeedbackRecommendation;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for submitting interviewer feedback
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackRequest {

    @NotNull(message = "Recommendation is required")
    private FeedbackRecommendation recommendation;

    @NotNull(message = "Rating is required")
    @Min(value = 0, message = "Rating must be between 0 and 10")
    @Max(value = 10, message = "Rating must be between 0 and 10")
    private Integer rating;

    private String comments;
}

