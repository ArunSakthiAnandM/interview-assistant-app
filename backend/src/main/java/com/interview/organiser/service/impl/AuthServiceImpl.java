package com.interview.organiser.service.impl;

import com.interview.organiser.constants.AppConstants;
import com.interview.organiser.exception.InvalidCredentialsException;
import com.interview.organiser.exception.InvalidTokenException;
import com.interview.organiser.exception.ResourceAlreadyExistsException;
import com.interview.organiser.model.dto.request.LoginRequest;
import com.interview.organiser.model.dto.request.RefreshTokenRequest;
import com.interview.organiser.model.dto.request.RegisterRequest;
import com.interview.organiser.model.dto.response.AuthResponse;
import com.interview.organiser.model.dto.response.MessageResponse;
import com.interview.organiser.model.dto.response.UserResponse;
import com.interview.organiser.model.entity.RefreshToken;
import com.interview.organiser.model.entity.User;
import com.interview.organiser.repository.RefreshTokenRepository;
import com.interview.organiser.repository.UserRepository;
import com.interview.organiser.service.AuthService;
import com.interview.organiser.util.EntityMapper;
import com.interview.organiser.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EntityMapper entityMapper;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering user with email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("User", "email", request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Add the requested role to the roles set
        user.getRoles().add(request.getRole());

        User savedUser = userRepository.save(user);

        String accessToken = jwtUtil.generateToken(savedUser);
        String refreshToken = createRefreshToken(savedUser.getId());

        UserResponse userResponse = entityMapper.toUserResponse(savedUser);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType(AppConstants.BEARER_TOKEN_TYPE)
                .expiresIn(AppConstants.JWT_EXPIRATION_MS / 1000)
                .user(userResponse)
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException(AppConstants.INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException(AppConstants.INVALID_CREDENTIALS);
        }

        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new InvalidCredentialsException("User account is inactive");
        }

        String accessToken = jwtUtil.generateToken(user);
        String refreshToken = createRefreshToken(user.getId());

        UserResponse userResponse = entityMapper.toUserResponse(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType(AppConstants.BEARER_TOKEN_TYPE)
                .expiresIn(AppConstants.JWT_EXPIRATION_MS / 1000)
                .user(userResponse)
                .build();
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        log.info("Refreshing token");

        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new InvalidTokenException(AppConstants.INVALID_TOKEN));

        if (refreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new InvalidTokenException("Refresh token has expired");
        }

        com.interview.organiser.model.entity.User user = userRepository.findById(refreshToken.getUserId())
                .orElseThrow(() -> new InvalidTokenException("User not found for token"));

        String newAccessToken = jwtUtil.generateToken(user);
        String newRefreshToken = createRefreshToken(user.getId());

        refreshTokenRepository.delete(refreshToken);

        UserResponse userResponse = entityMapper.toUserResponse(user);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType(AppConstants.BEARER_TOKEN_TYPE)
                .expiresIn(AppConstants.JWT_EXPIRATION_MS / 1000)
                .user(userResponse)
                .build();
    }

    @Override
    @Transactional
    public MessageResponse logout(String userId) {
        log.info("Logging out user: {}", userId);

        refreshTokenRepository.deleteByUserId(userId);

        return MessageResponse.builder()
                .message("Logout successful")
                .timestamp(LocalDateTime.now())
                .build();
    }

    private String createRefreshToken(String userId) {
        refreshTokenRepository.deleteByUserId(userId);

        String token = UUID.randomUUID().toString();
        RefreshToken refreshToken = RefreshToken.builder()
                .token(token)
                .userId(userId)
                .expiryDate(LocalDateTime.now().plusSeconds(AppConstants.JWT_REFRESH_EXPIRATION_MS / 1000))
                .createdAt(LocalDateTime.now())
                .build();

        refreshTokenRepository.save(refreshToken);
        return token;
    }
}
