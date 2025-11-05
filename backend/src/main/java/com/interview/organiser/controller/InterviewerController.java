package com.interview.organiser.controller;

import com.interview.organiser.model.dto.request.CreateInterviewerRequest;
import com.interview.organiser.model.dto.request.UpdateInterviewerRequest;
import com.interview.organiser.model.dto.response.InterviewerResponse;
import com.interview.organiser.model.dto.response.MessageResponse;
import com.interview.organiser.model.dto.response.PageResponse;
import com.interview.organiser.service.InterviewerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/interviewers")
@RequiredArgsConstructor
public class InterviewerController {

    private final InterviewerService interviewerService;

    @GetMapping
    public ResponseEntity<PageResponse<InterviewerResponse>> getAllInterviewers(
            @RequestParam(required = false) String expertise,
            @RequestParam(required = false) Boolean available,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(interviewerService.getAllInterviewers(expertise, available, pageable));
    }

    @PostMapping
    public ResponseEntity<InterviewerResponse> createInterviewer(@Valid @RequestBody CreateInterviewerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(interviewerService.createInterviewer(request));
    }

    @GetMapping("/{interviewerId}")
    public ResponseEntity<InterviewerResponse> getInterviewerById(@PathVariable String interviewerId) {
        return ResponseEntity.ok(interviewerService.getInterviewerById(interviewerId));
    }

    @PutMapping("/{interviewerId}")
    public ResponseEntity<InterviewerResponse> updateInterviewer(
            @PathVariable String interviewerId,
            @Valid @RequestBody UpdateInterviewerRequest request) {
        return ResponseEntity.ok(interviewerService.updateInterviewer(interviewerId, request));
    }

    @DeleteMapping("/{interviewerId}")
    public ResponseEntity<MessageResponse> deleteInterviewer(@PathVariable String interviewerId) {
        return ResponseEntity.ok(interviewerService.deleteInterviewer(interviewerId));
    }
}

