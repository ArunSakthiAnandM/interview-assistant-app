package interview.organiser.repository;

import interview.organiser.constants.InvitationStatus;
import interview.organiser.model.entity.Invitation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Invitation entity
 */
@Repository
public interface InvitationRepository extends MongoRepository<Invitation, String> {

    Optional<Invitation> findById(String id);

    List<Invitation> findByEmailAndStatus(String email, InvitationStatus status);

    List<Invitation> findByOrganisationIdAndStatus(String organisationId, InvitationStatus status);

    Optional<Invitation> findByInterviewIdAndEmailAndStatus(String interviewId, String email, InvitationStatus status);

    Page<Invitation> findByOrganisationId(String organisationId, Pageable pageable);

    Page<Invitation> findByEmail(String email, Pageable pageable);

    Page<Invitation> findByStatus(InvitationStatus status, Pageable pageable);

    Page<Invitation> findByStatusAndOrganisationId(InvitationStatus status, String organisationId, Pageable pageable);
}

