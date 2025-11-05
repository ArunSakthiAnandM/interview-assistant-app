package com.interview.organiser.service;

import com.interview.organiser.constants.enums.InterviewStatus;
import com.interview.organiser.model.dto.request.ScheduleInterviewRequest;
import com.interview.organiser.model.dto.request.UpdateInterviewRequest;
import com.interview.organiser.model.dto.request.UpdateInterviewStatusRequest;
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

    MessageResponse cancelInterview(String interviewId);
}

