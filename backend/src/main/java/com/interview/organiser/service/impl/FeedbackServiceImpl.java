package com.interview.organiser.service.impl;

import com.interview.organiser.constants.AppConstants;
import com.interview.organiser.exception.ResourceNotFoundException;
import com.interview.organiser.model.dto.request.SubmitFeedbackRequest;
import com.interview.organiser.model.dto.request.UpdateFeedbackRequest;
import com.interview.organiser.model.dto.response.FeedbackResponse;
import com.interview.organiser.model.dto.response.MessageResponse;
import com.interview.organiser.model.dto.response.PageResponse;
import com.interview.organiser.model.entity.Feedback;
import com.interview.organiser.model.entity.Interview;
import com.interview.organiser.repository.FeedbackRepository;
import com.interview.organiser.repository.InterviewRepository;
import com.interview.organiser.service.FeedbackService;
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
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final InterviewRepository interviewRepository;
    private final EntityMapper entityMapper;

    @Override
    public PageResponse<FeedbackResponse> getAllFeedback(String interviewId, String candidateId,
                                                          String interviewerId, Pageable pageable) {
        log.info("Fetching all feedback with interviewId: {}, candidateId: {}, interviewerId: {}",
                interviewId, candidateId, interviewerId);

        Page<Feedback> feedbackPage;

        if (interviewId != null) {
            feedbackPage = feedbackRepository.findByInterviewIdPage(interviewId, pageable);
        } else if (candidateId != null) {
            feedbackPage = feedbackRepository.findByInterview_Candidate_Id(candidateId, pageable);
        } else if (interviewerId != null) {
            feedbackPage = feedbackRepository.findByInterview_Interviewer_Id(interviewerId, pageable);
        } else {
            feedbackPage = feedbackRepository.findAll(pageable);
        }

        List<FeedbackResponse> feedbackResponses = feedbackPage.getContent().stream()
                .map(entityMapper::toFeedbackResponse)
                .collect(Collectors.toList());

        return PageResponse.<FeedbackResponse>builder()
                .content(feedbackResponses)
                .page(feedbackPage.getNumber())
                .size(feedbackPage.getSize())
                .totalElements(feedbackPage.getTotalElements())
                .totalPages(feedbackPage.getTotalPages())
                .build();
    }

    @Override
    @Transactional
    public FeedbackResponse submitFeedback(SubmitFeedbackRequest request) {
        log.info("Submitting feedback for interview id: {}", request.getInterviewId());

        Interview interview = interviewRepository.findById(request.getInterviewId())
                .orElseThrow(() -> new ResourceNotFoundException(AppConstants.INTERVIEW_NOT_FOUND));

        Feedback feedback = Feedback.builder()
                .interview(interview)
                .rating(request.getRating())
                .technicalSkills(request.getTechnicalSkills())
                .communicationSkills(request.getCommunicationSkills())
                .problemSolving(request.getProblemSolving())
                .culturalFit(request.getCulturalFit())
                .comments(request.getComments())
                .strengths(request.getStrengths())
                .weaknesses(request.getWeaknesses())
                .recommendation(request.getRecommendation())
                .submittedAt(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Feedback savedFeedback = feedbackRepository.save(feedback);

        return entityMapper.toFeedbackResponse(savedFeedback);
    }

    @Override
    public FeedbackResponse getFeedbackById(String feedbackId) {
        log.info("Fetching feedback with id: {}", feedbackId);

        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new ResourceNotFoundException(AppConstants.FEEDBACK_NOT_FOUND));

        return entityMapper.toFeedbackResponse(feedback);
    }

    @Override
    @Transactional
    public FeedbackResponse updateFeedback(String feedbackId, UpdateFeedbackRequest request) {
        log.info("Updating feedback with id: {}", feedbackId);

        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new ResourceNotFoundException(AppConstants.FEEDBACK_NOT_FOUND));

        if (request.getRating() != null) {
            feedback.setRating(request.getRating());
        }
        if (request.getTechnicalSkills() != null) {
            feedback.setTechnicalSkills(request.getTechnicalSkills());
        }
        if (request.getCommunicationSkills() != null) {
            feedback.setCommunicationSkills(request.getCommunicationSkills());
        }
        if (request.getProblemSolving() != null) {
            feedback.setProblemSolving(request.getProblemSolving());
        }
        if (request.getCulturalFit() != null) {
            feedback.setCulturalFit(request.getCulturalFit());
        }
        if (request.getComments() != null) {
            feedback.setComments(request.getComments());
        }
        if (request.getStrengths() != null) {
            feedback.setStrengths(request.getStrengths());
        }
        if (request.getWeaknesses() != null) {
            feedback.setWeaknesses(request.getWeaknesses());
        }
        if (request.getRecommendation() != null) {
            feedback.setRecommendation(request.getRecommendation());
        }

        feedback.setUpdatedAt(LocalDateTime.now());

        Feedback updatedFeedback = feedbackRepository.save(feedback);

        return entityMapper.toFeedbackResponse(updatedFeedback);
    }

    @Override
    @Transactional
    public MessageResponse deleteFeedback(String feedbackId) {
        log.info("Deleting feedback with id: {}", feedbackId);

        if (!feedbackRepository.existsById(feedbackId)) {
            throw new ResourceNotFoundException(AppConstants.FEEDBACK_NOT_FOUND);
        }

        feedbackRepository.deleteById(feedbackId);

        return MessageResponse.builder()
                .message("Feedback deleted successfully")
                .timestamp(LocalDateTime.now())
                .build();
    }
}

