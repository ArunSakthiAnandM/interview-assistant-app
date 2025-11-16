package interview.organiser.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for file metadata response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileMetadataResponse {

    private String id;
    private String originalFileName;
    private Long fileSize;
    private String contentType;
    private String uploadedBy;
    private String uploadedByName;
    private LocalDateTime uploadedAt;
    private String previewUrl;
    private String downloadUrl;
}

