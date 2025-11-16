package interview.organiser.controller;

import interview.organiser.constants.FileEntityType;
import interview.organiser.model.dto.response.FileMetadataResponse;
import interview.organiser.model.dto.response.MessageResponse;
import interview.organiser.model.entity.FileMetadata;
import interview.organiser.model.entity.User;
import interview.organiser.repository.UserRepository;
import interview.organiser.service.FileStorageService;
import interview.organiser.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

/**
 * REST Controller for file storage operations
 */
@Slf4j
@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;

    /**
     * Upload file
     */
    @PostMapping("/upload")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<FileMetadataResponse> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("entityType") FileEntityType entityType,
            @RequestParam("entityId") String entityId) {
        log.info("Upload file request: {} for entity {} of type {}",
                file.getOriginalFilename(), entityId, entityType);

        String uploadedBy = SecurityUtil.getCurrentUserId();
        FileMetadata metadata = fileStorageService.uploadFile(file, entityType, entityId, uploadedBy);

        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(metadata));
    }

    /**
     * Get presigned URL for file preview
     */
    @GetMapping("/preview/{fileId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<FileMetadataResponse> getFilePreviewUrl(@PathVariable String fileId) {
        log.info("Get file preview URL request: {}", fileId);

        String previewUrl = fileStorageService.getPresignedUrlForPreview(fileId);
        FileMetadata metadata = fileStorageService.getFileMetadataByEntity(fileId, null); // Get by ID

        FileMetadataResponse response = mapToResponse(metadata);
        response.setPreviewUrl(previewUrl);

        return ResponseEntity.ok(response);
    }

    /**
     * Get presigned URL for file download
     */
    @GetMapping("/download/{fileId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<FileMetadataResponse> getFileDownloadUrl(@PathVariable String fileId) {
        log.info("Get file download URL request: {}", fileId);

        String downloadUrl = fileStorageService.getPresignedUrlForDownload(fileId);
        FileMetadata metadata = fileStorageService.getFileMetadataByEntity(fileId, null); // Get by ID

        FileMetadataResponse response = mapToResponse(metadata);
        response.setDownloadUrl(downloadUrl);

        return ResponseEntity.ok(response);
    }

    /**
     * Get file versions for an entity
     */
    @GetMapping("/versions/{entityType}/{entityId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<FileMetadataResponse>> getFileVersions(
            @PathVariable FileEntityType entityType,
            @PathVariable String entityId) {
        log.info("Get file versions request for entity {} of type {}", entityId, entityType);

        List<FileMetadata> versions = fileStorageService.getFileVersions(entityId, entityType);
        List<FileMetadataResponse> response = versions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * Delete file
     */
    @DeleteMapping("/{fileId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> deleteFile(@PathVariable String fileId) {
        log.info("Delete file request: {}", fileId);

        fileStorageService.deleteFile(fileId);

        return ResponseEntity.ok(MessageResponse.builder()
                .message("File deleted successfully")
                .build());
    }

    // Helper method
    private FileMetadataResponse mapToResponse(FileMetadata metadata) {
        User uploader = metadata.getUploadedBy() != null ?
                userRepository.findById(metadata.getUploadedBy()).orElse(null) : null;

        return FileMetadataResponse.builder()
                .id(metadata.getId())
                .originalFileName(metadata.getOriginalFileName())
                .fileSize(metadata.getFileSize())
                .contentType(metadata.getContentType())
                .uploadedBy(metadata.getUploadedBy())
                .uploadedByName(uploader != null ? uploader.getName() : null)
                .uploadedAt(metadata.getUploadedAt())
                .build();
    }
}

