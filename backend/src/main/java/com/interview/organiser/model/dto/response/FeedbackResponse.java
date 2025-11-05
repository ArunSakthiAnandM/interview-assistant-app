package com.interview.organiser.model.dto.response;

import com.interview.organiser.constants.enums.FeedbackRecommendation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackResponse {

    private String id;

    private InterviewResponse interview;

    private Integer rating;

    private Integer technicalSkills;

    private Integer communicationSkills;

    private Integer problemSolving;

    private Integer culturalFit;

    private String comments;

    private String strengths;

    private String weaknesses;

    private FeedbackRecommendation recommendation;

    private LocalDateTime submittedAt;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

