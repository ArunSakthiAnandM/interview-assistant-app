package com.interview.organiser.controller;

import com.interview.organiser.constants.enums.CandidateStatus;
import com.interview.organiser.model.dto.request.CreateCandidateRequest;
import com.interview.organiser.model.dto.request.UpdateCandidateRequest;
import com.interview.organiser.model.dto.response.CandidateResponse;
import com.interview.organiser.model.dto.response.MessageResponse;
import com.interview.organiser.model.dto.response.PageResponse;
import com.interview.organiser.service.CandidateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/candidates")
@RequiredArgsConstructor
public class CandidateController {

    private final CandidateService candidateService;

    @GetMapping
    public ResponseEntity<PageResponse<CandidateResponse>> getAllCandidates(
            @RequestParam(required = false) CandidateStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(candidateService.getAllCandidates(status, search, pageable));
    }

    @PostMapping
    public ResponseEntity<CandidateResponse> createCandidate(@Valid @RequestBody CreateCandidateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(candidateService.createCandidate(request));
    }

    @GetMapping("/{candidateId}")
    public ResponseEntity<CandidateResponse> getCandidateById(@PathVariable String candidateId) {
        return ResponseEntity.ok(candidateService.getCandidateById(candidateId));
    }

    @PutMapping("/{candidateId}")
    public ResponseEntity<CandidateResponse> updateCandidate(
            @PathVariable String candidateId,
            @Valid @RequestBody UpdateCandidateRequest request) {
        return ResponseEntity.ok(candidateService.updateCandidate(candidateId, request));
    }

    @DeleteMapping("/{candidateId}")
    public ResponseEntity<MessageResponse> deleteCandidate(@PathVariable String candidateId) {
        return ResponseEntity.ok(candidateService.deleteCandidate(candidateId));
    }
}

