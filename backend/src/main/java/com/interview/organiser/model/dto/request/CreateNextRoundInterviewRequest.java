package com.interview.organiser.model.dto.request;

import com.interview.organiser.constants.enums.InterviewType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateNextRoundInterviewRequest {

    @NotBlank(message = "Previous interview ID is required")
    private String previousInterviewId;

    @NotNull(message = "Scheduled date/time is required")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime scheduledAt;

    private Integer duration;

    @NotNull(message = "Interview type is required")
    private InterviewType interviewType;

    private List<String> interviewerIds;

    private String meetingLink;

    private String location;

    private String notes;
}

