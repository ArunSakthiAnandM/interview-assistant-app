package com.interview.organiser.service;

import com.interview.organiser.model.dto.request.LoginRequest;
import com.interview.organiser.model.dto.request.RefreshTokenRequest;
import com.interview.organiser.model.dto.request.RegisterRequest;
import com.interview.organiser.model.dto.response.AuthResponse;
import com.interview.organiser.model.dto.response.MessageResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    MessageResponse logout(String userId);
}
