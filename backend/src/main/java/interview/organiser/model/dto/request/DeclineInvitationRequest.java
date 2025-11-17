package interview.organiser.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for declining invitation with optional reason
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeclineInvitationRequest {
    
    private String reason;
}
