package com.interview.organiser.model.dto.request;

import com.interview.organiser.constants.enums.InterviewStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateInterviewStatusRequest {

    @NotNull(message = "Status is required")
    private InterviewStatus status;

    private String reason;
}

