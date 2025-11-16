package interview.organiser.model.dto.response;

import interview.organiser.constants.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for verification history entry
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerificationHistoryResponse {

    private VerificationStatus status;
    private String verifiedBy;
    private String verifiedByName;
    private LocalDateTime verifiedAt;
    private String reason;
    private String kycDocumentUrl;
}

