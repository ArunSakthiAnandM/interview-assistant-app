package com.interview.organiser.model.entity;

import com.interview.organiser.constants.enums.FeedbackRecommendation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "feedback")
public class Feedback {

    @Id
    private String id;

    @DBRef
    private Interview interview;

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

