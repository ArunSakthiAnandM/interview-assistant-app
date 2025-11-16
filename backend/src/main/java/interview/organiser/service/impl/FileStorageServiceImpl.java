package interview.organiser.service.impl;

import interview.organiser.config.AwsS3ConfigProperties;
import interview.organiser.constants.FileEntityType;
import interview.organiser.exception.InvalidOperationException;
import interview.organiser.exception.ResourceNotFoundException;
import interview.organiser.model.entity.FileMetadata;
import interview.organiser.repository.FileMetadataRepository;
import interview.organiser.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

/**
 * AWS S3 implementation of FileStorageService
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FileStorageServiceImpl implements FileStorageService {

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;
    private final AwsS3ConfigProperties s3ConfigProperties;
    private final FileMetadataRepository fileMetadataRepository;

    @Override
    public FileMetadata uploadFile(MultipartFile file, FileEntityType entityType, String entityId, String uploadedBy) {
        try {
            log.info("Uploading file {} for entity {} of type {}", file.getOriginalFilename(), entityId, entityType);

            // Generate unique S3 key
            String s3Key = generateS3Key(entityType, entityId, file.getOriginalFilename());

            // Upload to S3
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(s3ConfigProperties.getBucketName())
                    .key(s3Key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            // Delete old file if exists (keep only latest version)
            fileMetadataRepository.findByEntityIdAndEntityTypeAndDeletedFalse(entityId, entityType)
                    .ifPresent(oldFile -> {
                        oldFile.setDeleted(true);
                        oldFile.setDeletedAt(LocalDateTime.now());
                        fileMetadataRepository.save(oldFile);
                        // Delete from S3
                        deleteFromS3(oldFile.getS3Key());
                    });

            // Save metadata
            FileMetadata metadata = FileMetadata.builder()
                    .s3Key(s3Key)
                    .originalFileName(file.getOriginalFilename())
                    .fileSize(file.getSize())
                    .contentType(file.getContentType())
                    .entityType(entityType)
                    .entityId(entityId)
                    .uploadedBy(uploadedBy)
                    .uploadedAt(LocalDateTime.now())
                    .deleted(false)
                    .build();

            return fileMetadataRepository.save(metadata);

        } catch (IOException e) {
            log.error("Error uploading file to S3", e);
            throw new InvalidOperationException("Failed to upload file: " + e.getMessage());
        }
    }

    @Override
    public FileMetadata uploadFileFromBase64(String base64Content, String originalFileName,
                                             FileEntityType entityType, String entityId, String uploadedBy) {
        try {
            log.info("Uploading base64 file {} for entity {} of type {}", originalFileName, entityId, entityType);

            // Decode base64
            byte[] fileBytes = Base64.getDecoder().decode(base64Content);

            // Generate unique S3 key
            String s3Key = generateS3Key(entityType, entityId, originalFileName);

            // Upload to S3
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(s3ConfigProperties.getBucketName())
                    .key(s3Key)
                    .contentType(detectContentType(originalFileName))
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(fileBytes));

            // Delete old file if exists (keep only latest version)
            fileMetadataRepository.findByEntityIdAndEntityTypeAndDeletedFalse(entityId, entityType)
                    .ifPresent(oldFile -> {
                        oldFile.setDeleted(true);
                        oldFile.setDeletedAt(LocalDateTime.now());
                        fileMetadataRepository.save(oldFile);
                        // Delete from S3
                        deleteFromS3(oldFile.getS3Key());
                    });

            // Save metadata
            FileMetadata metadata = FileMetadata.builder()
                    .s3Key(s3Key)
                    .originalFileName(originalFileName)
                    .fileSize((long) fileBytes.length)
                    .contentType(detectContentType(originalFileName))
                    .entityType(entityType)
                    .entityId(entityId)
                    .uploadedBy(uploadedBy)
                    .uploadedAt(LocalDateTime.now())
                    .deleted(false)
                    .build();

            return fileMetadataRepository.save(metadata);

        } catch (Exception e) {
            log.error("Error uploading base64 file to S3", e);
            throw new InvalidOperationException("Failed to upload file: " + e.getMessage());
        }
    }

    @Override
    public String getPresignedUrlForPreview(String fileId) {
        FileMetadata metadata = fileMetadataRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found with ID: " + fileId));

        if (metadata.getDeleted()) {
            throw new InvalidOperationException("File has been deleted");
        }

        return generatePresignedUrl(metadata.getS3Key(), false);
    }

    @Override
    public String getPresignedUrlForDownload(String fileId) {
        FileMetadata metadata = fileMetadataRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found with ID: " + fileId));

        if (metadata.getDeleted()) {
            throw new InvalidOperationException("File has been deleted");
        }

        return generatePresignedUrl(metadata.getS3Key(), true);
    }

    @Override
    public void deleteFile(String fileId) {
        FileMetadata metadata = fileMetadataRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found with ID: " + fileId));

        // Soft delete metadata
        metadata.setDeleted(true);
        metadata.setDeletedAt(LocalDateTime.now());
        fileMetadataRepository.save(metadata);

        // Delete from S3
        deleteFromS3(metadata.getS3Key());

        log.info("Deleted file {} from S3", metadata.getS3Key());
    }

    @Override
    public FileMetadata getFileMetadataByEntity(String entityId, FileEntityType entityType) {
        return fileMetadataRepository.findByEntityIdAndEntityTypeAndDeletedFalse(entityId, entityType)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No file found for entity " + entityId + " of type " + entityType));
    }

    @Override
    public List<FileMetadata> getFileVersions(String entityId, FileEntityType entityType) {
        return fileMetadataRepository.findByEntityIdAndEntityTypeAndDeletedFalseOrderByUploadedAtDesc(entityId, entityType);
    }

    // Helper methods

    private String generateS3Key(FileEntityType entityType, String entityId, String originalFileName) {
        String fileExtension = getFileExtension(originalFileName);
        String uniqueId = UUID.randomUUID().toString();
        return String.format("%s/%s/%s%s", entityType.name().toLowerCase(), entityId, uniqueId, fileExtension);
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }

    private String detectContentType(String fileName) {
        String extension = getFileExtension(fileName).toLowerCase();
        return switch (extension) {
            case ".pdf" -> "application/pdf";
            case ".doc" -> "application/msword";
            case ".docx" -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case ".jpg", ".jpeg" -> "image/jpeg";
            case ".png" -> "image/png";
            default -> "application/octet-stream";
        };
    }

    private String generatePresignedUrl(String s3Key, boolean forDownload) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(s3ConfigProperties.getBucketName())
                .key(s3Key)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofSeconds(s3ConfigProperties.getPresignedUrlExpiration()))
                .getObjectRequest(getObjectRequest)
                .build();

        PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(presignRequest);
        return presignedRequest.url().toString();
    }

    private void deleteFromS3(String s3Key) {
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(s3ConfigProperties.getBucketName())
                    .key(s3Key)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);
        } catch (Exception e) {
            log.error("Error deleting file from S3: {}", s3Key, e);
            // Don't throw exception, just log - metadata is already marked as deleted
        }
    }
}

