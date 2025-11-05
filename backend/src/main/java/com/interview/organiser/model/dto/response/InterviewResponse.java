package com.interview.organiser.model.dto.response;

import com.interview.organiser.constants.enums.InterviewStatus;
import com.interview.organiser.constants.enums.InterviewType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewResponse {

    private String id;

    private CandidateResponse candidate;

    private InterviewerResponse interviewer;

    private LocalDateTime scheduledAt;

    private Integer duration;

    private InterviewType interviewType;

    private Integer round;

    private InterviewStatus status;

    private String meetingLink;

    private String notes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

