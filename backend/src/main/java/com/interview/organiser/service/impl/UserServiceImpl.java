package com.interview.organiser.service.impl;

import com.interview.organiser.constants.AppConstants;
import com.interview.organiser.constants.enums.UserRole;
import com.interview.organiser.exception.ResourceNotFoundException;
import com.interview.organiser.model.dto.request.UpdateUserRequest;
import com.interview.organiser.model.dto.response.MessageResponse;
import com.interview.organiser.model.dto.response.PageResponse;
import com.interview.organiser.model.dto.response.UserResponse;
import com.interview.organiser.repository.UserRepository;
import com.interview.organiser.service.UserService;
import com.interview.organiser.util.EntityMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final EntityMapper entityMapper;

    @Override
    public PageResponse<UserResponse> getAllUsers(UserRole role, Pageable pageable) {
        log.info("Fetching all users with role: {}", role);

        Page<com.interview.organiser.model.entity.User> userPage;
        if (role != null) {
            userPage = userRepository.findByRole(role, pageable);
        } else {
            userPage = userRepository.findAll(pageable);
        }

        List<UserResponse> userResponses = userPage.getContent().stream()
                .map(entityMapper::toUserResponse)
                .collect(Collectors.toList());

        return PageResponse.<UserResponse>builder()
                .content(userResponses)
                .page(userPage.getNumber())
                .size(userPage.getSize())
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .build();
    }

    @Override
    public UserResponse getUserById(String userId) {
        log.info("Fetching user with id: {}", userId);

        com.interview.organiser.model.entity.User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(AppConstants.USER_NOT_FOUND));

        return entityMapper.toUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateUser(String userId, UpdateUserRequest request) {
        log.info("Updating user with id: {}", userId);

        com.interview.organiser.model.entity.User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(AppConstants.USER_NOT_FOUND));

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getIsActive() != null) {
            user.setIsActive(request.getIsActive());
        }

        user.setUpdatedAt(LocalDateTime.now());

        com.interview.organiser.model.entity.User updatedUser = userRepository.save(user);

        return entityMapper.toUserResponse(updatedUser);
    }

    @Override
    @Transactional
    public MessageResponse deleteUser(String userId) {
        log.info("Deleting user with id: {}", userId);

        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException(AppConstants.USER_NOT_FOUND);
        }

        userRepository.deleteById(userId);

        return MessageResponse.builder()
                .message("User deleted successfully")
                .timestamp(LocalDateTime.now())
                .build();
    }
}
