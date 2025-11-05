package com.interview.organiser.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateInterviewerRequest {

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotBlank(message = "Department is required")
    private String department;

    @NotEmpty(message = "Expertise is required")
    private List<String> expertise;

    private Integer yearsOfExperience;

    private Boolean availability;
}

