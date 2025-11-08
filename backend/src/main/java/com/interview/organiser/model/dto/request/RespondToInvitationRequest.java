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
public class RespondToInvitationRequest {

    @NotBlank(message = "Token is required")
    private String token;

    @NotBlank(message = "Response is required (ACCEPT or DECLINE)")
    private String response; // ACCEPT or DECLINE

    private String reason; // Optional reason for decline
}
