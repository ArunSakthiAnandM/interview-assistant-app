package com.interview.organiser.controller;

import com.interview.organiser.constants.enums.VerificationStatus;
import com.interview.organiser.model.dto.request.CreateOrganisationRequest;
import com.interview.organiser.model.dto.request.UpdateOrganisationRequest;
import com.interview.organiser.model.dto.response.MessageResponse;
import com.interview.organiser.model.dto.response.OrganisationResponse;
import com.interview.organiser.model.dto.response.PageResponse;
import com.interview.organiser.service.OrganisationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/organisations")
@RequiredArgsConstructor
public class OrganisationController {

    private final OrganisationService organisationService;

    @GetMapping
    public ResponseEntity<PageResponse<OrganisationResponse>> getAllOrganisations(
            @RequestParam(required = false) VerificationStatus status,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(organisationService.getAllOrganisations(status, isActive, pageable));
    }

    @PostMapping
    public ResponseEntity<OrganisationResponse> createOrganisation(@Valid @RequestBody CreateOrganisationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(organisationService.createOrganisation(request));
    }

    @GetMapping("/{organisationId}")
    public ResponseEntity<OrganisationResponse> getOrganisationById(@PathVariable String organisationId) {
        return ResponseEntity.ok(organisationService.getOrganisationById(organisationId));
    }

    @PutMapping("/{organisationId}")
    public ResponseEntity<OrganisationResponse> updateOrganisation(
            @PathVariable String organisationId,
            @Valid @RequestBody UpdateOrganisationRequest request) {
        return ResponseEntity.ok(organisationService.updateOrganisation(organisationId, request));
    }

    @PutMapping("/{organisationId}/verify")
    public ResponseEntity<OrganisationResponse> verifyOrganisation(@PathVariable String organisationId) {
        return ResponseEntity.ok(organisationService.verifyOrganisation(organisationId));
    }

    @PutMapping("/{organisationId}/reject")
    public ResponseEntity<OrganisationResponse> rejectOrganisation(
            @PathVariable String organisationId,
            @RequestParam String reason) {
        return ResponseEntity.ok(organisationService.rejectOrganisation(organisationId, reason));
    }

    @DeleteMapping("/{organisationId}")
    public ResponseEntity<MessageResponse> deleteOrganisation(@PathVariable String organisationId) {
        return ResponseEntity.ok(organisationService.deleteOrganisation(organisationId));
    }
}
