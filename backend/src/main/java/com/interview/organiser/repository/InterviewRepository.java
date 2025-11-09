package com.interview.organiser.repository;

import com.interview.organiser.constants.enums.InterviewStatus;
import com.interview.organiser.model.entity.Interview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface InterviewRepository extends MongoRepository<Interview, String> {

    Page<Interview> findByStatus(InterviewStatus status, Pageable pageable);

    @Query("{ 'candidate.$id': ?0 }")
    Page<Interview> findByCandidateId(String candidateId, Pageable pageable);

    @Query("{ 'interviewers.$id': ?0 }")
    Page<Interview> findByInterviewerId(String interviewerId, Pageable pageable);

    @Query("{ 'scheduledAt': { $gte: ?0, $lte: ?1 } }")
    Page<Interview> findByScheduledAtBetween(LocalDateTime fromDate, LocalDateTime toDate, Pageable pageable);

    @Query("{ 'candidate.$id': ?0, 'status': ?1 }")
    Page<Interview> findByCandidateIdAndStatus(String candidateId, InterviewStatus status, Pageable pageable);

    @Query("{ 'interviewers.$id': ?0, 'status': ?1 }")
    Page<Interview> findByInterviewerIdAndStatus(String interviewerId, InterviewStatus status, Pageable pageable);
}

