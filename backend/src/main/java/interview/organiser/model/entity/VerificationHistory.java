package interview.organiser.model.entity;

import interview.organiser.constants.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Embedded entity for organisation verification history
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerificationHistory {

    private VerificationStatus status;

    private String verifiedBy;

    private LocalDateTime verifiedAt;

    private String reason;  // Rejection reason or notes

    private String kycDocumentUrl;  // Document URL at the time of verification
}

