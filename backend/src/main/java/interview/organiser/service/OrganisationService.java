package interview.organiser.service;

import interview.organiser.model.dto.request.OrganisationRegistrationRequest;
import interview.organiser.model.dto.request.OrganisationResubmissionRequest;
import interview.organiser.model.dto.request.OrganisationUpdateRequest;
import interview.organiser.model.dto.request.OrganisationVerificationRequest;
import interview.organiser.model.dto.response.MessageResponse;
import interview.organiser.model.dto.response.OrganisationResponse;
import interview.organiser.model.dto.response.VerificationHistoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Service interface for organisation operations
 */
public interface OrganisationService {

    /**
     * Register a new organisation with admin user
     */
    OrganisationResponse registerOrganisation(OrganisationRegistrationRequest request);

    /**
     * Get organisation by ID
     */
    OrganisationResponse getOrganisationById(String id);

    /**
     * Update organisation
     */
    OrganisationResponse updateOrganisation(String id, OrganisationUpdateRequest request);

    /**
     * Delete organisation (soft delete)
     */
    MessageResponse deleteOrganisation(String id);

    /**
     * Verify organisation (ADMIN only)
     */
    OrganisationResponse verifyOrganisation(String id, OrganisationVerificationRequest request);

    /**
     * Get all organisations with pagination
     */
    Page<OrganisationResponse> getAllOrganisations(Pageable pageable);

    /**
     * Get organisations by verification status
     */
    Page<OrganisationResponse> getOrganisationsByStatus(String status, Pageable pageable);

    /**
     * Resubmit organisation for verification
     */
    OrganisationResponse resubmitOrganisation(String id, OrganisationResubmissionRequest request);

    /**
     * Get organisation verification history
     */
    List<VerificationHistoryResponse> getVerificationHistory(String id);

    /**
     * Get current user's organisation
     */
    OrganisationResponse getMyOrganisation();

    /**
     * Submit organisation for verification
     */
    OrganisationResponse submitForVerification(String id);
}

