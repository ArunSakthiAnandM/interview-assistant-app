package interview.organiser.repository;

import interview.organiser.constants.VerificationStatus;
import interview.organiser.model.entity.Organisation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for Organisation entity
 */
@Repository
public interface OrganisationRepository extends MongoRepository<Organisation, String> {

    Optional<Organisation> findByIdAndDeletedFalse(String id);

    Optional<Organisation> findByNameAndDeletedFalse(String name);

    Optional<Organisation> findByAdminUserIdAndDeletedFalse(String adminUserId);

    Boolean existsByNameAndDeletedFalse(String name);

    Page<Organisation> findByDeletedFalse(Pageable pageable);

    Page<Organisation> findByVerificationStatusAndDeletedFalse(VerificationStatus status, Pageable pageable);

    Long countByVerificationStatusAndDeletedFalse(VerificationStatus status);

    Long countByDeletedFalse();
}

