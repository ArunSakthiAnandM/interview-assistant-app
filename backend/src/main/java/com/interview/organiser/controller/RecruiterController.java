package com.interview.organiser.controller;

import com.interview.organiser.constants.enums.VerificationStatus;
import com.interview.organiser.model.dto.request.CreateRecruiterRequest;
import com.interview.organiser.model.dto.request.UpdateRecruiterRequest;
import com.interview.organiser.model.dto.response.MessageResponse;
import com.interview.organiser.model.dto.response.RecruiterResponse;
import com.interview.organiser.model.dto.response.PageResponse;
import com.interview.organiser.service.RecruiterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/recruiters")
@RequiredArgsConstructor
public class RecruiterController {

    private final RecruiterService recruiterService;

    @GetMapping
    public ResponseEntity<PageResponse<RecruiterResponse>> getAllRecruiters(
            @RequestParam(required = false) VerificationStatus status,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(recruiterService.getAllRecruiters(status, isActive, pageable));
    }

    @PostMapping
    public ResponseEntity<RecruiterResponse> createRecruiter(@Valid @RequestBody CreateRecruiterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(recruiterService.createRecruiter(request));
    }

    @GetMapping("/{recruiterId}")
    public ResponseEntity<RecruiterResponse> getRecruiterById(@PathVariable String recruiterId) {
        return ResponseEntity.ok(recruiterService.getRecruiterById(recruiterId));
    }

    @PutMapping("/{recruiterId}")
    public ResponseEntity<RecruiterResponse> updateRecruiter(
            @PathVariable String recruiterId,
            @Valid @RequestBody UpdateRecruiterRequest request) {
        return ResponseEntity.ok(recruiterService.updateRecruiter(recruiterId, request));
    }

    @PutMapping("/{recruiterId}/verify")
    public ResponseEntity<RecruiterResponse> verifyRecruiter(@PathVariable String recruiterId) {
        return ResponseEntity.ok(recruiterService.verifyRecruiter(recruiterId));
    }

    @PutMapping("/{recruiterId}/reject")
    public ResponseEntity<RecruiterResponse> rejectRecruiter(
            @PathVariable String recruiterId,
            @RequestParam String reason) {
        return ResponseEntity.ok(recruiterService.rejectRecruiter(recruiterId, reason));
    }

    @DeleteMapping("/{recruiterId}")
    public ResponseEntity<MessageResponse> deleteRecruiter(@PathVariable String recruiterId) {
        return ResponseEntity.ok(recruiterService.deleteRecruiter(recruiterId));
    }
}

