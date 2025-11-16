package interview.organiser.service;

import interview.organiser.model.dto.request.InvitationExtensionRequest;
import interview.organiser.model.dto.request.InvitationRequest;
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
     * Accept invitation
     */
    MessageResponse acceptInvitation(String invitationId);

    /**
     * Decline invitation
     */
    MessageResponse declineInvitation(String invitationId);

    /**
     * Get invitation by ID
     */
    InvitationResponse getInvitationById(String id);

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
}
