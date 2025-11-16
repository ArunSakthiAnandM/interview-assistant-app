package interview.organiser.repository;

import interview.organiser.model.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for Notification entity
 */
@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    Page<Notification> findByUserIdAndDeletedFalseOrderByCreatedAtDesc(String userId, Pageable pageable);

    Page<Notification> findByUserIdAndReadFalseAndDeletedFalseOrderByCreatedAtDesc(String userId, Pageable pageable);

    Long countByUserIdAndReadFalseAndDeletedFalse(String userId);

    List<Notification> findByReadTrueAndCreatedAtBefore(LocalDateTime cutoffDate);
}

