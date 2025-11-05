package com.interview.organiser.controller;

import com.interview.organiser.constants.enums.InterviewStatus;
import com.interview.organiser.model.dto.request.ScheduleInterviewRequest;
import com.interview.organiser.model.dto.request.UpdateInterviewRequest;
import com.interview.organiser.model.dto.request.UpdateInterviewStatusRequest;
import com.interview.organiser.model.dto.response.InterviewResponse;
import com.interview.organiser.model.dto.response.MessageResponse;
import com.interview.organiser.model.dto.response.PageResponse;
import com.interview.organiser.service.InterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    @GetMapping
    public ResponseEntity<PageResponse<InterviewResponse>> getAllInterviews(
            @RequestParam(required = false) InterviewStatus status,
            @RequestParam(required = false) String candidateId,
            @RequestParam(required = false) String interviewerId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(interviewService.getAllInterviews(status, candidateId, interviewerId, fromDate, toDate, pageable));
    }

    @PostMapping
    public ResponseEntity<InterviewResponse> scheduleInterview(@Valid @RequestBody ScheduleInterviewRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(interviewService.scheduleInterview(request));
    }

    @GetMapping("/{interviewId}")
    public ResponseEntity<InterviewResponse> getInterviewById(@PathVariable String interviewId) {
        return ResponseEntity.ok(interviewService.getInterviewById(interviewId));
    }

    @PutMapping("/{interviewId}")
    public ResponseEntity<InterviewResponse> updateInterview(
            @PathVariable String interviewId,
            @Valid @RequestBody UpdateInterviewRequest request) {
        return ResponseEntity.ok(interviewService.updateInterview(interviewId, request));
    }

    @PatchMapping("/{interviewId}/status")
    public ResponseEntity<InterviewResponse> updateInterviewStatus(
            @PathVariable String interviewId,
            @Valid @RequestBody UpdateInterviewStatusRequest request) {
        return ResponseEntity.ok(interviewService.updateInterviewStatus(interviewId, request));
    }

    @DeleteMapping("/{interviewId}")
    public ResponseEntity<MessageResponse> cancelInterview(@PathVariable String interviewId) {
        return ResponseEntity.ok(interviewService.cancelInterview(interviewId));
    }
}

