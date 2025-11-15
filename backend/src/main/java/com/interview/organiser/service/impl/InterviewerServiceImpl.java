package com.interview.organiser.service.impl;

import com.interview.organiser.constants.AppConstants;
import com.interview.organiser.constants.enums.UserRole;
import com.interview.organiser.exception.InvalidTokenException;
import com.interview.organiser.exception.ResourceNotFoundException;
import com.interview.organiser.model.dto.request.InterviewerRegistrationRequest;
import com.interview.organiser.model.dto.request.CreateInterviewerRequest;
import com.interview.organiser.model.dto.request.InviteInterviewerRequest;
import com.interview.organiser.model.dto.request.UpdateInterviewerRequest;
import com.interview.organiser.model.dto.response.AuthResponse;
import com.interview.organiser.model.dto.response.InterviewerResponse;
import com.interview.organiser.model.dto.response.MessageResponse;
import com.interview.organiser.model.dto.response.PageResponse;
import com.interview.organiser.model.dto.response.UserResponse;
import com.interview.organiser.model.entity.Interviewer;
import com.interview.organiser.model.entity.RefreshToken;
import com.interview.organiser.model.entity.User;
import com.interview.organiser.repository.InterviewerRepository;
import com.interview.organiser.repository.RecruiterRepository;
import com.interview.organiser.repository.RefreshTokenRepository;
import com.interview.organiser.repository.UserRepository;
import com.interview.organiser.service.InterviewerService;
import com.interview.organiser.service.NotificationService;
import com.interview.organiser.util.EntityMapper;
import com.interview.organiser.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class InterviewerServiceImpl implements InterviewerService {

    private final InterviewerRepository interviewerRepository;
    private final UserRepository userRepository;
    private final RecruiterRepository recruiterRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final NotificationService notificationService;
    private final EntityMapper entityMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public PageResponse<InterviewerResponse> getAllInterviewers(String expertise, Boolean available, Pageable pageable) {
        log.info("Fetching all interviewers with expertise: {}, available: {}", expertise, available);

        Page<Interviewer> interviewerPage;

        if (expertise != null && available != null) {
            interviewerPage = interviewerRepository.findByExpertiseAndAvailability(expertise, available, pageable);
        } else if (expertise != null) {
            interviewerPage = interviewerRepository.findByExpertise(expertise, pageable);
        } else if (available != null) {
            interviewerPage = interviewerRepository.findByAvailability(available, pageable);
        } else {
            interviewerPage = interviewerRepository.findAll(pageable);
        }

        List<InterviewerResponse> interviewerResponses = interviewerPage.getContent().stream()
                .map(entityMapper::toInterviewerResponse)
                .collect(Collectors.toList());

        return PageResponse.<InterviewerResponse>builder()
                .content(interviewerResponses)
                .page(interviewerPage.getNumber())
                .size(interviewerPage.getSize())
                .totalElements(interviewerPage.getTotalElements())
                .totalPages(interviewerPage.getTotalPages())
                .build();
    }

    @Override
    @Transactional
    public InterviewerResponse createInterviewer(CreateInterviewerRequest request) {
        log.info("Creating interviewer for user id: {}", request.getUserId());

        com.interview.organiser.model.entity.User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException(AppConstants.USER_NOT_FOUND));

        Interviewer interviewer = Interviewer.builder()
                .user(user)
                .email(user.getEmail())
                .department(request.getDepartment())
                .expertise(request.getExpertise())
                .yearsOfExperience(request.getYearsOfExperience())
                .availability(request.getAvailability() != null ? request.getAvailability() : true)
                .totalInterviews(0)
                .isRegistered(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Interviewer savedInterviewer = interviewerRepository.save(interviewer);

        return entityMapper.toInterviewerResponse(savedInterviewer);
    }

    @Override
    @Transactional
    public MessageResponse inviteInterviewer(InviteInterviewerRequest request) {
        log.info("Inviting interviewer with email: {}", request.getEmail());

        // Check if interviewer already exists
        if (interviewerRepository.findByEmail(request.getEmail()).isPresent()) {
            return MessageResponse.builder()
                    .message("Interviewer with this email already exists")
                    .timestamp(LocalDateTime.now())
                    .build();
        }

        // Get recruiter name for notification
        String recruiterName = "Recruiter";
        if (request.getRecruiterId() != null) {
            recruiterRepository.findById(request.getRecruiterId())
                    .ifPresent(recruiter -> {});
        }

        // Generate invitation token
        String invitationToken = UUID.randomUUID().toString();

        // Create interviewer record with pending status
        Interviewer interviewer = Interviewer.builder()
                .email(request.getEmail())
                .invitationToken(invitationToken)
                .invitationSentAt(LocalDateTime.now())
                .isRegistered(false)
                .availability(true)
                .totalInterviews(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        interviewerRepository.save(interviewer);

        // Send invitation notification (mocked)
        notificationService.sendInterviewerInvitation(request.getEmail(), invitationToken, recruiterName);

        return MessageResponse.builder()
                .message("Invitation sent successfully to " + request.getEmail())
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Override
    @Transactional
    public AuthResponse completeInterviewerRegistration(InterviewerRegistrationRequest request) {
        log.info("Completing interviewer registration with token: {}", request.getInvitationToken());

        // Find the interviewer invitation by token
        Interviewer interviewer = interviewerRepository.findByInvitationToken(request.getInvitationToken())
                .orElseThrow(() -> new InvalidTokenException("Invalid or expired invitation token"));

        // Check if already registered
        if (Boolean.TRUE.equals(interviewer.getIsRegistered())) {
            throw new InvalidTokenException("This invitation has already been used");
        }

        // Create user account for the interviewer
        User user = User.builder()
                .email(interviewer.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Add INTERVIEWER role
        user.getRoles().add(UserRole.INTERVIEWER);
        User savedUser = userRepository.save(user);

        // Update interviewer with user reference and additional details
        interviewer.setUser(savedUser);
        interviewer.setDepartment(request.getDepartment());
        interviewer.setExpertise(request.getExpertise());
        interviewer.setYearsOfExperience(request.getYearsOfExperience());
        interviewer.setIsRegistered(true);
        interviewer.setInvitationAcceptedAt(LocalDateTime.now());
        interviewer.setUpdatedAt(LocalDateTime.now());

        interviewerRepository.save(interviewer);

        log.info("Completed interviewer registration for user {} with interviewer {}", savedUser.getId(), interviewer.getId());

        // Generate tokens
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

    private String createRefreshToken(String userId) {
        // Delete any existing refresh tokens for this user
        refreshTokenRepository.deleteByUserId(userId);

        // Create new refresh token
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

    @Override
    public InterviewerResponse getInterviewerById(String interviewerId) {
        log.info("Fetching interviewer with id: {}", interviewerId);

        Interviewer interviewer = interviewerRepository.findById(interviewerId)
                .orElseThrow(() -> new ResourceNotFoundException(AppConstants.INTERVIEWER_NOT_FOUND));

        return entityMapper.toInterviewerResponse(interviewer);
    }

    @Override
    @Transactional
    public InterviewerResponse updateInterviewer(String interviewerId, UpdateInterviewerRequest request) {
        log.info("Updating interviewer with id: {}", interviewerId);

        Interviewer interviewer = interviewerRepository.findById(interviewerId)
                .orElseThrow(() -> new ResourceNotFoundException(AppConstants.INTERVIEWER_NOT_FOUND));

        if (request.getDepartment() != null) {
            interviewer.setDepartment(request.getDepartment());
        }
        if (request.getExpertise() != null) {
            interviewer.setExpertise(request.getExpertise());
        }
        if (request.getYearsOfExperience() != null) {
            interviewer.setYearsOfExperience(request.getYearsOfExperience());
        }
        if (request.getAvailability() != null) {
            interviewer.setAvailability(request.getAvailability());
        }

        interviewer.setUpdatedAt(LocalDateTime.now());

        Interviewer updatedInterviewer = interviewerRepository.save(interviewer);

        return entityMapper.toInterviewerResponse(updatedInterviewer);
    }

    @Override
    @Transactional
    public MessageResponse deleteInterviewer(String interviewerId) {
        log.info("Deleting interviewer with id: {}", interviewerId);

        if (!interviewerRepository.existsById(interviewerId)) {
            throw new ResourceNotFoundException(AppConstants.INTERVIEWER_NOT_FOUND);
        }

        interviewerRepository.deleteById(interviewerId);

        return MessageResponse.builder()
                .message("Interviewer deleted successfully")
                .timestamp(LocalDateTime.now())
                .build();
    }
}

