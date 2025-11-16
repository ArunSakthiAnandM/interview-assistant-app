package interview.organiser.model.dto.request;

import interview.organiser.constants.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for sending invitation to join organisation
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvitationRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotNull(message = "Role is required")
    private UserRole role;

    @Min(value = 1, message = "Expiry days must be at least 1")
    private Integer expiryDays;
}

