package interview.organiser.model.dto.request;

import interview.organiser.constants.VerificationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for organisation verification request
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganisationVerificationRequest {

    @NotNull(message = "Verification status is required")
    private VerificationStatus status;

    private String rejectionReason;
}

