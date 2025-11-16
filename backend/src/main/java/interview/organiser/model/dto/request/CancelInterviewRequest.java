package interview.organiser.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for canceling interview request
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CancelInterviewRequest {

    @NotBlank(message = "Cancellation reason is required")
    private String reason;
}
