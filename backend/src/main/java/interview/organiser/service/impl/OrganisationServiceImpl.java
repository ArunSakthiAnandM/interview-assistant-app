package interview.organiser.service.impl;

import interview.organiser.constants.FileEntityType;
import interview.organiser.constants.UserRole;
import interview.organiser.constants.VerificationStatus;
import interview.organiser.exception.InvalidOperationException;
import interview.organiser.exception.ResourceAlreadyExistsException;
import interview.organiser.exception.ResourceNotFoundException;
import interview.organiser.exception.UnauthorizedException;
import interview.organiser.model.dto.request.OrganisationRegistrationRequest;
import interview.organiser.model.dto.request.OrganisationResubmissionRequest;
import interview.organiser.model.dto.request.OrganisationUpdateRequest;
import interview.organiser.model.dto.request.OrganisationVerificationRequest;
import interview.organiser.model.dto.response.MessageResponse;
import interview.organiser.model.dto.response.OrganisationResponse;
import interview.organiser.model.dto.response.VerificationHistoryResponse;
import interview.organiser.model.entity.Organisation;
import interview.organiser.model.entity.User;
import interview.organiser.model.entity.VerificationHistory;
import interview.organiser.repository.OrganisationRepository;
import interview.organiser.repository.UserRepository;
import interview.organiser.service.FileStorageService;
import interview.organiser.service.NotificationService;
import interview.organiser.service.OrganisationService;
import interview.organiser.util.EntityMapper;
import interview.organiser.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of OrganisationService
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OrganisationServiceImpl implements OrganisationService {

    private final OrganisationRepository organisationRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageService fileStorageService;
    private final NotificationService notificationService;
    private final EntityMapper entityMapper;

    @Override
    @Transactional
    public OrganisationResponse registerOrganisation(OrganisationRegistrationRequest request) {
        log.info("Registering new organisation: {}", request.getOrganisationName());

        // Check if organisation already exists
        if (organisationRepository.existsByNameAndDeletedFalse(request.getOrganisationName())) {
            throw new ResourceAlreadyExistsException("Organisation with name " + request.getOrganisationName() + " already exists");
        }

        // Check if admin email already exists
        if (userRepository.existsByEmailAndDeletedFalse(request.getEmail())) {
            throw new ResourceAlreadyExistsException("User with email " + request.getEmail() + " already exists");
        }

        // Upload KYC document if provided
        String kycDocumentUrl = null;
        if (request.getKycDocumentBase64() != null && !request.getKycDocumentBase64().isEmpty()) {
            // We'll set this after creating the organisation to have the orgId
            kycDocumentUrl = "temp";
        }

        // Create admin user first
        User adminUser = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getAdminName())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .role(UserRole.ORGANISATION_ADMIN)
                .deleted(false)
                .createdAt(LocalDateTime.now())
                .createdBy(request.getEmail())
                .build();

        adminUser = userRepository.save(adminUser);

        // Create organisation
        Organisation organisation = Organisation.builder()
                .name(request.getOrganisationName())
                .adminEmail(request.getEmail())
                .adminUserId(adminUser.getId())
                .kycDocumentUrl(kycDocumentUrl)
                .verificationStatus(VerificationStatus.PENDING)
                .deleted(false)
                .createdAt(LocalDateTime.now())
                .createdBy(adminUser.getId())
                .build();

        organisation = organisationRepository.save(organisation);

        // Upload KYC document if provided (now that we have org ID)
        if (request.getKycDocumentBase64() != null && !request.getKycDocumentBase64().isEmpty()) {
            String actualKycUrl = fileStorageService.uploadFileFromBase64(
                    request.getKycDocumentBase64(),
                    "kyc_document_" + System.currentTimeMillis() + ".pdf",
                    FileEntityType.ORGANISATION_KYC,
                    organisation.getId(),
                    adminUser.getId()
            ).getS3Key();
            organisation.setKycDocumentUrl(actualKycUrl);
            organisation = organisationRepository.save(organisation);
        }

        // Update admin user with organisation ID
        adminUser.setOrganisationId(organisation.getId());
        userRepository.save(adminUser);

        log.info("Organisation registered successfully: {}", organisation.getName());

        return entityMapper.toOrganisationResponse(organisation);
    }

    @Override
    public OrganisationResponse getOrganisationById(String id) {
        log.debug("Fetching organisation by ID: {}", id);

        Organisation organisation = organisationRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organisation", "id", id));

        return entityMapper.toOrganisationResponse(organisation);
    }

    @Override
    @Transactional
    public OrganisationResponse updateOrganisation(String id, OrganisationUpdateRequest request) {
        log.info("Updating organisation: {}", id);

        String currentUserId = SecurityUtil.getCurrentUserId();
        String currentRole = SecurityUtil.getCurrentUserRole();

        Organisation organisation = organisationRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organisation", "id", id));

        // Check authorization - only ORGANISATION_ADMIN of this org or ADMIN can update
        if (!"ROLE_ADMIN".equals(currentRole) && !organisation.getAdminUserId().equals(currentUserId)) {
            throw new UnauthorizedException("You are not authorized to update this organisation");
        }

        // Check if organisation is verified (ORGANISATION_ADMIN can only update if verified)
        if (!"ROLE_ADMIN".equals(currentRole) && organisation.getVerificationStatus() != VerificationStatus.VERIFIED) {
            throw new InvalidOperationException("Organisation must be verified before making changes");
        }

        // Update fields if provided
        if (request.getName() != null) {
            // Check if new name already exists
            if (!request.getName().equals(organisation.getName()) &&
                organisationRepository.existsByNameAndDeletedFalse(request.getName())) {
                throw new ResourceAlreadyExistsException("Organisation with name " + request.getName() + " already exists");
            }
            organisation.setName(request.getName());
        }

        // Handle KYC document upload
        if (request.getKycDocumentBase64() != null && !request.getKycDocumentBase64().isEmpty()) {
            String kycDocumentUrl = fileStorageService.uploadFileFromBase64(
                    request.getKycDocumentBase64(),
                    "kyc_update_" + System.currentTimeMillis() + ".pdf",
                    FileEntityType.ORGANISATION_KYC,
                    id,
                    currentUserId
            ).getS3Key();
            organisation.setKycDocumentUrl(kycDocumentUrl);
        }

        organisation.setUpdatedAt(LocalDateTime.now());
        organisation.setUpdatedBy(currentUserId);

        organisation = organisationRepository.save(organisation);

        log.info("Organisation updated successfully: {}", organisation.getName());

        return entityMapper.toOrganisationResponse(organisation);
    }

    @Override
    @Transactional
    public MessageResponse deleteOrganisation(String id) {
        log.info("Deleting organisation: {}", id);

        String currentUserId = SecurityUtil.getCurrentUserId();
        String currentRole = SecurityUtil.getCurrentUserRole();

        // Only ADMIN can delete organisations
        if (!"ROLE_ADMIN".equals(currentRole)) {
            throw new UnauthorizedException("Only ADMIN can delete organisations");
        }

        Organisation organisation = organisationRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organisation", "id", id));

        // Soft delete organisation
        organisation.setDeleted(true);
        organisation.setUpdatedAt(LocalDateTime.now());
        organisation.setUpdatedBy(currentUserId);
        organisationRepository.save(organisation);

        // Disassociate all users from this organisation
        List<User> associatedUsers = userRepository.findByOrganisationIdAndDeletedFalse(id, Pageable.unpaged()).getContent();
        for (User user : associatedUsers) {
            // Send notification
            notificationService.sendDisassociationNotification(user.getEmail(), user.getName(), organisation.getName());

            // Remove organisation association
            user.setOrganisationId(null);
            user.setUpdatedAt(LocalDateTime.now());
            user.setUpdatedBy(currentUserId);
            userRepository.save(user);
        }

        log.info("Organisation deleted successfully: {}", organisation.getName());

        return new MessageResponse("Organisation deleted successfully and all users have been notified");
    }

    @Override
    @Transactional
    public OrganisationResponse verifyOrganisation(String id, OrganisationVerificationRequest request) {
        log.info("Verifying organisation: {}", id);

        String currentUserId = SecurityUtil.getCurrentUserId();
        String currentRole = SecurityUtil.getCurrentUserRole();

        // Only ADMIN can verify organisations
        if (!"ROLE_ADMIN".equals(currentRole)) {
            throw new UnauthorizedException("Only ADMIN can verify organisations");
        }

        Organisation organisation = organisationRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organisation", "id", id));

        // Validate rejection reason if status is REJECTED
        if (request.getStatus() == VerificationStatus.REJECTED &&
            (request.getRejectionReason() == null || request.getRejectionReason().isEmpty())) {
            throw new InvalidOperationException("Rejection reason is required when rejecting an organisation");
        }

        // Save to history before updating
        if (organisation.getVerificationHistory() == null) {
            organisation.setVerificationHistory(new ArrayList<>());
        }

        VerificationHistory historyEntry = VerificationHistory.builder()
                .status(request.getStatus())
                .verifiedBy(currentUserId)
                .verifiedAt(LocalDateTime.now())
                .reason(request.getRejectionReason())
                .kycDocumentUrl(organisation.getKycDocumentUrl())
                .build();
        organisation.getVerificationHistory().add(historyEntry);

        organisation.setVerificationStatus(request.getStatus());
        organisation.setVerifiedBy(currentUserId);
        organisation.setVerifiedAt(LocalDateTime.now());
        organisation.setRejectionReason(request.getRejectionReason());
        organisation.setUpdatedAt(LocalDateTime.now());
        organisation.setUpdatedBy(currentUserId);

        organisation = organisationRepository.save(organisation);

        log.info("Organisation verification status updated to: {}", request.getStatus());

        return entityMapper.toOrganisationResponse(organisation);
    }

    @Override
    public Page<OrganisationResponse> getAllOrganisations(Pageable pageable) {
        log.debug("Fetching all organisations with pagination");

        return organisationRepository.findByDeletedFalse(pageable)
                .map(entityMapper::toOrganisationResponse);
    }

    @Override
    public Page<OrganisationResponse> getOrganisationsByStatus(String status, Pageable pageable) {
        log.debug("Fetching organisations by status: {}", status);

        try {
            VerificationStatus verificationStatus = VerificationStatus.valueOf(status.toUpperCase());
            return organisationRepository.findByVerificationStatusAndDeletedFalse(verificationStatus, pageable)
                    .map(entityMapper::toOrganisationResponse);
        } catch (IllegalArgumentException e) {
            throw new InvalidOperationException("Invalid verification status: " + status);
        }
    }

    @Override
    @Transactional
    public OrganisationResponse resubmitOrganisation(String id, OrganisationResubmissionRequest request) {
        log.info("Resubmitting organisation {} for verification", id);

        Organisation organisation = organisationRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organisation", "id", id));

        // Verify user is organisation admin or system admin
        String currentUserId = SecurityUtil.getCurrentUserId();
        String currentRole = SecurityUtil.getCurrentUserRole();

        if (!"ROLE_ADMIN".equals(currentRole) && !organisation.getAdminUserId().equals(currentUserId)) {
            throw new UnauthorizedException("Only organisation admin or system admin can resubmit");
        }

        // Only allow resubmission if current status is REJECTED
        if (organisation.getVerificationStatus() != VerificationStatus.REJECTED) {
            throw new InvalidOperationException("Can only resubmit rejected organisations");
        }

        // Save current state to history before updating
        if (organisation.getVerificationHistory() == null) {
            organisation.setVerificationHistory(new ArrayList<>());
        }

        VerificationHistory historyEntry = VerificationHistory.builder()
                .status(organisation.getVerificationStatus())
                .verifiedBy(organisation.getVerifiedBy())
                .verifiedAt(organisation.getVerifiedAt())
                .reason(organisation.getRejectionReason())
                .kycDocumentUrl(organisation.getKycDocumentUrl())
                .build();
        organisation.getVerificationHistory().add(historyEntry);

        // Update KYC document if provided
        if (request.getKycDocumentBase64() != null && !request.getKycDocumentBase64().isEmpty()) {
            String kycUrl = fileStorageService.uploadFileFromBase64(
                    request.getKycDocumentBase64(),
                    "kyc_resubmission_" + System.currentTimeMillis() + ".pdf",
                    FileEntityType.ORGANISATION_KYC,
                    id,
                    currentUserId
            ).getS3Key();
            organisation.setKycDocumentUrl(kycUrl);
        }

        // Reset verification status to PENDING
        organisation.setVerificationStatus(VerificationStatus.PENDING);
        organisation.setVerifiedBy(null);
        organisation.setVerifiedAt(null);
        organisation.setRejectionReason(null);
        organisation.setUpdatedAt(LocalDateTime.now());
        organisation.setUpdatedBy(currentUserId);

        Organisation saved = organisationRepository.save(organisation);

        log.info("Organisation {} resubmitted for verification", id);

        return entityMapper.toOrganisationResponse(saved);
    }

    @Override
    public List<VerificationHistoryResponse> getVerificationHistory(String id) {
        log.debug("Fetching verification history for organisation {}", id);

        Organisation organisation = organisationRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organisation", "id", id));

        // Verify access
        String currentUserId = SecurityUtil.getCurrentUserId();
        String currentRole = SecurityUtil.getCurrentUserRole();

        if (!"ROLE_ADMIN".equals(currentRole) && !organisation.getAdminUserId().equals(currentUserId)) {
            throw new UnauthorizedException("You can only view verification history of your own organisation");
        }

        if (organisation.getVerificationHistory() == null || organisation.getVerificationHistory().isEmpty()) {
            return new ArrayList<>();
        }

        return organisation.getVerificationHistory().stream()
                .map(history -> {
                    User verifier = history.getVerifiedBy() != null ?
                            userRepository.findById(history.getVerifiedBy()).orElse(null) : null;

                    return VerificationHistoryResponse.builder()
                            .status(history.getStatus())
                            .verifiedBy(history.getVerifiedBy())
                            .verifiedByName(verifier != null ? verifier.getName() : null)
                            .verifiedAt(history.getVerifiedAt())
                            .reason(history.getReason())
                            .kycDocumentUrl(history.getKycDocumentUrl())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    public OrganisationResponse getMyOrganisation() {
        log.debug("Fetching current user's organisation");

        String currentUserId = SecurityUtil.getCurrentUserId();
        User currentUser = userRepository.findByIdAndDeletedFalse(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUserId));

        if (currentUser.getOrganisationId() == null) {
            throw new InvalidOperationException("User is not associated with any organisation");
        }

        return getOrganisationById(currentUser.getOrganisationId());
    }

    @Override
    @Transactional
    public OrganisationResponse submitForVerification(String id) {
        log.info("Submitting organisation {} for verification", id);

        Organisation organisation = organisationRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organisation", "id", id));

        // Verify user is from the same organisation or is ADMIN
        String currentUserId = SecurityUtil.getCurrentUserId();
        User currentUser = userRepository.findByIdAndDeletedFalse(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUserId));

        if (!currentUser.getRole().equals(UserRole.ADMIN) &&
            !currentUser.getRole().equals(UserRole.ORGANISATION_ADMIN)) {
            throw new UnauthorizedException("Only ADMIN or ORGANISATION_ADMIN can submit for verification");
        }

        if (!currentUser.getRole().equals(UserRole.ADMIN) &&
            !organisation.getId().equals(currentUser.getOrganisationId())) {
            throw new UnauthorizedException("You can only submit your own organisation for verification");
        }

        // Check current status
        if (organisation.getVerificationStatus() == VerificationStatus.VERIFIED) {
            throw new InvalidOperationException("Organisation is already verified");
        }

        if (organisation.getVerificationStatus() == VerificationStatus.PENDING) {
            throw new InvalidOperationException("Organisation verification is already pending");
        }

        // Update status to PENDING
        organisation.setVerificationStatus(VerificationStatus.PENDING);
        organisation.setUpdatedAt(LocalDateTime.now());
        organisation.setUpdatedBy(currentUserId);

        Organisation saved = organisationRepository.save(organisation);

        // Create verification history entry
        VerificationHistory historyEntry = VerificationHistory.builder()
                .status(VerificationStatus.PENDING)
                .verifiedBy(currentUserId)
                .verifiedAt(LocalDateTime.now())
                .reason("Submitted for verification")
                .build();

        if (organisation.getVerificationHistory() == null) {
            organisation.setVerificationHistory(new ArrayList<>());
        }
        organisation.getVerificationHistory().add(historyEntry);
        organisationRepository.save(organisation);

        log.info("Organisation {} submitted for verification", id);

        return entityMapper.toOrganisationResponse(saved);
    }
}
