package com.interview.organiser.service;

import com.interview.organiser.constants.enums.VerificationStatus;
import com.interview.organiser.model.dto.request.CreateOrganisationRequest;
import com.interview.organiser.model.dto.request.UpdateOrganisationRequest;
import com.interview.organiser.model.dto.response.MessageResponse;
import com.interview.organiser.model.dto.response.OrganisationResponse;
import com.interview.organiser.model.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface OrganisationService {

    OrganisationResponse createOrganisation(CreateOrganisationRequest request);

    OrganisationResponse getOrganisationById(String organisationId);

    PageResponse<OrganisationResponse> getAllOrganisations(VerificationStatus status, Boolean isActive, Pageable pageable);

    OrganisationResponse updateOrganisation(String organisationId, UpdateOrganisationRequest request);

    OrganisationResponse verifyOrganisation(String organisationId);

    OrganisationResponse rejectOrganisation(String organisationId, String reason);

    MessageResponse deleteOrganisation(String organisationId);
}
