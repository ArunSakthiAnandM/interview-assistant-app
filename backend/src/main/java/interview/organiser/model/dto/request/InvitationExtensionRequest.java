package interview.organiser.model.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for extending invitation expiry
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvitationExtensionRequest {

    @NotNull(message = "Additional days is required")
    @Min(value = 1, message = "Additional days must be at least 1")
    private Integer additionalDays;
}

