package com.interview.organiser.model.dto.request;

import com.interview.organiser.constants.enums.InterviewType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleInterviewRequest {

    @NotBlank(message = "Candidate ID is required")
    private String candidateId;

    @NotBlank(message = "Interviewer ID is required")
    private String interviewerId;

    @NotNull(message = "Scheduled time is required")
    private LocalDateTime scheduledAt;

    private Integer duration;

    @NotNull(message = "Interview type is required")
    private InterviewType interviewType;

    @NotNull(message = "Round is required")
    private Integer round;

    private String meetingLink;

    private String notes;
}

