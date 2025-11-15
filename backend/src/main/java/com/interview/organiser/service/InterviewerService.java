package com.interview.organiser.service;

import com.interview.organiser.model.dto.request.InterviewerRegistrationRequest;
import com.interview.organiser.model.dto.request.CreateInterviewerRequest;
import com.interview.organiser.model.dto.request.InviteInterviewerRequest;
import com.interview.organiser.model.dto.request.UpdateInterviewerRequest;
import com.interview.organiser.model.dto.response.AuthResponse;
import com.interview.organiser.model.dto.response.InterviewerResponse;
import com.interview.organiser.model.dto.response.MessageResponse;
import com.interview.organiser.model.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface InterviewerService {

    PageResponse<InterviewerResponse> getAllInterviewers(String expertise, Boolean available, Pageable pageable);

    InterviewerResponse createInterviewer(CreateInterviewerRequest request);

    MessageResponse inviteInterviewer(InviteInterviewerRequest request);

    AuthResponse completeInterviewerRegistration(InterviewerRegistrationRequest request);

    InterviewerResponse getInterviewerById(String interviewerId);

    InterviewerResponse updateInterviewer(String interviewerId, UpdateInterviewerRequest request);

    MessageResponse deleteInterviewer(String interviewerId);
}

