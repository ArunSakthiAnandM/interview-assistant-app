package interview.organiser.service.impl;

import interview.organiser.constants.UserRole;
import interview.organiser.exception.InvalidOperationException;
import interview.organiser.exception.ResourceAlreadyExistsException;
import interview.organiser.exception.ResourceNotFoundException;
import interview.organiser.exception.UnauthorizedException;
import interview.organiser.model.dto.request.UserRegistrationRequest;
import interview.organiser.model.dto.request.UserUpdateRequest;
import interview.organiser.model.dto.response.MessageResponse;
import interview.organiser.model.dto.response.UserResponse;
import interview.organiser.model.entity.User;
import interview.organiser.repository.UserRepository;
import interview.organiser.service.UserService;
import interview.organiser.util.EntityMapper;
import interview.organiser.util.FileStorageUtil;
import interview.organiser.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Implementation of UserService
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageUtil fileStorageUtil;
    private final EntityMapper entityMapper;

    @Override
    @Transactional
    public UserResponse registerUser(UserRegistrationRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());

        // Check if user already exists
        if (userRepository.existsByEmailAndDeletedFalse(request.getEmail())) {
            throw new ResourceAlreadyExistsException("User with email " + request.getEmail() + " already exists");
        }

        // Validate role - cannot register as ADMIN or ORGANISATION_ADMIN through this endpoint
        if (request.getRole() == UserRole.ADMIN || request.getRole() == UserRole.ORGANISATION_ADMIN) {
            throw new InvalidOperationException("Cannot register as ADMIN or ORGANISATION_ADMIN through user registration");
        }

        // Upload resume if provided (for CANDIDATE)
        String resumeUrl = null;
        if (request.getResumeBase64() != null && !request.getResumeBase64().isEmpty()) {
            resumeUrl = fileStorageUtil.uploadFile(request.getResumeBase64(), "resume");
        }

        // Create user
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .role(request.getRole())
                .skills(request.getSkills())
                .experience(request.getExperience())
                .expertise(request.getExpertise())
                .yearsOfExperience(request.getYearsOfExperience())
                .specialization(request.getSpecialization())
                .resumeUrl(resumeUrl)
                .expectedSalary(request.getExpectedSalary())
                .deleted(false)
                .createdAt(LocalDateTime.now())
                .createdBy(request.getEmail())
                .build();

        user = userRepository.save(user);

        log.info("User registered successfully: {}", user.getEmail());

        return entityMapper.toUserResponse(user);
    }

    @Override
    public UserResponse getUserById(String id) {
        log.debug("Fetching user by ID: {}", id);

        User user = userRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        return entityMapper.toUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateUser(String id, UserUpdateRequest request) {
        log.info("Updating user: {}", id);

        String currentUserId = SecurityUtil.getCurrentUserId();
        User user = userRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        // Check authorization - users can only update their own profile, except ADMIN
        String currentRole = SecurityUtil.getCurrentUserRole();
        if (!currentUserId.equals(id) && !"ROLE_ADMIN".equals(currentRole)) {
            throw new UnauthorizedException("You can only update your own profile");
        }

        // Update fields if provided
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getSkills() != null) {
            user.setSkills(request.getSkills());
        }
        if (request.getExperience() != null) {
            user.setExperience(request.getExperience());
        }
        if (request.getExpertise() != null) {
            user.setExpertise(request.getExpertise());
        }
        if (request.getYearsOfExperience() != null) {
            user.setYearsOfExperience(request.getYearsOfExperience());
        }
        if (request.getSpecialization() != null) {
            user.setSpecialization(request.getSpecialization());
        }
        if (request.getExpectedSalary() != null) {
            user.setExpectedSalary(request.getExpectedSalary());
        }

        // Handle resume upload for CANDIDATE
        if (request.getResumeBase64() != null && !request.getResumeBase64().isEmpty()) {
            String resumeUrl = fileStorageUtil.uploadFile(request.getResumeBase64(), "resume");
            user.setResumeUrl(resumeUrl);
        }

        user.setUpdatedAt(LocalDateTime.now());
        user.setUpdatedBy(currentUserId);

        user = userRepository.save(user);

        log.info("User updated successfully: {}", user.getEmail());

        return entityMapper.toUserResponse(user);
    }

    @Override
    @Transactional
    public MessageResponse deleteUser(String id) {
        log.info("Deleting user: {}", id);

        String currentUserId = SecurityUtil.getCurrentUserId();
        String currentRole = SecurityUtil.getCurrentUserRole();

        // Only ADMIN can delete users
        if (!"ROLE_ADMIN".equals(currentRole)) {
            throw new UnauthorizedException("Only ADMIN can delete users");
        }

        User user = userRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        // Soft delete
        user.setDeleted(true);
        user.setUpdatedAt(LocalDateTime.now());
        user.setUpdatedBy(currentUserId);

        userRepository.save(user);

        log.info("User deleted successfully: {}", user.getEmail());

        return new MessageResponse("User deleted successfully");
    }

    @Override
    public UserResponse getCurrentUser() {
        String currentUserId = SecurityUtil.getCurrentUserId();

        User user = userRepository.findByIdAndDeletedFalse(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUserId));

        return entityMapper.toUserResponse(user);
    }

    @Override
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        log.debug("Fetching all users with pagination");

        return userRepository.findByDeletedFalse(pageable)
                .map(entityMapper::toUserResponse);
    }

    @Override
    public Page<UserResponse> getUsersByRole(String role, Pageable pageable) {
        log.debug("Fetching users by role: {}", role);

        try {
            UserRole userRole = UserRole.valueOf(role.toUpperCase());
            return userRepository.findByRoleAndDeletedFalse(userRole, pageable)
                    .map(entityMapper::toUserResponse);
        } catch (IllegalArgumentException e) {
            throw new InvalidOperationException("Invalid role: " + role);
        }
    }

    @Override
    public Page<UserResponse> getUsersByOrganisation(String organisationId, Pageable pageable) {
        log.debug("Fetching users by organisation: {}", organisationId);

        return userRepository.findByOrganisationIdAndDeletedFalse(organisationId, pageable)
                .map(entityMapper::toUserResponse);
    }
}

