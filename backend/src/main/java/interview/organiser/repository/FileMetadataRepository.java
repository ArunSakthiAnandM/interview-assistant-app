package interview.organiser.repository;

import interview.organiser.constants.FileEntityType;
import interview.organiser.model.entity.FileMetadata;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for FileMetadata entity
 */
@Repository
public interface FileMetadataRepository extends MongoRepository<FileMetadata, String> {

    Optional<FileMetadata> findByEntityIdAndEntityTypeAndDeletedFalse(String entityId, FileEntityType entityType);

    List<FileMetadata> findByEntityIdAndEntityTypeAndDeletedFalseOrderByUploadedAtDesc(
            String entityId, FileEntityType entityType);

    Optional<FileMetadata> findByS3KeyAndDeletedFalse(String s3Key);
}

