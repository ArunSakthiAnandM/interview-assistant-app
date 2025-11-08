package com.interview.organiser.service.impl;

import com.interview.organiser.constants.enums.VerificationStatus;
import com.interview.organiser.exception.ResourceNotFoundException;
import com.interview.organiser.model.dto.request.CreateOrganisationRequest;
import com.interview.organiser.model.dto.request.UpdateOrganisationRequest;
import com.interview.organiser.model.dto.response.MessageResponse;
import com.interview.organiser.model.dto.response.OrganisationResponse;
import com.interview.organiser.model.dto.response.PageResponse;
import com.interview.organiser.model.entity.Organisation;
import com.interview.organiser.repository.OrganisationRepository;
import com.interview.organiser.service.OrganisationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrganisationServiceImpl implements OrganisationService {

    private final OrganisationRepository organisationRepository;

    @Override
    @Transactional
    public OrganisationResponse createOrganisation(CreateOrganisationRequest request) {
        log.info("Creating organisation: {}", request.getName());

        Organisation organisation = Organisation.builder()
                .name(request.getName())
                .registrationNumber(request.getRegistrationNumber())
                .address(request.getAddress() != null ? request.getAddress().toEntity() : null)
                .contactEmail(request.getContactEmail())
                .contactPhone(request.getContactPhone())
                .website(request.getWebsite())
                .description(request.getDescription())
                .verificationStatus(VerificationStatus.PENDING)
                .isActive(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Organisation savedOrganisation = organisationRepository.save(organisation);

        return toOrganisationResponse(savedOrganisation);
    }

    @Override
    public OrganisationResponse getOrganisationById(String organisationId) {
        log.info("Fetching organisation with id: {}", organisationId);

        Organisation organisation = organisationRepository.findById(organisationId)
                .orElseThrow(() -> new ResourceNotFoundException("Organisation not found"));

        return toOrganisationResponse(organisation);
    }

    @Override
    public PageResponse<OrganisationResponse> getAllOrganisations(VerificationStatus status, Boolean isActive, Pageable pageable) {
        log.info("Fetching all organisations with status: {}, isActive: {}", status, isActive);

        Page<Organisation> organisationPage;

        if (status != null && isActive != null) {
            organisationPage = organisationRepository.findByVerificationStatus(status, pageable);
        } else if (status != null) {
            organisationPage = organisationRepository.findByVerificationStatus(status, pageable);
        } else if (isActive != null) {
            organisationPage = organisationRepository.findByIsActive(isActive, pageable);
        } else {
            organisationPage = organisationRepository.findAll(pageable);
        }

        List<OrganisationResponse> organisations = organisationPage.getContent().stream()
                .map(this::toOrganisationResponse)
                .collect(Collectors.toList());

        return PageResponse.<OrganisationResponse>builder()
                .content(organisations)
                .page(organisationPage.getNumber())
                .size(organisationPage.getSize())
                .totalElements(organisationPage.getTotalElements())
                .totalPages(organisationPage.getTotalPages())
                .build();
    }

    @Override
    @Transactional
    public OrganisationResponse updateOrganisation(String organisationId, UpdateOrganisationRequest request) {
        log.info("Updating organisation with id: {}", organisationId);

        Organisation organisation = organisationRepository.findById(organisationId)
                .orElseThrow(() -> new ResourceNotFoundException("Organisation not found"));

        if (request.getName() != null) {
            organisation.setName(request.getName());
        }
        if (request.getContactEmail() != null) {
            organisation.setContactEmail(request.getContactEmail());
        }
        if (request.getContactPhone() != null) {
            organisation.setContactPhone(request.getContactPhone());
        }
        if (request.getWebsite() != null) {
            organisation.setWebsite(request.getWebsite());
        }
        if (request.getDescription() != null) {
            organisation.setDescription(request.getDescription());
        }

        organisation.setUpdatedAt(LocalDateTime.now());

        Organisation updatedOrganisation = organisationRepository.save(organisation);

        return toOrganisationResponse(updatedOrganisation);
    }

    @Override
    @Transactional
    public OrganisationResponse verifyOrganisation(String organisationId) {
        log.info("Verifying organisation with id: {}", organisationId);

        Organisation organisation = organisationRepository.findById(organisationId)
                .orElseThrow(() -> new ResourceNotFoundException("Organisation not found"));

        organisation.setVerificationStatus(VerificationStatus.VERIFIED);
        organisation.setIsActive(true);
        organisation.setUpdatedAt(LocalDateTime.now());

        Organisation verifiedOrganisation = organisationRepository.save(organisation);

        return toOrganisationResponse(verifiedOrganisation);
    }

    @Override
    @Transactional
    public OrganisationResponse rejectOrganisation(String organisationId, String reason) {
        log.info("Rejecting organisation with id: {}, reason: {}", organisationId, reason);

        Organisation organisation = organisationRepository.findById(organisationId)
                .orElseThrow(() -> new ResourceNotFoundException("Organisation not found"));

        organisation.setVerificationStatus(VerificationStatus.REJECTED);
        organisation.setIsActive(false);
        organisation.setUpdatedAt(LocalDateTime.now());

        Organisation rejectedOrganisation = organisationRepository.save(organisation);

        return toOrganisationResponse(rejectedOrganisation);
    }

    @Override
    @Transactional
    public MessageResponse deleteOrganisation(String organisationId) {
        log.info("Deleting organisation with id: {}", organisationId);

        Organisation organisation = organisationRepository.findById(organisationId)
                .orElseThrow(() -> new ResourceNotFoundException("Organisation not found"));

        organisationRepository.delete(organisation);

        return MessageResponse.builder()
                .message("Organisation deleted successfully")
                .timestamp(LocalDateTime.now())
                .build();
    }

    private OrganisationResponse toOrganisationResponse(Organisation organisation) {
        OrganisationResponse.AddressDTO addressDTO = null;
        if (organisation.getAddress() != null) {
            Organisation.Address address = organisation.getAddress();
            addressDTO = OrganisationResponse.AddressDTO.builder()
                    .street(address.getStreet())
                    .city(address.getCity())
                    .state(address.getState())
                    .country(address.getCountry())
                    .postalCode(address.getPostalCode())
                    .build();
        }

        return OrganisationResponse.builder()
                .id(organisation.getId())
                .name(organisation.getName())
                .registrationNumber(organisation.getRegistrationNumber())
                .address(addressDTO)
                .contactEmail(organisation.getContactEmail())
                .contactPhone(organisation.getContactPhone())
                .website(organisation.getWebsite())
                .description(organisation.getDescription())
                .verificationStatus(organisation.getVerificationStatus())
                .adminUserId(organisation.getAdminUserId())
                .isActive(organisation.getIsActive())
                .createdAt(organisation.getCreatedAt())
                .updatedAt(organisation.getUpdatedAt())
                .build();
    }
}
