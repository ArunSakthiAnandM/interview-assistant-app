package com.interview.organiser.controller;

import com.interview.organiser.model.dto.response.AdminDashboardResponse;
import com.interview.organiser.model.dto.response.CandidateDashboardResponse;
import com.interview.organiser.model.dto.response.InterviewerDashboardResponse;
import com.interview.organiser.model.dto.response.RecruiterDashboardResponse;
import com.interview.organiser.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin")
    public ResponseEntity<AdminDashboardResponse> getAdminDashboard() {
        return ResponseEntity.ok(dashboardService.getAdminDashboard());
    }

    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<RecruiterDashboardResponse> getRecruiterDashboard(@PathVariable String recruiterId) {
        return ResponseEntity.ok(dashboardService.getRecruiterDashboard(recruiterId));
    }

    @GetMapping("/interviewer/{interviewerId}")
    public ResponseEntity<InterviewerDashboardResponse> getInterviewerDashboard(@PathVariable String interviewerId) {
        return ResponseEntity.ok(dashboardService.getInterviewerDashboard(interviewerId));
    }

    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<CandidateDashboardResponse> getCandidateDashboard(@PathVariable String candidateId) {
        return ResponseEntity.ok(dashboardService.getCandidateDashboard(candidateId));
    }
}

