package com.interview.organiser.repository;

import com.interview.organiser.model.entity.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FeedbackRepository extends MongoRepository<Feedback, String> {

    Optional<Feedback> findByInterviewId(String interviewId);

    Page<Feedback> findByInterview_Candidate_Id(String candidateId, Pageable pageable);

    Page<Feedback> findByInterview_Interviewer_Id(String interviewerId, Pageable pageable);

    @Query("{ 'interview.$id': ?0 }")
    Page<Feedback> findByInterviewIdPage(String interviewId, Pageable pageable);
}

