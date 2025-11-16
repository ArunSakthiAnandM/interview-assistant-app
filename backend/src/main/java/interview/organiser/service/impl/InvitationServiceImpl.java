package interview.organiser.service.impl;

import interview.organiser.constants.AppConstants;
import interview.organiser.constants.InvitationStatus;
import interview.organiser.constants.UserRole;
import interview.organiser.constants.VerificationStatus;
import interview.organiser.exception.InvalidOperationException;
import interview.organiser.exception.InvitationExpiredException;
import interview.organiser.exception.ResourceNotFoundException;
import interview.organiser.exception.UnauthorizedException;
import interview.organiser.model.dto.request.InvitationRequest;
import interview.organiser.model.dto.response.InvitationResponse;
import interview.organiser.model.dto.response.MessageResponse;
import interview.organiser.model.entity.Invitation;
import interview.organiser.model.entity.Organisation;
import interview.organiser.model.entity.User;
import interview.organiser.repository.InvitationRepository;
import interview.organiser.repository.OrganisationRepository;
import interview.organiser.repository.UserRepository;
import interview.organiser.service.InvitationService;
import interview.organiser.service.NotificationService;
import interview.organiser.util.EntityMapper;
import interview.organiser.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Implementation of InvitationService
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class InvitationServiceImpl implements InvitationService {

    private final InvitationRepository invitationRepository;
    private final UserRepository userRepository;
    private final OrganisationRepository organisationRepository;
    private final NotificationService notificationService;
    private final EntityMapper entityMapper;

    @Override
    @Transactional
    public InvitationResponse sendInvitation(InvitationRequest request) {
        log.info("Sending invitation to: {}", request.getEmail());

        String currentUserId = SecurityUtil.getCurrentUserId();
        String currentRole = SecurityUtil.getCurrentUserRole();

        // Get current user to determine organisation
        User currentUser = userRepository.findByIdAndDeletedFalse(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUserId));

        // Verify user has permission (ORGANISATION_ADMIN or RECRUITER)
        if (currentUser.getRole() != UserRole.ORGANISATION_ADMIN && currentUser.getRole() != UserRole.RECRUITER) {
            throw new UnauthorizedException("Only ORGANISATION_ADMIN or RECRUITER can send invitations");
        }

        // Verify user has an organisation
        if (currentUser.getOrganisationId() == null) {
            throw new InvalidOperationException("You must be associated with an organisation to send invitations");
        }

        // Verify organisation is verified
        Organisation organisation = organisationRepository.findByIdAndDeletedFalse(currentUser.getOrganisationId())
                .orElseThrow(() -> new ResourceNotFoundException("Organisation", "id", currentUser.getOrganisationId()));

        if (organisation.getVerificationStatus() != VerificationStatus.VERIFIED) {
            throw new InvalidOperationException("Organisation must be verified before sending invitations");
        }

        // Verify invited role is valid (can only invite RECRUITER or INTERVIEWER)
        if (request.getRole() != UserRole.RECRUITER && request.getRole() != UserRole.INTERVIEWER) {
            throw new InvalidOperationException("Can only invite RECRUITER or INTERVIEWER roles");
        }

        // Check if user already exists and is associated with an organisation
        User existingUser = userRepository.findByEmailAndDeletedFalse(request.getEmail()).orElse(null);
        if (existingUser != null && existingUser.getOrganisationId() != null) {
            throw new InvalidOperationException("User is already associated with an organisation");
        }

        // Set default expiry if not provided
        int expiryDays = request.getExpiryDays() != null ? request.getExpiryDays() : AppConstants.DEFAULT_INVITATION_EXPIRY_DAYS;
        LocalDateTime expiryDate = LocalDateTime.now().plusDays(expiryDays);

        // Create invitation
        Invitation invitation = Invitation.builder()
                .email(request.getEmail())
                .organisationId(currentUser.getOrganisationId())
                .invitedRole(request.getRole())
                .status(InvitationStatus.PENDING)
                .expiryDays(expiryDays)
                .expiryDate(expiryDate)
                .invitedBy(currentUserId)
                .createdAt(LocalDateTime.now())
                .build();

        invitation = invitationRepository.save(invitation);

        // Send notification email
        String invitationLink = "http://localhost:3000/accept-invitation/" + invitation.getId();
        notificationService.sendOrganisationInvitation(request.getEmail(), organisation.getName(),
                request.getRole().name(), invitationLink);

        log.info("Invitation sent successfully to: {}", request.getEmail());

        return entityMapper.toInvitationResponse(invitation);
    }

    @Override
    @Transactional
    public MessageResponse acceptInvitation(String invitationId) {
        log.info("Accepting invitation: {}", invitationId);

        String currentUserId = SecurityUtil.getCurrentUserId();

        User currentUser = userRepository.findByIdAndDeletedFalse(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUserId));

        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation", "id", invitationId));

        // Verify invitation is for current user's email
        if (!invitation.getEmail().equals(currentUser.getEmail())) {
            throw new UnauthorizedException("This invitation is not for you");
        }

        // Verify invitation status
        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new InvalidOperationException("Invitation has already been " + invitation.getStatus().name().toLowerCase());
        }

        // Check if invitation has expired
        if (invitation.getExpiryDate().isBefore(LocalDateTime.now())) {
            invitation.setStatus(InvitationStatus.EXPIRED);
            invitationRepository.save(invitation);
            throw new InvitationExpiredException("Invitation has expired");
        }

        // Check if user is already associated with an organisation
        if (currentUser.getOrganisationId() != null) {
            throw new InvalidOperationException("You are already associated with an organisation");
        }

        // Update invitation status
        invitation.setStatus(InvitationStatus.ACCEPTED);
        invitation.setAcceptedAt(LocalDateTime.now());
        invitation.setUpdatedAt(LocalDateTime.now());
        invitationRepository.save(invitation);

        // Associate user with organisation
        currentUser.setOrganisationId(invitation.getOrganisationId());
        currentUser.setRole(invitation.getInvitedRole());
        currentUser.setUpdatedAt(LocalDateTime.now());
        currentUser.setUpdatedBy(currentUserId);
        userRepository.save(currentUser);

        log.info("Invitation accepted successfully by: {}", currentUser.getEmail());

        return new MessageResponse("Invitation accepted successfully. You are now part of the organisation.");
    }

    @Override
    @Transactional
    public MessageResponse declineInvitation(String invitationId) {
        log.info("Declining invitation: {}", invitationId);

        String currentUserId = SecurityUtil.getCurrentUserId();

        User currentUser = userRepository.findByIdAndDeletedFalse(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUserId));

        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation", "id", invitationId));

        // Verify invitation is for current user's email
        if (!invitation.getEmail().equals(currentUser.getEmail())) {
            throw new UnauthorizedException("This invitation is not for you");
        }

        // Verify invitation status
        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new InvalidOperationException("Invitation has already been " + invitation.getStatus().name().toLowerCase());
        }

        // Update invitation status
        invitation.setStatus(InvitationStatus.DECLINED);
        invitation.setDeclinedAt(LocalDateTime.now());
        invitation.setUpdatedAt(LocalDateTime.now());
        invitationRepository.save(invitation);

        log.info("Invitation declined by: {}", currentUser.getEmail());

        return new MessageResponse("Invitation declined successfully");
    }

    @Override
    public InvitationResponse getInvitationById(String id) {
        log.debug("Fetching invitation by ID: {}", id);

        Invitation invitation = invitationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation", "id", id));

        return entityMapper.toInvitationResponse(invitation);
    }

    @Override
    public Page<InvitationResponse> getMyInvitations(Pageable pageable) {
        log.debug("Fetching invitations for current user");

        String currentUserId = SecurityUtil.getCurrentUserId();
        User currentUser = userRepository.findByIdAndDeletedFalse(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUserId));

        return invitationRepository.findByEmail(currentUser.getEmail(), pageable)
                .map(entityMapper::toInvitationResponse);
    }

    @Override
    public Page<InvitationResponse> getOrganisationInvitations(String organisationId, Pageable pageable) {
        log.debug("Fetching invitations for organisation: {}", organisationId);

        String currentUserId = SecurityUtil.getCurrentUserId();
        User currentUser = userRepository.findByIdAndDeletedFalse(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUserId));

        // Verify user is from the same organisation or is ADMIN
        String currentRole = SecurityUtil.getCurrentUserRole();
        if (!"ROLE_ADMIN".equals(currentRole) && !organisationId.equals(currentUser.getOrganisationId())) {
            throw new UnauthorizedException("You can only view invitations for your own organisation");
        }

        return invitationRepository.findByOrganisationId(organisationId, pageable)
                .map(entityMapper::toInvitationResponse);
    }

    @Override
    public InvitationResponse extendInvitation(String invitationId, interview.organiser.model.dto.request.InvitationExtensionRequest request) {
        log.info("Extending invitation {} by {} days", invitationId, request.getAdditionalDays());

        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation", "id", invitationId));

        // Verify user is from the same organisation or is ADMIN
        String currentUserId = SecurityUtil.getCurrentUserId();
        User currentUser = userRepository.findByIdAndDeletedFalse(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUserId));

        String currentRole = SecurityUtil.getCurrentUserRole();
        if (!"ROLE_ADMIN".equals(currentRole) &&
            !"ROLE_ORGANISATION_ADMIN".equals(currentRole) &&
            !invitation.getOrganisationId().equals(currentUser.getOrganisationId())) {
            throw new UnauthorizedException("You can only extend invitations for your own organisation");
        }

        // Extend expiry date
        LocalDateTime newExpiryDate = invitation.getExpiryDate().plusDays(request.getAdditionalDays());
        invitation.setExpiryDate(newExpiryDate);

        // If invitation was expired, reset status to PENDING
        if (invitation.getStatus() == InvitationStatus.EXPIRED) {
            invitation.setStatus(InvitationStatus.PENDING);
        }

        Invitation saved = invitationRepository.save(invitation);

        log.info("Invitation {} extended until {}", invitationId, newExpiryDate);

        return entityMapper.toInvitationResponse(saved);
    }
}
