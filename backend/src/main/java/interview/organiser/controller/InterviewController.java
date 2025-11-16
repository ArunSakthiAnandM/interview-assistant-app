package interview.organiser.controller;

import interview.organiser.model.dto.request.FeedbackRequest;
import interview.organiser.model.dto.request.InterviewCreateRequest;
import interview.organiser.model.dto.request.RoundDecisionRequest;
import interview.organiser.model.dto.request.RoundRequest;
import interview.organiser.model.dto.response.InterviewResponse;
import interview.organiser.model.dto.response.MessageResponse;
import interview.organiser.service.InterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for interview operations
 */
@Slf4j
@RestController
@RequestMapping("/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    /**
     * Create a new interview
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ORGANISATION_ADMIN', 'RECRUITER')")
    public ResponseEntity<InterviewResponse> createInterview(@Valid @RequestBody InterviewCreateRequest request) {
        log.info("Create interview request received for position: {}", request.getJobPosition());
        InterviewResponse response = interviewService.createInterview(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get interview by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<InterviewResponse> getInterviewById(@PathVariable String id) {
        log.info("Get interview by ID request received: {}", id);
        InterviewResponse response = interviewService.getInterviewById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Update interview
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ORGANISATION_ADMIN', 'RECRUITER')")
    public ResponseEntity<InterviewResponse> updateInterview(
            @PathVariable String id,
            @Valid @RequestBody InterviewCreateRequest request) {
        log.info("Update interview request received for ID: {}", id);
        InterviewResponse response = interviewService.updateInterview(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete interview
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANISATION_ADMIN', 'RECRUITER')")
    public ResponseEntity<MessageResponse> deleteInterview(@PathVariable String id) {
        log.info("Delete interview request received for ID: {}", id);
        MessageResponse response = interviewService.deleteInterview(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Accept interview invitation (CANDIDATE)
     */
    @PostMapping("/{id}/accept")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<MessageResponse> acceptInterviewInvitation(@PathVariable String id) {
        log.info("Accept interview invitation request received for ID: {}", id);
        MessageResponse response = interviewService.acceptInterviewInvitation(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Decline interview invitation (CANDIDATE)
     */
    @PostMapping("/{id}/decline")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<MessageResponse> declineInterviewInvitation(@PathVariable String id) {
        log.info("Decline interview invitation request received for ID: {}", id);
        MessageResponse response = interviewService.declineInterviewInvitation(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Add or update a round
     */
    @PostMapping("/{interviewId}/rounds")
    @PreAuthorize("hasAnyRole('ORGANISATION_ADMIN', 'RECRUITER')")
    public ResponseEntity<InterviewResponse> addRound(
            @PathVariable String interviewId,
            @Valid @RequestBody RoundRequest request) {
        log.info("Add round request received for interview: {}", interviewId);
        InterviewResponse response = interviewService.addOrUpdateRound(interviewId, null, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Update a round
     */
    @PutMapping("/{interviewId}/rounds/{roundId}")
    @PreAuthorize("hasAnyRole('ORGANISATION_ADMIN', 'RECRUITER')")
    public ResponseEntity<InterviewResponse> updateRound(
            @PathVariable String interviewId,
            @PathVariable String roundId,
            @Valid @RequestBody RoundRequest request) {
        log.info("Update round request received for interview: {}, round: {}", interviewId, roundId);
        InterviewResponse response = interviewService.addOrUpdateRound(interviewId, roundId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Submit feedback for a round (INTERVIEWER)
     */
    @PostMapping("/{interviewId}/rounds/{roundId}/feedback")
    @PreAuthorize("hasRole('INTERVIEWER')")
    public ResponseEntity<MessageResponse> submitFeedback(
            @PathVariable String interviewId,
            @PathVariable String roundId,
            @Valid @RequestBody FeedbackRequest request) {
        log.info("Submit feedback request received for interview: {}, round: {}", interviewId, roundId);
        MessageResponse response = interviewService.submitFeedback(interviewId, roundId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Make decision on a round (RECRUITER/ORGANISATION_ADMIN)
     */
    @PostMapping("/{interviewId}/rounds/{roundId}/decision")
    @PreAuthorize("hasAnyRole('ORGANISATION_ADMIN', 'RECRUITER')")
    public ResponseEntity<InterviewResponse> makeRoundDecision(
            @PathVariable String interviewId,
            @PathVariable String roundId,
            @Valid @RequestBody RoundDecisionRequest request) {
        log.info("Make decision request received for interview: {}, round: {}", interviewId, roundId);
        InterviewResponse response = interviewService.makeRoundDecision(interviewId, roundId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get interviews by organisation
     */
    @GetMapping("/organisation/{organisationId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANISATION_ADMIN', 'RECRUITER')")
    public ResponseEntity<Page<InterviewResponse>> getInterviewsByOrganisation(
            @PathVariable String organisationId,
            @PageableDefault(size = 5, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Get interviews by organisation request received: {}", organisationId);
        Page<InterviewResponse> response = interviewService.getInterviewsByOrganisation(organisationId, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Get interviews by recruiter
     */
    @GetMapping("/recruiter/{recruiterId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER')")
    public ResponseEntity<Page<InterviewResponse>> getInterviewsByRecruiter(
            @PathVariable String recruiterId,
            @PageableDefault(size = 5, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Get interviews by recruiter request received: {}", recruiterId);
        Page<InterviewResponse> response = interviewService.getInterviewsByRecruiter(recruiterId, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Get interviews by interviewer
     */
    @GetMapping("/interviewer/{interviewerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERVIEWER')")
    public ResponseEntity<Page<InterviewResponse>> getInterviewsByInterviewer(
            @PathVariable String interviewerId,
            @PageableDefault(size = 5, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Get interviews by interviewer request received: {}", interviewerId);
        Page<InterviewResponse> response = interviewService.getInterviewsByInterviewer(interviewerId, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Get interviews by candidate
     */
    @GetMapping("/candidate/{candidateId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CANDIDATE')")
    public ResponseEntity<Page<InterviewResponse>> getInterviewsByCandidate(
            @PathVariable String candidateId,
            @PageableDefault(size = 5, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Get interviews by candidate request received: {}", candidateId);
        Page<InterviewResponse> response = interviewService.getInterviewsByCandidate(candidateId, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Cancel interview with reason and notifications
     */
    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANISATION_ADMIN', 'RECRUITER')")
    public ResponseEntity<MessageResponse> cancelInterview(
            @PathVariable String id,
            @RequestParam String reason) {
        log.info("Cancel interview request received for ID: {}", id);
        MessageResponse response = interviewService.cancelInterview(id, reason);
        return ResponseEntity.ok(response);
    }
}
