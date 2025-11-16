package interview.organiser.service;

import interview.organiser.model.dto.request.*;
import interview.organiser.model.dto.response.AuthResponse;
import interview.organiser.model.dto.response.MessageResponse;

/**
 * Service interface for authentication operations
 */
public interface AuthService {

    /**
     * Login user
     */
    AuthResponse login(LoginRequest request);

    /**
     * Refresh access token using refresh token
     */
    AuthResponse refreshToken(RefreshTokenRequest request);

    /**
     * Logout user (invalidate refresh token)
     */
    MessageResponse logout();

    /**
     * Initiate forgot password process
     */
    MessageResponse forgotPassword(ForgotPasswordRequest request);

    /**
     * Reset password using reset token
     */
    MessageResponse resetPassword(ResetPasswordRequest request);
}

