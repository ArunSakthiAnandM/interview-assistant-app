package com.interview.organiser.model.dto.request;

import com.interview.organiser.constants.enums.CandidateStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCandidateRequest {

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private String position;

    private Double experience;

    private List<String> skills;

    private String resumeUrl;

    private String linkedinUrl;

    private String githubUrl;

    private CandidateStatus status;
}

