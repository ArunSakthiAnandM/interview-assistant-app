package com.interview.organiser.repository;

import com.interview.organiser.model.entity.Interviewer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InterviewerRepository extends MongoRepository<Interviewer, String> {

    Optional<Interviewer> findByUserId(String userId);

    Page<Interviewer> findByAvailability(Boolean availability, Pageable pageable);

    @Query("{ 'expertise': { $in: [?0] } }")
    Page<Interviewer> findByExpertise(String expertise, Pageable pageable);

    @Query("{ 'expertise': { $in: [?0] }, 'availability': ?1 }")
    Page<Interviewer> findByExpertiseAndAvailability(String expertise, Boolean availability, Pageable pageable);

    Optional<Interviewer> findByEmail(String email);

    Optional<Interviewer> findByInvitationToken(String invitationToken);
}

