package interview.organiser.controller;

import interview.organiser.model.dto.request.AvailabilitySlotRequest;
import interview.organiser.model.dto.response.AvailabilitySlotResponse;
import interview.organiser.model.dto.response.CalendarViewResponse;
import interview.organiser.model.dto.response.MessageResponse;
import interview.organiser.service.AvailabilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * REST Controller for interviewer availability operations
 */
@Slf4j
@RestController
@RequestMapping("/interviewers/{interviewerId}")
@RequiredArgsConstructor
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    /**
     * Get interviewer availability slots
     */
    @GetMapping("/availability")
    @PreAuthorize("hasAnyRole('ORGANISATION_ADMIN', 'RECRUITER', 'INTERVIEWER', 'ADMIN')")
    public ResponseEntity<List<AvailabilitySlotResponse>> getAvailability(
            @PathVariable String interviewerId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        log.info("Get availability request for interviewer: {}", interviewerId);
        List<AvailabilitySlotResponse> response = availabilityService.getInterviewerAvailability(
                interviewerId, startDate, endDate);
        return ResponseEntity.ok(response);
    }

    /**
     * Set interviewer availability slots
     */
    @PostMapping("/availability")
    @PreAuthorize("hasAnyRole('INTERVIEWER', 'ADMIN')")
    public ResponseEntity<List<AvailabilitySlotResponse>> setAvailability(
            @PathVariable String interviewerId,
            @Valid @RequestBody List<AvailabilitySlotRequest> slots) {
        log.info("Set availability request for interviewer: {} with {} slots", interviewerId, slots.size());
        List<AvailabilitySlotResponse> response = availabilityService.setInterviewerAvailability(
                interviewerId, slots);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get calendar view with available and booked slots
     */
    @GetMapping("/calendar")
    @PreAuthorize("hasAnyRole('ORGANISATION_ADMIN', 'RECRUITER', 'INTERVIEWER', 'ADMIN')")
    public ResponseEntity<CalendarViewResponse> getCalendar(
            @PathVariable String interviewerId,
            @RequestParam Integer month,
            @RequestParam Integer year) {
        log.info("Get calendar request for interviewer: {} for {}/{}", interviewerId, month, year);
        CalendarViewResponse response = availabilityService.getInterviewerCalendar(interviewerId, month, year);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete availability slot
     */
    @DeleteMapping("/availability/{slotId}")
    @PreAuthorize("hasAnyRole('INTERVIEWER', 'ADMIN')")
    public ResponseEntity<MessageResponse> deleteAvailabilitySlot(
            @PathVariable String interviewerId,
            @PathVariable String slotId) {
        log.info("Delete availability slot {} for interviewer: {}", slotId, interviewerId);
        availabilityService.deleteAvailabilitySlot(interviewerId, slotId);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Availability slot deleted successfully")
                .build());
    }
}

