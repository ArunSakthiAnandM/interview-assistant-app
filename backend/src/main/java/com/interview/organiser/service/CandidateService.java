package com.interview.organiser.service;

import com.interview.organiser.constants.enums.CandidateStatus;
import com.interview.organiser.model.dto.request.CreateCandidateRequest;
import com.interview.organiser.model.dto.request.UpdateCandidateRequest;
import com.interview.organiser.model.dto.response.CandidateResponse;
import com.interview.organiser.model.dto.response.MessageResponse;
import com.interview.organiser.model.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface CandidateService {

    PageResponse<CandidateResponse> getAllCandidates(CandidateStatus status, String search, Pageable pageable);

    CandidateResponse createCandidate(CreateCandidateRequest request);

    CandidateResponse getCandidateById(String candidateId);

    CandidateResponse updateCandidate(String candidateId, UpdateCandidateRequest request);

    MessageResponse deleteCandidate(String candidateId);
}

