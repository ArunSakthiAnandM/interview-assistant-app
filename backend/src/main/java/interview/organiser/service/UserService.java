package interview.organiser.service;

import interview.organiser.model.dto.request.UserRegistrationRequest;
import interview.organiser.model.dto.request.UserUpdateRequest;
import interview.organiser.model.dto.response.MessageResponse;
import interview.organiser.model.dto.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for user operations
 */
public interface UserService {

    /**
     * Register a new user
     */
    UserResponse registerUser(UserRegistrationRequest request);

    /**
     * Get user by ID
     */
    UserResponse getUserById(String id);

    /**
     * Update user profile
     */
    UserResponse updateUser(String id, UserUpdateRequest request);

    /**
     * Delete user (soft delete)
     */
    MessageResponse deleteUser(String id);

    /**
     * Get current user profile
     */
    UserResponse getCurrentUser();

    /**
     * Get all users with pagination
     */
    Page<UserResponse> getAllUsers(Pageable pageable);

    /**
     * Get users by role
     */
    Page<UserResponse> getUsersByRole(String role, Pageable pageable);

    /**
     * Get users by organisation
     */
    Page<UserResponse> getUsersByOrganisation(String organisationId, Pageable pageable);
}

