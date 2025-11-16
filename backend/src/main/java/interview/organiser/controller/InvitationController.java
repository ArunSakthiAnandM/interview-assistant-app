package interview.organiser.controller;

import interview.organiser.model.dto.request.InvitationExtensionRequest;
import interview.organiser.model.dto.request.InvitationRequest;
import interview.organiser.model.dto.response.InvitationResponse;
import interview.organiser.model.dto.response.MessageResponse;
import interview.organiser.service.InvitationService;
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

/**
 * REST Controller for invitation operations
 */
@Slf4j
@RestController
@RequestMapping("/invitations")
@RequiredArgsConstructor
public class InvitationController {

    private final InvitationService invitationService;

    /**
     * Send invitation to join organisation
     */
    @PostMapping("/send")
    @PreAuthorize("hasAnyRole('ORGANISATION_ADMIN', 'RECRUITER')")
    public ResponseEntity<InvitationResponse> sendInvitation(@Valid @RequestBody InvitationRequest request) {
        log.info("Send invitation request received for email: {}", request.getEmail());
        InvitationResponse response = invitationService.sendInvitation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Accept invitation
     */
    @PostMapping("/{id}/accept")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> acceptInvitation(@PathVariable String id) {
        log.info("Accept invitation request received for ID: {}", id);
        MessageResponse response = invitationService.acceptInvitation(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Decline invitation
     */
    @PostMapping("/{id}/decline")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> declineInvitation(@PathVariable String id) {
        log.info("Decline invitation request received for ID: {}", id);
        MessageResponse response = invitationService.declineInvitation(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Get invitation by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<InvitationResponse> getInvitationById(@PathVariable String id) {
        log.info("Get invitation by ID request received: {}", id);
        InvitationResponse response = invitationService.getInvitationById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Get my invitations
     */
    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<InvitationResponse>> getMyInvitations(
            @PageableDefault(size = 5, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Get my invitations request received");
        Page<InvitationResponse> response = invitationService.getMyInvitations(pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Get invitations for organisation
     */
    @GetMapping("/organisation/{organisationId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANISATION_ADMIN', 'RECRUITER')")
    public ResponseEntity<Page<InvitationResponse>> getOrganisationInvitations(
            @PathVariable String organisationId,
            @PageableDefault(size = 5, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Get organisation invitations request received for organisation: {}", organisationId);
        Page<InvitationResponse> response = invitationService.getOrganisationInvitations(organisationId, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Extend invitation expiry
     */
    @PostMapping("/{id}/extend")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANISATION_ADMIN')")
    public ResponseEntity<InvitationResponse> extendInvitation(
            @PathVariable String id,
            @Valid @RequestBody InvitationExtensionRequest request) {
        log.info("Extend invitation request received for ID: {}", id);
        InvitationResponse response = invitationService.extendInvitation(id, request);
        return ResponseEntity.ok(response);
    }
}

