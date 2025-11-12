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
public class ConfirmInterviewRequest {

    @NotBlank(message = "Interview ID is required")
    private String interviewId;

    @NotBlank(message = "Candidate ID is required")
    private String candidateId;

    private Boolean confirmed;

    private String notes;
}

