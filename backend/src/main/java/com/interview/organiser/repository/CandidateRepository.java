package com.interview.organiser.repository;

import com.interview.organiser.constants.enums.CandidateStatus;
import com.interview.organiser.model.entity.Candidate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateRepository extends MongoRepository<Candidate, String> {

    boolean existsByEmail(String email);

    Page<Candidate> findByStatus(CandidateStatus status, Pageable pageable);

    @Query("{ $or: [ { 'firstName': { $regex: ?0, $options: 'i' } }, { 'lastName': { $regex: ?0, $options: 'i' } }, { 'email': { $regex: ?0, $options: 'i' } }, { 'position': { $regex: ?0, $options: 'i' } } ] }")
    Page<Candidate> searchCandidates(String search, Pageable pageable);

    @Query("{ 'status': ?0, $or: [ { 'firstName': { $regex: ?1, $options: 'i' } }, { 'lastName': { $regex: ?1, $options: 'i' } }, { 'email': { $regex: ?1, $options: 'i' } }, { 'position': { $regex: ?1, $options: 'i' } } ] }")
    Page<Candidate> searchCandidatesByStatus(CandidateStatus status, String search, Pageable pageable);
}

