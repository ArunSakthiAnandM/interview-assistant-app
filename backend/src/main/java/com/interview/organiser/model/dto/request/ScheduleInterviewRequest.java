package com.interview.organiser.model.dto.request;

import com.interview.organiser.constants.enums.InterviewType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleInterviewRequest {

    @NotBlank(message = "Organisation ID is required")
    private String organisationId;

    @NotBlank(message = "Candidate ID is required")
    private String candidateId;

    @NotEmpty(message = "At least one interviewer is required")
    private List<String> interviewerIds;

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

