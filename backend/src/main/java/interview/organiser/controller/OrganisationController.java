package interview.organiser.controller;

import interview.organiser.model.dto.request.OrganisationRegistrationRequest;
import interview.organiser.model.dto.request.OrganisationResubmissionRequest;
import interview.organiser.model.dto.request.OrganisationUpdateRequest;
import interview.organiser.model.dto.request.OrganisationVerificationRequest;
import interview.organiser.model.dto.response.MessageResponse;
import interview.organiser.model.dto.response.OrganisationResponse;
import interview.organiser.model.dto.response.VerificationHistoryResponse;
import interview.organiser.service.OrganisationService;
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
 * REST Controller for organisation operations
 */
@Slf4j
@RestController
@RequestMapping("/organisations")
@RequiredArgsConstructor
public class OrganisationController {

    private final OrganisationService organisationService;

    /**
     * Register a new organisation
     */
    @PostMapping("/register")
    public ResponseEntity<OrganisationResponse> registerOrganisation(
            @Valid @RequestBody OrganisationRegistrationRequest request) {
        log.info("Organisation registration request received: {}", request.getOrganisationName());
        OrganisationResponse response = organisationService.registerOrganisation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get organisation by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrganisationResponse> getOrganisationById(@PathVariable String id) {
        log.info("Get organisation by ID request received: {}", id);
        OrganisationResponse response = organisationService.getOrganisationById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Update organisation
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANISATION_ADMIN')")
    public ResponseEntity<OrganisationResponse> updateOrganisation(
            @PathVariable String id,
            @Valid @RequestBody OrganisationUpdateRequest request) {
        log.info("Update organisation request received for ID: {}", id);
        OrganisationResponse response = organisationService.updateOrganisation(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete organisation (ADMIN only)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteOrganisation(@PathVariable String id) {
        log.info("Delete organisation request received for ID: {}", id);
        MessageResponse response = organisationService.deleteOrganisation(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Verify organisation (ADMIN only)
     */
    @PutMapping("/{id}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrganisationResponse> verifyOrganisation(
            @PathVariable String id,
            @Valid @RequestBody OrganisationVerificationRequest request) {
        log.info("Verify organisation request received for ID: {}", id);
        OrganisationResponse response = organisationService.verifyOrganisation(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all organisations with pagination
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<OrganisationResponse>> getAllOrganisations(
            @PageableDefault(size = 5, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Get all organisations request received");
        Page<OrganisationResponse> response = organisationService.getAllOrganisations(pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Get organisations by verification status
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<OrganisationResponse>> getOrganisationsByStatus(
            @PathVariable String status,
            @PageableDefault(size = 5, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Get organisations by status request received: {}", status);
        Page<OrganisationResponse> response = organisationService.getOrganisationsByStatus(status, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Resubmit organisation for verification
     */
    @PostMapping("/{id}/resubmit")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANISATION_ADMIN')")
    public ResponseEntity<OrganisationResponse> resubmitOrganisation(
            @PathVariable String id,
            @Valid @RequestBody OrganisationResubmissionRequest request) {
        log.info("Resubmit organisation request received for ID: {}", id);
        OrganisationResponse response = organisationService.resubmitOrganisation(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get organisation verification history
     */
    @GetMapping("/{id}/verification-history")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANISATION_ADMIN')")
    public ResponseEntity<List<VerificationHistoryResponse>> getVerificationHistory(@PathVariable String id) {
        log.info("Get verification history request received for organisation: {}", id);
        List<VerificationHistoryResponse> response = organisationService.getVerificationHistory(id);
        return ResponseEntity.ok(response);
    }
}
