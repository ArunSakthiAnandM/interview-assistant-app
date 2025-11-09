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

    @Query("{ 'interview.$id': ?0 }")
    Optional<Feedback> findByInterviewId(String interviewId);

    // Note: For these queries, we'll need to handle them in the service layer
    // by first finding interviews and then finding feedback for those interviews
    @Query("{ 'interview.$id': { $in: ?0 } }")
    Page<Feedback> findByCandidateInterviewIds(java.util.List<String> interviewIds, Pageable pageable);

    @Query("{ 'interview.$id': { $in: ?0 } }")
    Page<Feedback> findByInterviewerInterviewIds(java.util.List<String> interviewIds, Pageable pageable);

    @Query("{ 'interview.$id': ?0 }")
    Page<Feedback> findByInterviewIdPage(String interviewId, Pageable pageable);
}

