package com.interview.organiser.model.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for health check endpoint
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthResponseDTO {

    private String status;

    private String message;

    private String applicationName;

    private String version;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;

    private String environment;
}

