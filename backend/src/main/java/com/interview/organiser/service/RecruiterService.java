package com.interview.organiser.service;

import com.interview.organiser.constants.enums.VerificationStatus;
import com.interview.organiser.model.dto.request.CreateRecruiterRequest;
import com.interview.organiser.model.dto.request.UpdateRecruiterRequest;
import com.interview.organiser.model.dto.response.MessageResponse;
import com.interview.organiser.model.dto.response.RecruiterResponse;
import com.interview.organiser.model.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface RecruiterService {

    RecruiterResponse createRecruiter(CreateRecruiterRequest request);

    RecruiterResponse getRecruiterById(String recruiterId);

    PageResponse<RecruiterResponse> getAllRecruiters(VerificationStatus status, Boolean isActive, Pageable pageable);

    RecruiterResponse updateRecruiter(String recruiterId, UpdateRecruiterRequest request);

    RecruiterResponse verifyRecruiter(String recruiterId);

    RecruiterResponse rejectRecruiter(String recruiterId, String reason);

    MessageResponse deleteRecruiter(String recruiterId);
}
