package com.interview.organiser.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarkInterviewResultRequest {

    @NotBlank(message = "Interview ID is required")
    private String interviewId;

    @NotBlank(message = "Result is required")
    private String result; // SELECTED, REJECTED, NEXT_ROUND

    private String comments;
}

