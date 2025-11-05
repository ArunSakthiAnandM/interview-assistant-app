package com.interview.organiser.controller;

import com.interview.organiser.model.dto.request.LoginRequest;
import com.interview.organiser.model.dto.request.RefreshTokenRequest;
import com.interview.organiser.model.dto.request.RegisterRequest;
import com.interview.organiser.model.dto.response.AuthResponse;
import com.interview.organiser.model.dto.response.MessageResponse;
import com.interview.organiser.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(@RequestHeader("Authorization") String token) {
        // Extract user ID from token (to be implemented with JWT util)
        String userId = extractUserIdFromToken(token);
        return ResponseEntity.ok(authService.logout(userId));
    }

    private String extractUserIdFromToken(String token) {
        // TODO: Implement JWT token parsing
        return "";
    }
}

