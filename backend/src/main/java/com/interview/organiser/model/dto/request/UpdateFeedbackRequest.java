package com.interview.organiser.model.dto.request;

import com.interview.organiser.constants.enums.FeedbackRecommendation;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateFeedbackRequest {

    @Min(value = 1, message = "Rating must be between 1 and 10")
    @Max(value = 10, message = "Rating must be between 1 and 10")
    private Integer rating;

    @Min(value = 1, message = "Technical skills rating must be between 1 and 10")
    @Max(value = 10, message = "Technical skills rating must be between 1 and 10")
    private Integer technicalSkills;

    @Min(value = 1, message = "Communication skills rating must be between 1 and 10")
    @Max(value = 10, message = "Communication skills rating must be between 1 and 10")
    private Integer communicationSkills;

    @Min(value = 1, message = "Problem solving rating must be between 1 and 10")
    @Max(value = 10, message = "Problem solving rating must be between 1 and 10")
    private Integer problemSolving;

    @Min(value = 1, message = "Cultural fit rating must be between 1 and 10")
    @Max(value = 10, message = "Cultural fit rating must be between 1 and 10")
    private Integer culturalFit;

    private String comments;

    private String strengths;

    private String weaknesses;

    private FeedbackRecommendation recommendation;
}


