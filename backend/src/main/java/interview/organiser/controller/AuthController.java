package interview.organiser.controller;

import interview.organiser.model.dto.request.ForgotPasswordRequest;
import interview.organiser.model.dto.request.LoginRequest;
import interview.organiser.model.dto.request.RefreshTokenRequest;
import interview.organiser.model.dto.request.ResetPasswordRequest;
import interview.organiser.model.dto.response.AuthResponse;
import interview.organiser.model.dto.response.MessageResponse;
import interview.organiser.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for authentication operations
 */
@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Login endpoint
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request received for email: {}", request.getEmail());
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Refresh token endpoint
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        log.info("Refresh token request received");
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Logout endpoint
     */
    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout() {
        log.info("Logout request received");
        MessageResponse response = authService.logout();
        return ResponseEntity.ok(response);
    }

    /**
     * Forgot password endpoint
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        log.info("Forgot password request received for email: {}", request.getEmail());
        MessageResponse response = authService.forgotPassword(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Reset password endpoint
     */
    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        log.info("Reset password request received");
        MessageResponse response = authService.resetPassword(request);
        return ResponseEntity.ok(response);
    }
}

