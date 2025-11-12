package com.interview.organiser.service;

import com.interview.organiser.constants.enums.InterviewStatus;
import com.interview.organiser.model.dto.request.*;
import com.interview.organiser.model.dto.response.InterviewResponse;
import com.interview.organiser.model.dto.response.MessageResponse;
import com.interview.organiser.model.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

public interface InterviewService {

    PageResponse<InterviewResponse> getAllInterviews(InterviewStatus status, String candidateId, String interviewerId,
                                                       LocalDateTime fromDate, LocalDateTime toDate, Pageable pageable);

    InterviewResponse scheduleInterview(ScheduleInterviewRequest request);

    InterviewResponse getInterviewById(String interviewId);

    InterviewResponse updateInterview(String interviewId, UpdateInterviewRequest request);

    InterviewResponse updateInterviewStatus(String interviewId, UpdateInterviewStatusRequest request);

    InterviewResponse confirmInterview(String interviewId, ConfirmInterviewRequest request);

    InterviewResponse markInterviewResult(String interviewId, MarkInterviewResultRequest request);

    InterviewResponse createNextRoundInterview(String interviewId, CreateNextRoundInterviewRequest request);

    MessageResponse requestFeedback(String interviewId);

    MessageResponse cancelInterview(String interviewId);
}

