package interview.organiser.service;

import interview.organiser.constants.FileEntityType;
import interview.organiser.model.entity.FileMetadata;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Service interface for file storage operations
 */
public interface FileStorageService {

    /**
     * Upload file to S3 and store metadata
     */
    FileMetadata uploadFile(MultipartFile file, FileEntityType entityType, String entityId, String uploadedBy);

    /**
     * Upload file from base64 string
     */
    FileMetadata uploadFileFromBase64(String base64Content, String originalFileName,
                                      FileEntityType entityType, String entityId, String uploadedBy);

    /**
     * Get presigned URL for file preview (read access)
     */
    String getPresignedUrlForPreview(String fileId);

    /**
     * Get presigned URL for file download
     */
    String getPresignedUrlForDownload(String fileId);

    /**
     * Delete file from S3 and mark metadata as deleted
     */
    void deleteFile(String fileId);

    /**
     * Get file metadata by entity
     */
    FileMetadata getFileMetadataByEntity(String entityId, FileEntityType entityType);

    /**
     * Get all file versions for an entity (for future version support)
     */
    List<FileMetadata> getFileVersions(String entityId, FileEntityType entityType);
}

