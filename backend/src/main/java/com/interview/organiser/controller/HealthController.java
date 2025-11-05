package com.interview.organiser.controller;

import com.interview.organiser.model.dto.response.HealthResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<HealthResponseDTO> checkHealth() {
        HealthResponseDTO response = HealthResponseDTO.builder()
                .status("UP")
                .timestamp(LocalDateTime.now())
                .message("Interview Organiser API is running")
                .build();
        return ResponseEntity.ok(response);
    }
}

