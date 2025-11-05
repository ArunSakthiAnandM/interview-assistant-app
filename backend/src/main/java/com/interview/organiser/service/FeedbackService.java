package com.interview.organiser.service;

import com.interview.organiser.model.dto.request.SubmitFeedbackRequest;
import com.interview.organiser.model.dto.request.UpdateFeedbackRequest;
import com.interview.organiser.model.dto.response.FeedbackResponse;
import com.interview.organiser.model.dto.response.MessageResponse;
import com.interview.organiser.model.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface FeedbackService {

    PageResponse<FeedbackResponse> getAllFeedback(String interviewId, String candidateId, String interviewerId, Pageable pageable);

    FeedbackResponse submitFeedback(SubmitFeedbackRequest request);

    FeedbackResponse getFeedbackById(String feedbackId);

    FeedbackResponse updateFeedback(String feedbackId, UpdateFeedbackRequest request);

    MessageResponse deleteFeedback(String feedbackId);
}

