package com.interview.organiser.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRecruiterRequest {

    private String name;
    
    private String contactEmail;

    private String contactPhone;

    private String website;

    private String description;
}
