package interview.organiser.repository;

import interview.organiser.constants.CandidateStatus;
import interview.organiser.constants.InterviewStatus;
import interview.organiser.model.entity.Interview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Interview entity
 */
@Repository
public interface InterviewRepository extends MongoRepository<Interview, String> {

    Optional<Interview> findByIdAndDeletedFalse(String id);

    Page<Interview> findByOrganisationIdAndDeletedFalse(String organisationId, Pageable pageable);

    Page<Interview> findByOrganisationIdAndOverallStatusAndDeletedFalse(
            String organisationId, InterviewStatus status, Pageable pageable);

    Page<Interview> findByCreatedByUserIdAndDeletedFalse(String createdByUserId, Pageable pageable);

    Page<Interview> findByCandidateUserIdAndDeletedFalse(String candidateUserId, Pageable pageable);

    @Query("{ 'rounds.interviewerIds': ?0, 'deleted': false }")
    Page<Interview> findByInterviewerId(String interviewerId, Pageable pageable);

    @Query("{ 'rounds.interviewerIds': ?0, 'rounds.status': ?1, 'deleted': false }")
    Page<Interview> findByInterviewerIdAndRoundStatus(String interviewerId, String roundStatus, Pageable pageable);

    Long countByOrganisationIdAndDeletedFalse(String organisationId);

    Long countByOrganisationIdAndOverallStatusAndDeletedFalse(String organisationId, InterviewStatus status);

    Long countByCreatedByUserIdAndDeletedFalse(String createdByUserId);

    Long countByCandidateUserIdAndDeletedFalse(String candidateUserId);

    Long countByCandidateUserIdAndCandidateStatusAndDeletedFalse(String candidateUserId, CandidateStatus status);

    @Query("{ 'rounds.interviewerIds': ?0, 'deleted': false }")
    Long countByInterviewerId(String interviewerId);

    @Query("{ 'rounds': { $elemMatch: { 'interviewerIds': ?0, 'scheduledDate': { $gte: ?1 } }}, 'deleted': false }")
    List<Interview> findUpcomingInterviewsByInterviewerId(String interviewerId, LocalDateTime currentDate);

    @Query("{ 'candidateUserId': ?0, 'rounds': { $elemMatch: { 'scheduledDate': { $gte: ?1 } }}, 'deleted': false }")
    List<Interview> findUpcomingInterviewsByCandidateId(String candidateUserId, LocalDateTime currentDate);
}
