package com.interview.organiser.model.dto.request;

import com.interview.organiser.constants.enums.CandidateStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCandidateRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotBlank(message = "Position is required")
    private String position;

    private Double experience;

    private List<String> skills;

    private String resumeUrl;

    private String linkedinUrl;

    private String githubUrl;

    private CandidateStatus status;
}

