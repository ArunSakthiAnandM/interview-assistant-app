package interview.organiser.repository;

import interview.organiser.constants.UserRole;
import interview.organiser.model.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for User entity
 */
@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmailAndDeletedFalse(String email);

    Optional<User> findByIdAndDeletedFalse(String id);

    Optional<User> findByRefreshToken(String refreshToken);

    Optional<User> findByResetToken(String resetToken);

    Boolean existsByEmailAndDeletedFalse(String email);

    Page<User> findByDeletedFalse(Pageable pageable);

    Page<User> findByRoleAndDeletedFalse(UserRole role, Pageable pageable);

    Page<User> findByOrganisationIdAndDeletedFalse(String organisationId, Pageable pageable);

    Page<User> findByOrganisationIdAndRoleAndDeletedFalse(String organisationId, UserRole role, Pageable pageable);

    Long countByRoleAndDeletedFalse(UserRole role);

    Long countByOrganisationIdAndRoleAndDeletedFalse(String organisationId, UserRole role);
}

