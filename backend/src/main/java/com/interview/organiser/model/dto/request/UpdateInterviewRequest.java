package com.interview.organiser.model.dto.request;

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
public class UpdateInterviewRequest {

    private LocalDateTime scheduledAt;

    private Integer duration;

    private InterviewType interviewType;

    private String meetingLink;

    private String notes;
}

