package com.interview.organiser.service.impl;

import com.interview.organiser.constants.AppConstants;
import com.interview.organiser.constants.enums.InterviewStatus;
import com.interview.organiser.exception.ResourceNotFoundException;
import com.interview.organiser.model.dto.request.*;
import com.interview.organiser.model.dto.response.InterviewResponse;
import com.interview.organiser.model.dto.response.MessageResponse;
import com.interview.organiser.model.dto.response.PageResponse;
import com.interview.organiser.model.entity.Candidate;
import com.interview.organiser.model.entity.Interview;
import com.interview.organiser.model.entity.Interviewer;
import com.interview.organiser.repository.CandidateRepository;
import com.interview.organiser.repository.InterviewRepository;
import com.interview.organiser.repository.InterviewerRepository;
import com.interview.organiser.service.InterviewService;
import com.interview.organiser.service.NotificationService;
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
public class InterviewServiceImpl implements InterviewService {

    private final InterviewRepository interviewRepository;
    private final CandidateRepository candidateRepository;
    private final InterviewerRepository interviewerRepository;
    private final NotificationService notificationService;
    private final EntityMapper entityMapper;

    @Override
    public PageResponse<InterviewResponse> getAllInterviews(InterviewStatus status, String candidateId,
                                                             String interviewerId, LocalDateTime fromDate,
                                                             LocalDateTime toDate, Pageable pageable) {
        log.info("Fetching all interviews with status: {}, candidateId: {}, interviewerId: {}",
                status, candidateId, interviewerId);

        Page<Interview> interviewPage;

        if (fromDate != null && toDate != null) {
            interviewPage = interviewRepository.findByScheduledAtBetween(fromDate, toDate, pageable);
        } else if (status != null && candidateId != null) {
            interviewPage = interviewRepository.findByCandidateIdAndStatus(candidateId, status, pageable);
        } else if (status != null && interviewerId != null) {
            interviewPage = interviewRepository.findByInterviewerIdAndStatus(interviewerId, status, pageable);
        } else if (status != null) {
            interviewPage = interviewRepository.findByStatus(status, pageable);
        } else if (candidateId != null) {
            interviewPage = interviewRepository.findByCandidateId(candidateId, pageable);
        } else if (interviewerId != null) {
            interviewPage = interviewRepository.findByInterviewerId(interviewerId, pageable);
        } else {
            interviewPage = interviewRepository.findAll(pageable);
        }

        List<InterviewResponse> interviewResponses = interviewPage.getContent().stream()
                .map(entityMapper::toInterviewResponse)
                .collect(Collectors.toList());

        return PageResponse.<InterviewResponse>builder()
                .content(interviewResponses)
                .page(interviewPage.getNumber())
                .size(interviewPage.getSize())
                .totalElements(interviewPage.getTotalElements())
                .totalPages(interviewPage.getTotalPages())
                .build();
    }

    @Override
    @Transactional
    public InterviewResponse scheduleInterview(ScheduleInterviewRequest request) {
        log.info("Scheduling interview for candidate: {} with interviewers: {}",
                request.getCandidateId(), request.getInterviewerIds());

        Candidate candidate = candidateRepository.findById(request.getCandidateId())
                .orElseThrow(() -> new ResourceNotFoundException(AppConstants.CANDIDATE_NOT_FOUND));

        List<Interviewer> interviewers = request.getInterviewerIds().stream()
                .map(interviewerId -> interviewerRepository.findById(interviewerId)
                        .orElseThrow(() -> new ResourceNotFoundException("Interviewer not found: " + interviewerId)))
                .collect(Collectors.toList());

        Interview interview = Interview.builder()
                .recruiterId(request.getRecruiterId())
                .candidate(candidate)
                .interviewers(interviewers)
                .scheduledAt(request.getScheduledAt())
                .duration(request.getDuration() != null ? request.getDuration() : AppConstants.DEFAULT_INTERVIEW_DURATION)
                .interviewType(request.getInterviewType())
                .round(request.getRound())
                .status(InterviewStatus.SCHEDULED)
                .meetingLink(request.getMeetingLink())
                .notes(request.getNotes())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Interview savedInterview = interviewRepository.save(interview);

        // Update interviewer's total interviews count for each interviewer
        interviewers.forEach(interviewer -> {
            interviewer.setTotalInterviews(interviewer.getTotalInterviews() + 1);
            interviewerRepository.save(interviewer);
        });

        return entityMapper.toInterviewResponse(savedInterview);
    }

    @Override
    public InterviewResponse getInterviewById(String interviewId) {
        log.info("Fetching interview with id: {}", interviewId);

        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException(AppConstants.INTERVIEW_NOT_FOUND));

        return entityMapper.toInterviewResponse(interview);
    }

    @Override
    @Transactional
    public InterviewResponse updateInterview(String interviewId, UpdateInterviewRequest request) {
        log.info("Updating interview with id: {}", interviewId);

        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException(AppConstants.INTERVIEW_NOT_FOUND));

        if (request.getScheduledAt() != null) {
            interview.setScheduledAt(request.getScheduledAt());
        }
        if (request.getDuration() != null) {
            interview.setDuration(request.getDuration());
        }
        if (request.getInterviewType() != null) {
            interview.setInterviewType(request.getInterviewType());
        }
        if (request.getMeetingLink() != null) {
            interview.setMeetingLink(request.getMeetingLink());
        }
        if (request.getNotes() != null) {
            interview.setNotes(request.getNotes());
        }

        interview.setUpdatedAt(LocalDateTime.now());

        Interview updatedInterview = interviewRepository.save(interview);

        return entityMapper.toInterviewResponse(updatedInterview);
    }

    @Override
    @Transactional
    public InterviewResponse updateInterviewStatus(String interviewId, UpdateInterviewStatusRequest request) {
        log.info("Updating interview status with id: {} to status: {}", interviewId, request.getStatus());

        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException(AppConstants.INTERVIEW_NOT_FOUND));

        interview.setStatus(request.getStatus());

        if (request.getReason() != null) {
            String currentNotes = interview.getNotes() != null ? interview.getNotes() : "";
            interview.setNotes(currentNotes + "\nStatus update reason: " + request.getReason());
        }

        interview.setUpdatedAt(LocalDateTime.now());

        Interview updatedInterview = interviewRepository.save(interview);

        return entityMapper.toInterviewResponse(updatedInterview);
    }

    @Override
    @Transactional
    public MessageResponse cancelInterview(String interviewId) {
        log.info("Cancelling interview with id: {}", interviewId);

        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException(AppConstants.INTERVIEW_NOT_FOUND));

        interview.setStatus(InterviewStatus.CANCELLED);
        interview.setUpdatedAt(LocalDateTime.now());
        interviewRepository.save(interview);

        // Notify all parties about cancellation
        notificationService.notifyInterviewCancelled(interview, "Interview cancelled");

        return MessageResponse.builder()
                .message("Interview cancelled successfully")
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Override
    @Transactional
    public InterviewResponse confirmInterview(String interviewId, ConfirmInterviewRequest request) {
        log.info("Confirming interview with id: {}", interviewId);

        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException(AppConstants.INTERVIEW_NOT_FOUND));

        interview.setCandidateConfirmed(request.getConfirmed());
        interview.setCandidateConfirmedAt(LocalDateTime.now());

        if (request.getNotes() != null) {
            String currentNotes = interview.getNotes() != null ? interview.getNotes() : "";
            interview.setNotes(currentNotes + "\nCandidate confirmation notes: " + request.getNotes());
        }

        interview.setUpdatedAt(LocalDateTime.now());
        Interview updatedInterview = interviewRepository.save(interview);

        // Notify all parties about confirmation
        if (Boolean.TRUE.equals(request.getConfirmed())) {
            notificationService.notifyInterviewConfirmed(interview);
        }

        return entityMapper.toInterviewResponse(updatedInterview);
    }

    @Override
    @Transactional
    public InterviewResponse markInterviewResult(String interviewId, MarkInterviewResultRequest request) {
        log.info("Marking interview result for id: {} as {}", interviewId, request.getResult());

        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException(AppConstants.INTERVIEW_NOT_FOUND));

        // Parse result string to enum
        com.interview.organiser.constants.enums.InterviewResult result;
        try {
            result = com.interview.organiser.constants.enums.InterviewResult.valueOf(request.getResult());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid result. Must be SELECTED, REJECTED, or NEXT_ROUND");
        }

        interview.setResult(result);
        interview.setStatus(InterviewStatus.COMPLETED);

        if (request.getComments() != null) {
            String currentNotes = interview.getNotes() != null ? interview.getNotes() : "";
            interview.setNotes(currentNotes + "\nResult comments: " + request.getComments());
        }

        interview.setUpdatedAt(LocalDateTime.now());
        Interview updatedInterview = interviewRepository.save(interview);

        // Notify candidate about result
        notificationService.notifyCandidateResult(interview.getCandidate(), interview, request.getResult());

        return entityMapper.toInterviewResponse(updatedInterview);
    }

    @Override
    @Transactional
    public InterviewResponse createNextRoundInterview(String interviewId, CreateNextRoundInterviewRequest request) {
        log.info("Creating next round interview for interview id: {}", interviewId);

        Interview previousInterview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException(AppConstants.INTERVIEW_NOT_FOUND));

        // Get interviewers for next round
        List<Interviewer> interviewers = request.getInterviewerIds().stream()
                .map(interviewerId -> interviewerRepository.findById(interviewerId)
                        .orElseThrow(() -> new ResourceNotFoundException("Interviewer not found: " + interviewerId)))
                .collect(Collectors.toList());

        // Create next round interview
        Interview nextRoundInterview = Interview.builder()
                .recruiterId(previousInterview.getRecruiterId())
                .candidate(previousInterview.getCandidate())
                .interviewers(interviewers)
                .scheduledAt(request.getScheduledAt())
                .duration(request.getDuration() != null ? request.getDuration() : AppConstants.DEFAULT_INTERVIEW_DURATION)
                .interviewType(request.getInterviewType())
                .round(previousInterview.getRound() + 1)
                .status(InterviewStatus.SCHEDULED)
                .meetingLink(request.getMeetingLink())
                .location(request.getLocation())
                .notes(request.getNotes())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Interview savedNextRound = interviewRepository.save(nextRoundInterview);

        // Update previous interview with next round reference
        previousInterview.setNextRoundInterviewId(savedNextRound.getId());
        interviewRepository.save(previousInterview);

        // Notify candidate about next round
        notificationService.notifyNextRoundScheduled(previousInterview.getCandidate(), savedNextRound);

        // Notify assigned interviewers
        interviewers.forEach(interviewer ->
            notificationService.notifyInterviewerAssigned(interviewer, savedNextRound)
        );

        return entityMapper.toInterviewResponse(savedNextRound);
    }

    @Override
    @Transactional
    public MessageResponse requestFeedback(String interviewId) {
        log.info("Requesting feedback for interview id: {}", interviewId);

        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException(AppConstants.INTERVIEW_NOT_FOUND));

        interview.setFeedbackRequested(true);
        interview.setFeedbackRequestedAt(LocalDateTime.now());
        interviewRepository.save(interview);

        // Send feedback requests to all interviewers
        interview.getInterviewers().forEach(interviewer ->
            notificationService.requestFeedback(interviewer, interview)
        );

        // Send feedback request to candidate (optional)
        notificationService.requestCandidateFeedback(interview.getCandidate(), interview);

        return MessageResponse.builder()
                .message("Feedback requests sent successfully")
                .timestamp(LocalDateTime.now())
                .build();
    }
}

