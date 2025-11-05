package com.interview.organiser.service.impl;

import com.interview.organiser.constants.AppConstants;
import com.interview.organiser.constants.enums.CandidateStatus;
import com.interview.organiser.exception.ResourceAlreadyExistsException;
import com.interview.organiser.exception.ResourceNotFoundException;
import com.interview.organiser.model.dto.request.CreateCandidateRequest;
import com.interview.organiser.model.dto.request.UpdateCandidateRequest;
import com.interview.organiser.model.dto.response.CandidateResponse;
import com.interview.organiser.model.dto.response.MessageResponse;
import com.interview.organiser.model.dto.response.PageResponse;
import com.interview.organiser.model.entity.Candidate;
import com.interview.organiser.repository.CandidateRepository;
import com.interview.organiser.service.CandidateService;
import com.interview.organiser.util.EntityMapper;
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
public class CandidateServiceImpl implements CandidateService {

    private final CandidateRepository candidateRepository;
    private final EntityMapper entityMapper;

    @Override
    public PageResponse<CandidateResponse> getAllCandidates(CandidateStatus status, String search, Pageable pageable) {
        log.info("Fetching all candidates with status: {}, search: {}", status, search);

        Page<Candidate> candidatePage;

        if (status != null && search != null && !search.isEmpty()) {
            candidatePage = candidateRepository.searchCandidatesByStatus(status, search, pageable);
        } else if (status != null) {
            candidatePage = candidateRepository.findByStatus(status, pageable);
        } else if (search != null && !search.isEmpty()) {
            candidatePage = candidateRepository.searchCandidates(search, pageable);
        } else {
            candidatePage = candidateRepository.findAll(pageable);
        }

        List<CandidateResponse> candidateResponses = candidatePage.getContent().stream()
                .map(entityMapper::toCandidateResponse)
                .collect(Collectors.toList());

        return PageResponse.<CandidateResponse>builder()
                .content(candidateResponses)
                .page(candidatePage.getNumber())
                .size(candidatePage.getSize())
                .totalElements(candidatePage.getTotalElements())
                .totalPages(candidatePage.getTotalPages())
                .build();
    }

    @Override
    @Transactional
    public CandidateResponse createCandidate(CreateCandidateRequest request) {
        log.info("Creating candidate with email: {}", request.getEmail());

        if (candidateRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Candidate", "email", request.getEmail());
        }

        Candidate candidate = Candidate.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .position(request.getPosition())
                .experience(request.getExperience())
                .skills(request.getSkills())
                .resumeUrl(request.getResumeUrl())
                .linkedinUrl(request.getLinkedinUrl())
                .githubUrl(request.getGithubUrl())
                .status(request.getStatus() != null ? request.getStatus() : CandidateStatus.APPLIED)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Candidate savedCandidate = candidateRepository.save(candidate);

        return entityMapper.toCandidateResponse(savedCandidate);
    }

    @Override
    public CandidateResponse getCandidateById(String candidateId) {
        log.info("Fetching candidate with id: {}", candidateId);

        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException(AppConstants.CANDIDATE_NOT_FOUND));

        return entityMapper.toCandidateResponse(candidate);
    }

    @Override
    @Transactional
    public CandidateResponse updateCandidate(String candidateId, UpdateCandidateRequest request) {
        log.info("Updating candidate with id: {}", candidateId);

        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException(AppConstants.CANDIDATE_NOT_FOUND));

        if (request.getFirstName() != null) {
            candidate.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            candidate.setLastName(request.getLastName());
        }
        if (request.getEmail() != null) {
            candidate.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            candidate.setPhone(request.getPhone());
        }
        if (request.getPosition() != null) {
            candidate.setPosition(request.getPosition());
        }
        if (request.getExperience() != null) {
            candidate.setExperience(request.getExperience());
        }
        if (request.getSkills() != null) {
            candidate.setSkills(request.getSkills());
        }
        if (request.getResumeUrl() != null) {
            candidate.setResumeUrl(request.getResumeUrl());
        }
        if (request.getLinkedinUrl() != null) {
            candidate.setLinkedinUrl(request.getLinkedinUrl());
        }
        if (request.getGithubUrl() != null) {
            candidate.setGithubUrl(request.getGithubUrl());
        }
        if (request.getStatus() != null) {
            candidate.setStatus(request.getStatus());
        }

        candidate.setUpdatedAt(LocalDateTime.now());

        Candidate updatedCandidate = candidateRepository.save(candidate);

        return entityMapper.toCandidateResponse(updatedCandidate);
    }

    @Override
    @Transactional
    public MessageResponse deleteCandidate(String candidateId) {
        log.info("Deleting candidate with id: {}", candidateId);

        if (!candidateRepository.existsById(candidateId)) {
            throw new ResourceNotFoundException(AppConstants.CANDIDATE_NOT_FOUND);
        }

        candidateRepository.deleteById(candidateId);

        return MessageResponse.builder()
                .message("Candidate deleted successfully")
                .timestamp(LocalDateTime.now())
                .build();
    }
}

