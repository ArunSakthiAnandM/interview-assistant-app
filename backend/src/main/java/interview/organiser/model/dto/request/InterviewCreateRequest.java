package interview.organiser.model.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for creating interview
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewCreateRequest {

    @NotBlank(message = "Job position is required")
    private String jobPosition;

    private String jobDescription;

    @NotBlank(message = "Candidate email is required")
    @Email(message = "Invalid candidate email format")
    private String candidateEmail;

    @NotEmpty(message = "At least one round is required")
    @Valid
    private List<RoundRequest> rounds;
}

