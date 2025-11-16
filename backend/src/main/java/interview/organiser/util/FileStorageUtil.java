package interview.organiser.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.UUID;

/**
 * Mock file storage utility for S3 operations
 * In production, this should integrate with actual AWS S3
 */
@Slf4j
@Component
public class FileStorageUtil {

    /**
     * Mock upload file to S3 and return URL
     * In production, implement actual S3 upload logic
     */
    public String uploadFile(String base64Content, String fileType) {
        if (base64Content == null || base64Content.isEmpty()) {
            return null;
        }

        // Mock implementation
        String fileName = UUID.randomUUID().toString() + getFileExtension(fileType);
        String mockS3Url = "https://mock-s3-bucket.s3.amazonaws.com/" + fileName;

        log.info("Mock S3 upload: {} (size: {} bytes)", fileName, base64Content.length());

        return mockS3Url;
    }

    /**
     * Get file extension based on file type
     */
    private String getFileExtension(String fileType) {
        if (fileType == null) {
            return ".pdf";
        }

        return switch (fileType.toLowerCase()) {
            case "kyc", "document" -> ".pdf";
            case "resume" -> ".pdf";
            case "image" -> ".jpg";
            default -> ".pdf";
        };
    }

    /**
     * Mock delete file from S3
     */
    public void deleteFile(String fileUrl) {
        if (fileUrl != null && !fileUrl.isEmpty()) {
            log.info("Mock S3 delete: {}", fileUrl);
        }
    }

    /**
     * Validate base64 content
     */
    public boolean isValidBase64(String base64Content) {
        if (base64Content == null || base64Content.isEmpty()) {
            return false;
        }

        try {
            Base64.getDecoder().decode(base64Content);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}
