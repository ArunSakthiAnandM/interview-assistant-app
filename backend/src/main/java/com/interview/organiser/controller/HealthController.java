package com.interview.organiser.controller;

import com.interview.organiser.constants.ApiConstants;
import com.interview.organiser.constants.AppConstants;
import com.interview.organiser.model.dto.response.HealthResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

/**
 * Health Check Controller
 * Provides endpoint to check the health status of the application
 */
@RestController
@RequestMapping(AppConstants.API_BASE_PATH)
public class HealthController {

    @Value("${spring.application.name:organiser}")
    private String applicationName;

    @Value("${spring.profiles.active:default}")
    private String activeProfile;

    /**
     * Health check endpoint
     *
     * @return HealthResponseDTO with application status information
     */
    @GetMapping(ApiConstants.HEALTH_ENDPOINT)
    public ResponseEntity<HealthResponseDTO> healthCheck() {
        HealthResponseDTO response = HealthResponseDTO.builder()
                .status("UP")
                .message(ApiConstants.HEALTH_OK_MESSAGE)
                .applicationName(applicationName)
                .version(AppConstants.APP_VERSION)
                .timestamp(LocalDateTime.now())
                .environment(activeProfile)
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}

