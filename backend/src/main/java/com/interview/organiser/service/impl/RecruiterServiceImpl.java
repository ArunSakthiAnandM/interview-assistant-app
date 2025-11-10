package com.interview.organiser.service.impl;

import com.interview.organiser.constants.enums.VerificationStatus;
import com.interview.organiser.exception.ResourceNotFoundException;
import com.interview.organiser.model.dto.request.CreateRecruiterRequest;
import com.interview.organiser.model.dto.request.UpdateRecruiterRequest;
import com.interview.organiser.model.dto.response.MessageResponse;
import com.interview.organiser.model.dto.response.RecruiterResponse;
import com.interview.organiser.model.dto.response.PageResponse;
import com.interview.organiser.model.entity.Recruiter;
import com.interview.organiser.repository.RecruiterRepository;
import com.interview.organiser.service.RecruiterService;
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
public class RecruiterServiceImpl implements RecruiterService {

    private final RecruiterRepository recruiterRepository;

    @Override
    @Transactional
    public RecruiterResponse createRecruiter(CreateRecruiterRequest request) {
        log.info("Creating recruiter: {}", request.getName());

        Recruiter recruiter = Recruiter.builder()
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

        Recruiter savedRecruiter = recruiterRepository.save(recruiter);

        return toRecruiterResponse(savedRecruiter);
    }

    @Override
    public RecruiterResponse getRecruiterById(String recruiterId) {
        log.info("Fetching recruiter with id: {}", recruiterId);

        Recruiter recruiter = recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        return toRecruiterResponse(recruiter);
    }

    @Override
    public PageResponse<RecruiterResponse> getAllRecruiters(VerificationStatus status, Boolean isActive, Pageable pageable) {
        log.info("Fetching all recruiters with status: {}, isActive: {}", status, isActive);

        Page<Recruiter> recruiterPage;

        if (status != null && isActive != null) {
            recruiterPage = recruiterRepository.findByVerificationStatus(status, pageable);
        } else if (status != null) {
            recruiterPage = recruiterRepository.findByVerificationStatus(status, pageable);
        } else if (isActive != null) {
            recruiterPage = recruiterRepository.findByIsActive(isActive, pageable);
        } else {
            recruiterPage = recruiterRepository.findAll(pageable);
        }

        List<RecruiterResponse> recruiters = recruiterPage.getContent().stream()
                .map(this::toRecruiterResponse)
                .collect(Collectors.toList());

        return PageResponse.<RecruiterResponse>builder()
                .content(recruiters)
                .page(recruiterPage.getNumber())
                .size(recruiterPage.getSize())
                .totalElements(recruiterPage.getTotalElements())
                .totalPages(recruiterPage.getTotalPages())
                .build();
    }

    @Override
    @Transactional
    public RecruiterResponse updateRecruiter(String recruiterId, UpdateRecruiterRequest request) {
        log.info("Updating recruiter with id: {}", recruiterId);

        Recruiter recruiter = recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        if (request.getName() != null) {
            recruiter.setName(request.getName());
        }
        if (request.getContactEmail() != null) {
            recruiter.setContactEmail(request.getContactEmail());
        }
        if (request.getContactPhone() != null) {
            recruiter.setContactPhone(request.getContactPhone());
        }
        if (request.getWebsite() != null) {
            recruiter.setWebsite(request.getWebsite());
        }
        if (request.getDescription() != null) {
            recruiter.setDescription(request.getDescription());
        }

        recruiter.setUpdatedAt(LocalDateTime.now());

        Recruiter updatedRecruiter = recruiterRepository.save(recruiter);

        return toRecruiterResponse(updatedRecruiter);
    }

    @Override
    @Transactional
    public RecruiterResponse verifyRecruiter(String recruiterId) {
        log.info("Verifying recruiter with id: {}", recruiterId);

        Recruiter recruiter = recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        recruiter.setVerificationStatus(VerificationStatus.VERIFIED);
        recruiter.setIsActive(true);
        recruiter.setUpdatedAt(LocalDateTime.now());

        Recruiter verifiedRecruiter = recruiterRepository.save(recruiter);

        return toRecruiterResponse(verifiedRecruiter);
    }

    @Override
    @Transactional
    public RecruiterResponse rejectRecruiter(String recruiterId, String reason) {
        log.info("Rejecting recruiter with id: {}, reason: {}", recruiterId, reason);

        Recruiter recruiter = recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        recruiter.setVerificationStatus(VerificationStatus.REJECTED);
        recruiter.setIsActive(false);
        recruiter.setUpdatedAt(LocalDateTime.now());

        Recruiter rejectedRecruiter = recruiterRepository.save(recruiter);

        return toRecruiterResponse(rejectedRecruiter);
    }

    @Override
    @Transactional
    public MessageResponse deleteRecruiter(String recruiterId) {
        log.info("Deleting recruiter with id: {}", recruiterId);

        Recruiter recruiter = recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        recruiterRepository.delete(recruiter);

        return MessageResponse.builder()
                .message("Recruiter deleted successfully")
                .timestamp(LocalDateTime.now())
                .build();
    }

    private RecruiterResponse toRecruiterResponse(Recruiter recruiter) {
        RecruiterResponse.AddressDTO addressDTO = null;
        if (recruiter.getAddress() != null) {
            Recruiter.Address address = recruiter.getAddress();
            addressDTO = RecruiterResponse.AddressDTO.builder()
                    .street(address.getStreet())
                    .city(address.getCity())
                    .state(address.getState())
                    .country(address.getCountry())
                    .postalCode(address.getPostalCode())
                    .build();
        }

        return RecruiterResponse.builder()
                .id(recruiter.getId())
                .name(recruiter.getName())
                .registrationNumber(recruiter.getRegistrationNumber())
                .address(addressDTO)
                .contactEmail(recruiter.getContactEmail())
                .contactPhone(recruiter.getContactPhone())
                .website(recruiter.getWebsite())
                .description(recruiter.getDescription())
                .verificationStatus(recruiter.getVerificationStatus())
                .adminUserId(recruiter.getAdminUserId())
                .isActive(recruiter.getIsActive())
                .createdAt(recruiter.getCreatedAt())
                .updatedAt(recruiter.getUpdatedAt())
                .build();
    }
}
