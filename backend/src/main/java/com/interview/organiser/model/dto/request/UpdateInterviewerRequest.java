package com.interview.organiser.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateInterviewerRequest {

    private String department;

    private List<String> expertise;

    private Integer yearsOfExperience;

    private Boolean availability;
}

