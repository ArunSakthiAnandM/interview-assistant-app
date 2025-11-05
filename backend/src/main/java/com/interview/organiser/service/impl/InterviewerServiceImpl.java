package com.interview.organiser.service.impl;

import com.interview.organiser.constants.AppConstants;
import com.interview.organiser.exception.ResourceNotFoundException;
import com.interview.organiser.model.dto.request.CreateInterviewerRequest;
import com.interview.organiser.model.dto.request.UpdateInterviewerRequest;
import com.interview.organiser.model.dto.response.InterviewerResponse;
import com.interview.organiser.model.dto.response.MessageResponse;
import com.interview.organiser.model.dto.response.PageResponse;
import com.interview.organiser.model.entity.Interviewer;
import com.interview.organiser.repository.InterviewerRepository;
import com.interview.organiser.repository.UserRepository;
import com.interview.organiser.service.InterviewerService;
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
public class InterviewerServiceImpl implements InterviewerService {

    private final InterviewerRepository interviewerRepository;
    private final UserRepository userRepository;
    private final EntityMapper entityMapper;

    @Override
    public PageResponse<InterviewerResponse> getAllInterviewers(String expertise, Boolean available, Pageable pageable) {
        log.info("Fetching all interviewers with expertise: {}, available: {}", expertise, available);

        Page<Interviewer> interviewerPage;

        if (expertise != null && available != null) {
            interviewerPage = interviewerRepository.findByExpertiseAndAvailability(expertise, available, pageable);
        } else if (expertise != null) {
            interviewerPage = interviewerRepository.findByExpertise(expertise, pageable);
        } else if (available != null) {
            interviewerPage = interviewerRepository.findByAvailability(available, pageable);
        } else {
            interviewerPage = interviewerRepository.findAll(pageable);
        }

        List<InterviewerResponse> interviewerResponses = interviewerPage.getContent().stream()
                .map(entityMapper::toInterviewerResponse)
                .collect(Collectors.toList());

        return PageResponse.<InterviewerResponse>builder()
                .content(interviewerResponses)
                .page(interviewerPage.getNumber())
                .size(interviewerPage.getSize())
                .totalElements(interviewerPage.getTotalElements())
                .totalPages(interviewerPage.getTotalPages())
                .build();
    }

    @Override
    @Transactional
    public InterviewerResponse createInterviewer(CreateInterviewerRequest request) {
        log.info("Creating interviewer for user id: {}", request.getUserId());

        com.interview.organiser.model.entity.User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException(AppConstants.USER_NOT_FOUND));

        Interviewer interviewer = Interviewer.builder()
                .user(user)
                .department(request.getDepartment())
                .expertise(request.getExpertise())
                .yearsOfExperience(request.getYearsOfExperience())
                .availability(request.getAvailability() != null ? request.getAvailability() : true)
                .totalInterviews(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Interviewer savedInterviewer = interviewerRepository.save(interviewer);

        return entityMapper.toInterviewerResponse(savedInterviewer);
    }

    @Override
    public InterviewerResponse getInterviewerById(String interviewerId) {
        log.info("Fetching interviewer with id: {}", interviewerId);

        Interviewer interviewer = interviewerRepository.findById(interviewerId)
                .orElseThrow(() -> new ResourceNotFoundException(AppConstants.INTERVIEWER_NOT_FOUND));

        return entityMapper.toInterviewerResponse(interviewer);
    }

    @Override
    @Transactional
    public InterviewerResponse updateInterviewer(String interviewerId, UpdateInterviewerRequest request) {
        log.info("Updating interviewer with id: {}", interviewerId);

        Interviewer interviewer = interviewerRepository.findById(interviewerId)
                .orElseThrow(() -> new ResourceNotFoundException(AppConstants.INTERVIEWER_NOT_FOUND));

        if (request.getDepartment() != null) {
            interviewer.setDepartment(request.getDepartment());
        }
        if (request.getExpertise() != null) {
            interviewer.setExpertise(request.getExpertise());
        }
        if (request.getYearsOfExperience() != null) {
            interviewer.setYearsOfExperience(request.getYearsOfExperience());
        }
        if (request.getAvailability() != null) {
            interviewer.setAvailability(request.getAvailability());
        }

        interviewer.setUpdatedAt(LocalDateTime.now());

        Interviewer updatedInterviewer = interviewerRepository.save(interviewer);

        return entityMapper.toInterviewerResponse(updatedInterviewer);
    }

    @Override
    @Transactional
    public MessageResponse deleteInterviewer(String interviewerId) {
        log.info("Deleting interviewer with id: {}", interviewerId);

        if (!interviewerRepository.existsById(interviewerId)) {
            throw new ResourceNotFoundException(AppConstants.INTERVIEWER_NOT_FOUND);
        }

        interviewerRepository.deleteById(interviewerId);

        return MessageResponse.builder()
                .message("Interviewer deleted successfully")
                .timestamp(LocalDateTime.now())
                .build();
    }
}

