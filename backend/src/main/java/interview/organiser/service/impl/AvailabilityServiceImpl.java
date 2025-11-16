package interview.organiser.service.impl;

import interview.organiser.constants.RecurringPatternType;
import interview.organiser.exception.InvalidOperationException;
import interview.organiser.exception.ResourceNotFoundException;
import interview.organiser.model.dto.request.AvailabilitySlotRequest;
import interview.organiser.model.dto.response.AvailabilitySlotResponse;
import interview.organiser.model.dto.response.CalendarViewResponse;
import interview.organiser.model.entity.AvailabilitySlot;
import interview.organiser.model.entity.Interview;
import interview.organiser.model.entity.InterviewRound;
import interview.organiser.model.entity.User;
import interview.organiser.repository.AvailabilitySlotRepository;
import interview.organiser.repository.InterviewRepository;
import interview.organiser.repository.UserRepository;
import interview.organiser.service.AvailabilityService;
import interview.organiser.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Implementation of AvailabilityService with recurring pattern support
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AvailabilityServiceImpl implements AvailabilityService {

    private final AvailabilitySlotRepository availabilitySlotRepository;
    private final UserRepository userRepository;
    private final InterviewRepository interviewRepository;

    @Override
    public List<AvailabilitySlotResponse> getInterviewerAvailability(String interviewerId,
                                                                      LocalDateTime startDate,
                                                                      LocalDateTime endDate) {
        log.info("Getting availability for interviewer {} from {} to {}", interviewerId, startDate, endDate);

        // Verify interviewer exists
        verifyInterviewerExists(interviewerId);

        // Get all slots (both one-time and recurring)
        List<AvailabilitySlot> slots = availabilitySlotRepository
                .findByInterviewerIdAndStartDateTimeBetweenAndDeletedFalseOrderByStartDateTimeAsc(
                        interviewerId, startDate, endDate);

        // Expand recurring slots into actual instances
        List<AvailabilitySlot> expandedSlots = new ArrayList<>();
        for (AvailabilitySlot slot : slots) {
            if (slot.getRecurringPattern() != null && slot.getRecurringPattern() != RecurringPatternType.NONE) {
                expandedSlots.addAll(expandRecurringSlot(slot, startDate, endDate));
            } else {
                expandedSlots.add(slot);
            }
        }

        return expandedSlots.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AvailabilitySlotResponse> setInterviewerAvailability(String interviewerId,
                                                                      List<AvailabilitySlotRequest> slots) {
        log.info("Setting availability for interviewer {} with {} slots", interviewerId, slots.size());

        // Verify current user is the interviewer or admin
        String currentUserId = SecurityUtil.getCurrentUserId();
        if (!currentUserId.equals(interviewerId) && !SecurityUtil.hasRole("ADMIN")) {
            throw new InvalidOperationException("You can only manage your own availability");
        }

        verifyInterviewerExists(interviewerId);

        List<AvailabilitySlot> createdSlots = new ArrayList<>();
        for (AvailabilitySlotRequest request : slots) {
            AvailabilitySlot slot = AvailabilitySlot.builder()
                    .interviewerId(interviewerId)
                    .startDateTime(request.getStartDateTime())
                    .endDateTime(request.getEndDateTime())
                    .recurringPattern(request.getRecurringPattern() != null ?
                            request.getRecurringPattern() : RecurringPatternType.NONE)
                    .recurringStartTime(request.getRecurringStartTime())
                    .recurringEndTime(request.getRecurringEndTime())
                    .recurringDays(request.getRecurringDays())
                    .recurringUntil(request.getRecurringUntil())
                    .blocked(false)
                    .deleted(false)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            createdSlots.add(availabilitySlotRepository.save(slot));
        }

        return createdSlots.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CalendarViewResponse getInterviewerCalendar(String interviewerId, Integer month, Integer year) {
        log.info("Getting calendar for interviewer {} for {}/{}", interviewerId, month, year);

        verifyInterviewerExists(interviewerId);

        LocalDate firstDay = LocalDate.of(year, month, 1);
        LocalDate lastDay = firstDay.withDayOfMonth(firstDay.lengthOfMonth());
        LocalDateTime startDateTime = firstDay.atStartOfDay();
        LocalDateTime endDateTime = lastDay.atTime(23, 59, 59);

        // Get available slots
        List<AvailabilitySlot> availableSlots = availabilitySlotRepository
                .findByInterviewerIdAndStartDateTimeBetweenAndDeletedFalseOrderByStartDateTimeAsc(
                        interviewerId, startDateTime, endDateTime);

        // Get booked slots (interviews)
        List<Interview> interviews = interviewRepository.findAll().stream()
                .filter(interview -> interview.getDeleted() == null || !interview.getDeleted())
                .filter(interview -> {
                    return interview.getRounds().stream()
                            .anyMatch(round -> round.getInterviewerIds() != null &&
                                    round.getInterviewerIds().contains(interviewerId) &&
                                    round.getScheduledDate() != null &&
                                    !round.getScheduledDate().isBefore(startDateTime) &&
                                    !round.getScheduledDate().isAfter(endDateTime));
                })
                .collect(Collectors.toList());

        // Build calendar days
        List<CalendarViewResponse.CalendarDay> days = new ArrayList<>();
        for (LocalDate date = firstDay; !date.isAfter(lastDay); date = date.plusDays(1)) {
            LocalDateTime dayStart = date.atStartOfDay();
            LocalDateTime dayEnd = date.atTime(23, 59, 59);

            List<AvailabilitySlotResponse> daySlotsResponse = availableSlots.stream()
                    .filter(slot -> !slot.getStartDateTime().isBefore(dayStart) &&
                            !slot.getStartDateTime().isAfter(dayEnd))
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());

            List<CalendarViewResponse.BookedSlot> dayBookedSlots = interviews.stream()
                    .flatMap(interview -> interview.getRounds().stream()
                            .filter(round -> round.getInterviewerIds() != null &&
                                    round.getInterviewerIds().contains(interviewerId) &&
                                    round.getScheduledDate() != null &&
                                    !round.getScheduledDate().isBefore(dayStart) &&
                                    !round.getScheduledDate().isAfter(dayEnd))
                            .map(round -> CalendarViewResponse.BookedSlot.builder()
                                    .roundId(round.getRoundId())
                                    .interviewId(interview.getId())
                                    .candidateName(interview.getCandidateUserId())
                                    .jobPosition(interview.getJobPosition())
                                    .startTime(round.getScheduledDate())
                                    .endTime(round.getScheduledDate().plusMinutes(round.getDurationMinutes()))
                                    .build()))
                    .collect(Collectors.toList());

            int totalAvailableHours = daySlotsResponse.stream()
                    .mapToInt(slot -> (int) ChronoUnit.HOURS.between(slot.getStartDateTime(), slot.getEndDateTime()))
                    .sum();

            int totalBookedHours = dayBookedSlots.stream()
                    .mapToInt(slot -> (int) ChronoUnit.HOURS.between(slot.getStartTime(), slot.getEndTime()))
                    .sum();

            days.add(CalendarViewResponse.CalendarDay.builder()
                    .date(dayStart)
                    .availableSlots(daySlotsResponse)
                    .bookedSlots(dayBookedSlots)
                    .totalAvailableHours(totalAvailableHours)
                    .totalBookedHours(totalBookedHours)
                    .build());
        }

        return CalendarViewResponse.builder()
                .month(month)
                .year(year)
                .days(days)
                .build();
    }

    @Override
    public void blockSlotForRound(String interviewerId, String roundId, String interviewId,
                                   LocalDateTime startTime, LocalDateTime endTime) {
        log.info("Blocking slot for interviewer {} for round {}", interviewerId, roundId);

        // Find overlapping availability slots and block them
        List<AvailabilitySlot> overlappingSlots = availabilitySlotRepository
                .findByInterviewerIdAndBlockedFalseAndDeletedFalseAndStartDateTimeBetween(
                        interviewerId, startTime.minusHours(1), endTime.plusHours(1));

        for (AvailabilitySlot slot : overlappingSlots) {
            if (slotsOverlap(slot.getStartDateTime(), slot.getEndDateTime(), startTime, endTime)) {
                slot.setBlocked(true);
                slot.setBlockedByRoundId(roundId);
                slot.setBlockedByInterviewId(interviewId);
                slot.setUpdatedAt(LocalDateTime.now());
                availabilitySlotRepository.save(slot);
            }
        }
    }

    @Override
    public void unblockSlotForRound(String roundId) {
        log.info("Unblocking slots for round {}", roundId);

        List<AvailabilitySlot> blockedSlots = availabilitySlotRepository.findByBlockedByRoundId(roundId);
        for (AvailabilitySlot slot : blockedSlots) {
            slot.setBlocked(false);
            slot.setBlockedByRoundId(null);
            slot.setBlockedByInterviewId(null);
            slot.setUpdatedAt(LocalDateTime.now());
            availabilitySlotRepository.save(slot);
        }
    }

    @Override
    public void deleteAvailabilitySlot(String interviewerId, String slotId) {
        log.info("Deleting availability slot {} for interviewer {}", slotId, interviewerId);

        AvailabilitySlot slot = availabilitySlotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Availability slot not found"));

        if (!slot.getInterviewerId().equals(interviewerId)) {
            throw new InvalidOperationException("You can only delete your own availability slots");
        }

        if (slot.getBlocked()) {
            throw new InvalidOperationException("Cannot delete a blocked availability slot");
        }

        slot.setDeleted(true);
        slot.setUpdatedAt(LocalDateTime.now());
        availabilitySlotRepository.save(slot);
    }

    @Override
    public boolean isInterviewerAvailable(String interviewerId, LocalDateTime startTime, LocalDateTime endTime) {
        List<AvailabilitySlot> availableSlots = availabilitySlotRepository
                .findByInterviewerIdAndBlockedFalseAndDeletedFalseAndStartDateTimeBetween(
                        interviewerId, startTime.minusHours(1), endTime.plusHours(1));

        return availableSlots.stream()
                .anyMatch(slot -> slotsOverlap(slot.getStartDateTime(), slot.getEndDateTime(), startTime, endTime));
    }

    // Helper methods

    private void verifyInterviewerExists(String interviewerId) {
        User interviewer = userRepository.findById(interviewerId)
                .orElseThrow(() -> new ResourceNotFoundException("Interviewer not found"));

        if (interviewer.getRole().name().equals("INTERVIEWER") == false) {
            throw new InvalidOperationException("User is not an interviewer");
        }
    }

    private List<AvailabilitySlot> expandRecurringSlot(AvailabilitySlot slot,
                                                        LocalDateTime rangeStart,
                                                        LocalDateTime rangeEnd) {
        List<AvailabilitySlot> expanded = new ArrayList<>();

        if (slot.getRecurringPattern() == RecurringPatternType.NONE || slot.getRecurringPattern() == null) {
            expanded.add(slot);
            return expanded;
        }

        LocalDateTime current = slot.getStartDateTime();
        LocalDateTime until = slot.getRecurringUntil() != null ? slot.getRecurringUntil() : rangeEnd;

        switch (slot.getRecurringPattern()) {
            case DAILY:
                while (!current.isAfter(until) && !current.isAfter(rangeEnd)) {
                    if (!current.isBefore(rangeStart)) {
                        expanded.add(createInstanceFromRecurring(slot, current));
                    }
                    current = current.plusDays(1);
                }
                break;

            case WEEKLY:
                while (!current.isAfter(until) && !current.isAfter(rangeEnd)) {
                    if (!current.isBefore(rangeStart) &&
                        (slot.getRecurringDays() == null || slot.getRecurringDays().contains(current.getDayOfWeek()))) {
                        expanded.add(createInstanceFromRecurring(slot, current));
                    }
                    current = current.plusDays(1);
                }
                break;

            case MONTHLY:
                while (!current.isAfter(until) && !current.isAfter(rangeEnd)) {
                    if (!current.isBefore(rangeStart)) {
                        expanded.add(createInstanceFromRecurring(slot, current));
                    }
                    current = current.plusMonths(1);
                }
                break;

            default:
                expanded.add(slot);
        }

        return expanded;
    }

    private AvailabilitySlot createInstanceFromRecurring(AvailabilitySlot slot, LocalDateTime date) {
        LocalTime startTime = slot.getRecurringStartTime() != null ?
                slot.getRecurringStartTime() : slot.getStartDateTime().toLocalTime();
        LocalTime endTime = slot.getRecurringEndTime() != null ?
                slot.getRecurringEndTime() : slot.getEndDateTime().toLocalTime();

        return AvailabilitySlot.builder()
                .id(slot.getId() + "_" + date.toLocalDate())
                .interviewerId(slot.getInterviewerId())
                .startDateTime(date.toLocalDate().atTime(startTime))
                .endDateTime(date.toLocalDate().atTime(endTime))
                .recurringPattern(RecurringPatternType.NONE)
                .blocked(slot.getBlocked())
                .blockedByRoundId(slot.getBlockedByRoundId())
                .blockedByInterviewId(slot.getBlockedByInterviewId())
                .createdAt(slot.getCreatedAt())
                .updatedAt(slot.getUpdatedAt())
                .deleted(false)
                .build();
    }

    private boolean slotsOverlap(LocalDateTime start1, LocalDateTime end1,
                                  LocalDateTime start2, LocalDateTime end2) {
        return !start1.isAfter(end2) && !end1.isBefore(start2);
    }

    private AvailabilitySlotResponse mapToResponse(AvailabilitySlot slot) {
        User interviewer = userRepository.findById(slot.getInterviewerId()).orElse(null);

        return AvailabilitySlotResponse.builder()
                .id(slot.getId())
                .interviewerId(slot.getInterviewerId())
                .interviewerName(interviewer != null ? interviewer.getName() : null)
                .startDateTime(slot.getStartDateTime())
                .endDateTime(slot.getEndDateTime())
                .recurringPattern(slot.getRecurringPattern())
                .recurringStartTime(slot.getRecurringStartTime())
                .recurringEndTime(slot.getRecurringEndTime())
                .recurringDays(slot.getRecurringDays())
                .recurringUntil(slot.getRecurringUntil())
                .blocked(slot.getBlocked())
                .blockedByRoundId(slot.getBlockedByRoundId())
                .blockedByInterviewId(slot.getBlockedByInterviewId())
                .createdAt(slot.getCreatedAt())
                .updatedAt(slot.getUpdatedAt())
                .build();
    }
}

