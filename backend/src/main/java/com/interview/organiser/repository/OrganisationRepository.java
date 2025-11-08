package com.interview.organiser.repository;

import com.interview.organiser.constants.enums.VerificationStatus;
import com.interview.organiser.model.entity.Organisation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrganisationRepository extends MongoRepository<Organisation, String> {

    Optional<Organisation> findByName(String name);

    Optional<Organisation> findByContactEmail(String contactEmail);

    Optional<Organisation> findByAdminUserId(String adminUserId);

    Page<Organisation> findByVerificationStatus(VerificationStatus status, Pageable pageable);

    Page<Organisation> findByIsActive(Boolean isActive, Pageable pageable);
}
