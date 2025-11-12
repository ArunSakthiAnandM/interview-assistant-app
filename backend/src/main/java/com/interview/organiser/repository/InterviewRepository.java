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

    // Count methods for dashboard
    long countByStatus(InterviewStatus status);

    long countByRecruiterId(String recruiterId);

    long countByRecruiterIdAndStatus(String recruiterId, InterviewStatus status);

    @Query(value = "{ 'recruiterId': ?0, 'status': ?1, 'scheduledAt': { $gt: ?2 } }", count = true)
    long countByRecruiterIdAndStatusAndScheduledAtAfter(String recruiterId, InterviewStatus status, LocalDateTime dateTime);
}

