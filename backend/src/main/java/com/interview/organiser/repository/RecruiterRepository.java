package com.interview.organiser.repository;

import com.interview.organiser.constants.enums.VerificationStatus;
import com.interview.organiser.model.entity.Recruiter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecruiterRepository extends MongoRepository<Recruiter, String> {

    Optional<Recruiter> findByName(String name);

    Optional<Recruiter> findByContactEmail(String contactEmail);

    Optional<Recruiter> findByAdminUserId(String adminUserId);

    Page<Recruiter> findByVerificationStatus(VerificationStatus status, Pageable pageable);

    Page<Recruiter> findByIsActive(Boolean isActive, Pageable pageable);
}

