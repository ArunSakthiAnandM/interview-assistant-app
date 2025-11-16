package interview.organiser.model.entity;

import interview.organiser.constants.FileEntityType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Entity representing file metadata stored in S3
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "file_metadata")
public class FileMetadata {

    @Id
    private String id;

    private String s3Key;  // S3 object key

    private String originalFileName;

    private Long fileSize;  // in bytes

    private String contentType;

    private FileEntityType entityType;

    @Indexed
    private String entityId;  // User ID, Organisation ID, etc.

    private String uploadedBy;

    private LocalDateTime uploadedAt;

    @Builder.Default
    private Boolean deleted = false;

    private LocalDateTime deletedAt;
}

