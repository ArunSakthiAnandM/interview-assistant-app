package interview.organiser.service.impl;

import interview.organiser.exception.InvalidOperationException;
import interview.organiser.exception.ResourceNotFoundException;
import interview.organiser.model.dto.request.*;
import interview.organiser.model.dto.response.AuthResponse;
import interview.organiser.model.dto.response.MessageResponse;
import interview.organiser.model.dto.response.UserResponse;
import interview.organiser.model.entity.Organisation;
import interview.organiser.model.entity.User;
import interview.organiser.repository.OrganisationRepository;
import interview.organiser.repository.UserRepository;
import interview.organiser.security.JwtTokenProvider;
import interview.organiser.service.AuthService;
import interview.organiser.service.NotificationService;
import interview.organiser.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Implementation of AuthService
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final OrganisationRepository organisationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());

        User user = userRepository.findByEmailAndDeletedFalse(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        // Invalidate any existing refresh token (single session)
        user.setRefreshToken(null);
        user.setRefreshTokenExpiryDate(null);

        // Generate new tokens
        String accessToken = tokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
        String refreshToken = tokenProvider.generateRefreshToken(user.getId());

        // Save refresh token
        user.setRefreshToken(refreshToken);
        user.setRefreshTokenExpiryDate(tokenProvider.getRefreshTokenExpiryDate());
        userRepository.save(user);

        log.info("User logged in successfully: {}", user.getEmail());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(7200L) // 2 hours in seconds
                .user(mapToUserResponse(user))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        log.info("Refresh token request received");

        User user = userRepository.findByRefreshToken(request.getRefreshToken())
                .orElseThrow(() -> new InvalidOperationException("Invalid refresh token"));

        if (user.getRefreshTokenExpiryDate().isBefore(LocalDateTime.now())) {
            throw new InvalidOperationException("Refresh token has expired");
        }

        // Generate new access token
        String accessToken = tokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole());

        log.info("Access token refreshed for user: {}", user.getEmail());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(request.getRefreshToken())
                .tokenType("Bearer")
                .expiresIn(7200L)
                .user(mapToUserResponse(user))
                .build();
    }

    @Override
    @Transactional
    public MessageResponse logout() {
        String userId = SecurityUtil.getCurrentUserId();

        User user = userRepository.findByIdAndDeletedFalse(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Invalidate refresh token
        user.setRefreshToken(null);
        user.setRefreshTokenExpiryDate(null);
        userRepository.save(user);

        log.info("User logged out successfully: {}", user.getEmail());

        return new MessageResponse("Logged out successfully");
    }

    @Override
    @Transactional
    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        log.info("Forgot password request for email: {}", request.getEmail());

        User user = userRepository.findByEmailAndDeletedFalse(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        // Generate reset token
        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiryDate(LocalDateTime.now().plusHours(24)); // 24 hours validity
        userRepository.save(user);

        // Send reset email
        notificationService.sendPasswordResetEmail(user.getEmail(), resetToken);

        log.info("Password reset email sent to: {}", user.getEmail());

        return new MessageResponse("Password reset link has been sent to your email");
    }

    @Override
    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        log.info("Reset password request received");

        User user = userRepository.findByResetToken(request.getResetToken())
                .orElseThrow(() -> new InvalidOperationException("Invalid reset token"));

        if (user.getResetTokenExpiryDate().isBefore(LocalDateTime.now())) {
            throw new InvalidOperationException("Reset token has expired");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiryDate(null);
        user.setUpdatedAt(LocalDateTime.now());
        user.setUpdatedBy(user.getId());
        userRepository.save(user);

        log.info("Password reset successfully for user: {}", user.getEmail());

        return new MessageResponse("Password has been reset successfully");
    }

    private UserResponse mapToUserResponse(User user) {
        String organisationName = null;
        if (user.getOrganisationId() != null) {
            organisationName = organisationRepository.findByIdAndDeletedFalse(user.getOrganisationId())
                    .map(Organisation::getName)
                    .orElse(null);
        }

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .role(user.getRole())
                .skills(user.getSkills())
                .experience(user.getExperience())
                .expertise(user.getExpertise())
                .yearsOfExperience(user.getYearsOfExperience())
                .specialization(user.getSpecialization())
                .resumeUrl(user.getResumeUrl())
                .expectedSalary(user.getExpectedSalary())
                .organisationId(user.getOrganisationId())
                .organisationName(organisationName)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
