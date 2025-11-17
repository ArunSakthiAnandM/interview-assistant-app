package interview.organiser.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for bulk invitation sending
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkInvitationResponse {

    private int sent;
    private List<FailedInvitation> failed;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FailedInvitation {
        private String email;
        private String reason;
    }
}
