package interview.organiser.service;

import interview.organiser.model.dto.request.BulkInvitationRequest;
import interview.organiser.model.dto.request.DeclineInvitationRequest;
import interview.organiser.model.dto.request.InvitationExtensionRequest;
import interview.organiser.model.dto.request.InvitationRequest;
import interview.organiser.model.dto.response.BulkInvitationResponse;
import interview.organiser.model.dto.response.InvitationResponse;
import interview.organiser.model.dto.response.MessageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for invitation operations
 */
public interface InvitationService {

    /**
     * Send invitation to join organisation
     */
    InvitationResponse sendInvitation(InvitationRequest request);

    /**
     * Send multiple invitations at once
     */
    BulkInvitationResponse bulkSendInvitations(BulkInvitationRequest request);

    /**
     * Accept invitation
     */
    InvitationResponse acceptInvitation(String invitationId);

    /**
     * Decline invitation with optional reason
     */
    InvitationResponse declineInvitation(String invitationId, DeclineInvitationRequest request);

    /**
     * Get invitation by ID
     */
    InvitationResponse getInvitationById(String id);

    /**
     * Get all invitations with filters (Admin only)
     */
    Page<InvitationResponse> getAllInvitations(Pageable pageable, String status, String organisationId);

    /**
     * Get invitations for current user
     */
    Page<InvitationResponse> getMyInvitations(Pageable pageable);

    /**
     * Get invitations sent by organisation
     */
    Page<InvitationResponse> getOrganisationInvitations(String organisationId, Pageable pageable);

    /**
     * Extend invitation expiry
     */
    InvitationResponse extendInvitation(String invitationId, InvitationExtensionRequest request);

    /**
     * Delete invitation
     */
    MessageResponse deleteInvitation(String invitationId);
}
