package com.interview.organiser.model.entity;

import com.interview.organiser.constants.enums.InterviewResult;
import com.interview.organiser.constants.enums.InterviewStatus;
import com.interview.organiser.constants.enums.InterviewType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "interviews")
public class Interview {

    @Id
    private String id;

    private String recruiterId;

    @DBRef
    private Candidate candidate;

    @DBRef
    private List<Interviewer> interviewers;

    private LocalDateTime scheduledAt;

    @Builder.Default
    private Integer duration = 60; // in minutes

    private InterviewType interviewType;

    private Integer round;

    @Builder.Default
    private InterviewStatus status = InterviewStatus.SCHEDULED;

    private String meetingLink;

    private String location; // For offline interviews

    private String notes;

    // Candidate confirmation tracking
    @Builder.Default
    private Boolean candidateConfirmed = false;

    private LocalDateTime candidateConfirmedAt;

    // Feedback tracking
    @Builder.Default
    private Boolean feedbackRequested = false;

    private LocalDateTime feedbackRequestedAt;

    // Result tracking
    private InterviewResult result; // SELECTED, REJECTED, NEXT_ROUND

    private String nextRoundInterviewId; // Reference to next round if created

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

