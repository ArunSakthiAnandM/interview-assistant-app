package interview.organiser.service;

import interview.organiser.model.dto.request.AvailabilitySlotRequest;
import interview.organiser.model.dto.response.AvailabilitySlotResponse;
import interview.organiser.model.dto.response.CalendarViewResponse;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service interface for interviewer availability operations
 */
public interface AvailabilityService {

    /**
     * Get interviewer availability slots for a date range
     */
    List<AvailabilitySlotResponse> getInterviewerAvailability(String interviewerId,
                                                               LocalDateTime startDate,
                                                               LocalDateTime endDate);

    /**
     * Add or update availability slots for an interviewer
     */
    List<AvailabilitySlotResponse> setInterviewerAvailability(String interviewerId,
                                                               List<AvailabilitySlotRequest> slots);

    /**
     * Get calendar view with available and booked slots
     */
    CalendarViewResponse getInterviewerCalendar(String interviewerId, Integer month, Integer year);

    /**
     * Block availability slot when interviewer is assigned to a round
     */
    void blockSlotForRound(String interviewerId, String roundId, String interviewId,
                           LocalDateTime startTime, LocalDateTime endTime);

    /**
     * Unblock availability slot when interviewer is removed from a round
     */
    void unblockSlotForRound(String roundId);

    /**
     * Delete an availability slot
     */
    void deleteAvailabilitySlot(String interviewerId, String slotId);

    /**
     * Check if interviewer is available during a specific time
     */
    boolean isInterviewerAvailable(String interviewerId, LocalDateTime startTime, LocalDateTime endTime);
}

