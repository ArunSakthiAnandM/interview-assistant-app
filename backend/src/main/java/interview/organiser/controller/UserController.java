package interview.organiser.controller;

import interview.organiser.model.dto.request.InterviewerFilterRequest;
import interview.organiser.model.dto.request.UserRegistrationRequest;
import interview.organiser.model.dto.request.UserUpdateRequest;
import interview.organiser.model.dto.response.InterviewerMatchResponse;
import interview.organiser.model.dto.response.MessageResponse;
import interview.organiser.model.dto.response.UserResponse;
import interview.organiser.service.UserFilterService;
import interview.organiser.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for user operations
 */
@Slf4j
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserFilterService userFilterService;

    /**
     * Register a new user
     */
    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@Valid @RequestBody UserRegistrationRequest request) {
        log.info("User registration request received for email: {}", request.getEmail());
        UserResponse response = userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get current user profile
     */
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> getCurrentUser() {
        log.info("Get current user request received");
        UserResponse response = userService.getCurrentUser();
        return ResponseEntity.ok(response);
    }

    /**
     * Get user by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> getUserById(@PathVariable String id) {
        log.info("Get user by ID request received: {}", id);
        UserResponse response = userService.getUserById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Update user profile
     */
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable String id,
            @Valid @RequestBody UserUpdateRequest request) {
        log.info("Update user request received for ID: {}", id);
        UserResponse response = userService.updateUser(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete user (ADMIN only)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteUser(@PathVariable String id) {
        log.info("Delete user request received for ID: {}", id);
        MessageResponse response = userService.deleteUser(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all users with pagination (ADMIN only)
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @PageableDefault(size = 5, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Get all users request received");
        Page<UserResponse> response = userService.getAllUsers(pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Get users by role
     */
    @GetMapping("/role/{role}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<UserResponse>> getUsersByRole(
            @PathVariable String role,
            @PageableDefault(size = 5, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Get users by role request received: {}", role);
        Page<UserResponse> response = userService.getUsersByRole(role, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Get users by organisation
     */
    @GetMapping("/organisation/{organisationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<UserResponse>> getUsersByOrganisation(
            @PathVariable String organisationId,
            @PageableDefault(size = 5, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Get users by organisation request received: {}", organisationId);
        Page<UserResponse> response = userService.getUsersByOrganisation(organisationId, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Filter interviewers by skills, experience, and availability
     */
    @PostMapping("/organisation/{organisationId}/interviewers/filter")
    @PreAuthorize("hasAnyRole('ORGANISATION_ADMIN', 'RECRUITER', 'ADMIN')")
    public ResponseEntity<List<InterviewerMatchResponse>> filterInterviewers(
            @PathVariable String organisationId,
            @Valid @RequestBody InterviewerFilterRequest request) {
        log.info("Filter interviewers request for organisation: {}", organisationId);
        List<InterviewerMatchResponse> response = userFilterService.filterInterviewers(organisationId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Search users by various criteria
     */
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANISATION_ADMIN', 'RECRUITER')")
    public ResponseEntity<Page<?>> searchUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String organisationId,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String skills,
            @PageableDefault(size = 10, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        log.info("Search users request with criteria: role={}, org={}, name={}, email={}, skills={}",
                role, organisationId, name, email, skills);
        Page<?> response = userFilterService.searchUsers(role, organisationId, name, email, skills, pageable);
        return ResponseEntity.ok(response);
    }
}

