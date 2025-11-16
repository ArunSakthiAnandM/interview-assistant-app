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
    
    List<Notification> findByUserIdAndDeletedFalseOrderByCreatedAtDesc(String userId);

    Page<Notification> findByUserIdAndReadFalseAndDeletedFalseOrderByCreatedAtDesc(String userId, Pageable pageable);
    
    List<Notification> findByUserIdAndReadFalseAndDeletedFalseOrderByCreatedAtDesc(String userId);

    Long countByUserIdAndReadFalseAndDeletedFalse(String userId);

    List<Notification> findByReadTrueAndCreatedAtBefore(LocalDateTime cutoffDate);
}

