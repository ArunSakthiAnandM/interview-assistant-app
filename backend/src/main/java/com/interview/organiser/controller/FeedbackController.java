package com.interview.organiser.controller;

import com.interview.organiser.model.dto.request.SubmitFeedbackRequest;
import com.interview.organiser.model.dto.request.UpdateFeedbackRequest;
import com.interview.organiser.model.dto.response.FeedbackResponse;
import com.interview.organiser.model.dto.response.MessageResponse;
import com.interview.organiser.model.dto.response.PageResponse;
import com.interview.organiser.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @GetMapping
    public ResponseEntity<PageResponse<FeedbackResponse>> getAllFeedback(
            @RequestParam(required = false) String interviewId,
            @RequestParam(required = false) String candidateId,
            @RequestParam(required = false) String interviewerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(feedbackService.getAllFeedback(interviewId, candidateId, interviewerId, pageable));
    }

    @PostMapping
    public ResponseEntity<FeedbackResponse> submitFeedback(@Valid @RequestBody SubmitFeedbackRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(feedbackService.submitFeedback(request));
    }

    @GetMapping("/{feedbackId}")
    public ResponseEntity<FeedbackResponse> getFeedbackById(@PathVariable String feedbackId) {
        return ResponseEntity.ok(feedbackService.getFeedbackById(feedbackId));
    }

    @PutMapping("/{feedbackId}")
    public ResponseEntity<FeedbackResponse> updateFeedback(
            @PathVariable String feedbackId,
            @Valid @RequestBody UpdateFeedbackRequest request) {
        return ResponseEntity.ok(feedbackService.updateFeedback(feedbackId, request));
    }

    @DeleteMapping("/{feedbackId}")
    public ResponseEntity<MessageResponse> deleteFeedback(@PathVariable String feedbackId) {
        return ResponseEntity.ok(feedbackService.deleteFeedback(feedbackId));
    }
}
