package interview.organiser.repository;

import interview.organiser.model.entity.AvailabilitySlot;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for AvailabilitySlot entity
 */
@Repository
public interface AvailabilitySlotRepository extends MongoRepository<AvailabilitySlot, String> {

    List<AvailabilitySlot> findByInterviewerIdAndDeletedFalseOrderByStartDateTimeAsc(String interviewerId);

    List<AvailabilitySlot> findByInterviewerIdAndStartDateTimeBetweenAndDeletedFalseOrderByStartDateTimeAsc(
            String interviewerId, LocalDateTime start, LocalDateTime end);

    List<AvailabilitySlot> findByInterviewerIdAndBlockedFalseAndDeletedFalseAndStartDateTimeBetween(
            String interviewerId, LocalDateTime start, LocalDateTime end);

    List<AvailabilitySlot> findByBlockedByRoundId(String roundId);
}

