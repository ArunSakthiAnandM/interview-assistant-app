package interview.organiser.model.dto.request;

import interview.organiser.constants.AppConstants;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for reset password request
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordRequest {

    @NotBlank(message = "Reset token is required")
    private String resetToken;

    @NotBlank(message = "New password is required")
    @Pattern(regexp = AppConstants.PASSWORD_PATTERN,
             message = "Password must be at least 8 characters with uppercase, lowercase, numbers and special characters")
    private String newPassword;
}

