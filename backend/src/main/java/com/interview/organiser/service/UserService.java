package com.interview.organiser.service;

import com.interview.organiser.constants.enums.UserRole;
import com.interview.organiser.model.dto.request.UpdateUserRequest;
import com.interview.organiser.model.dto.response.MessageResponse;
import com.interview.organiser.model.dto.response.PageResponse;
import com.interview.organiser.model.dto.response.UserResponse;
import org.springframework.data.domain.Pageable;

public interface UserService {

    PageResponse<UserResponse> getAllUsers(UserRole role, Pageable pageable);

    UserResponse getUserById(String userId);

    UserResponse updateUser(String userId, UpdateUserRequest request);

    MessageResponse deleteUser(String userId);
}

