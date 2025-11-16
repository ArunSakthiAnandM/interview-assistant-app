package interview.organiser.model.dto.response;

import interview.organiser.constants.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for organisation response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganisationResponse {

    private String id;
    private String name;
    private String adminEmail;
    private String adminUserId;
    private String kycDocumentUrl;
    private VerificationStatus verificationStatus;
    private String verifiedBy;
    private LocalDateTime verifiedAt;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

