package com.interview.organiser.model.entity;

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

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "interviews")
public class Interview {

    @Id
    private String id;

    @DBRef
    private Candidate candidate;

    @DBRef
    private Interviewer interviewer;

    private LocalDateTime scheduledAt;

    @Builder.Default
    private Integer duration = 60; // in minutes

    private InterviewType interviewType;

    private Integer round;

    @Builder.Default
    private InterviewStatus status = InterviewStatus.SCHEDULED;

    private String meetingLink;

    private String notes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

