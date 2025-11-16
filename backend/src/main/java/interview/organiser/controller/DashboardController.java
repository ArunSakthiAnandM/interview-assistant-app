package interview.organiser.controller;

import interview.organiser.model.dto.response.*;
import interview.organiser.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for dashboard operations
 */
@Slf4j
@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * Get admin dashboard
     */
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardResponse> getAdminDashboard() {
        log.info("Get admin dashboard request received");
        AdminDashboardResponse response = dashboardService.getAdminDashboard();
        return ResponseEntity.ok(response);
    }

    /**
     * Get organisation dashboard
     */
    @GetMapping("/organisation/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANISATION_ADMIN')")
    public ResponseEntity<OrganisationDashboardResponse> getOrganisationDashboard(@PathVariable String id) {
        log.info("Get organisation dashboard request received for ID: {}", id);
        OrganisationDashboardResponse response = dashboardService.getOrganisationDashboard(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Get recruiter dashboard
     */
    @GetMapping("/recruiter/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER')")
    public ResponseEntity<RecruiterDashboardResponse> getRecruiterDashboard(@PathVariable String id) {
        log.info("Get recruiter dashboard request received for ID: {}", id);
        RecruiterDashboardResponse response = dashboardService.getRecruiterDashboard(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Get interviewer dashboard
     */
    @GetMapping("/interviewer/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERVIEWER')")
    public ResponseEntity<InterviewerDashboardResponse> getInterviewerDashboard(@PathVariable String id) {
        log.info("Get interviewer dashboard request received for ID: {}", id);
        InterviewerDashboardResponse response = dashboardService.getInterviewerDashboard(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Get candidate dashboard
     */
    @GetMapping("/candidate/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CANDIDATE')")
    public ResponseEntity<CandidateDashboardResponse> getCandidateDashboard(@PathVariable String id) {
        log.info("Get candidate dashboard request received for ID: {}", id);
        CandidateDashboardResponse response = dashboardService.getCandidateDashboard(id);
        return ResponseEntity.ok(response);
    }
}

