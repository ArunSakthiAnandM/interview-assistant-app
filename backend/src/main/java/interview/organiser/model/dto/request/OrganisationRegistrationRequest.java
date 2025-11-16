package interview.organiser.model.dto.request;

import interview.organiser.constants.AppConstants;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for organisation registration request
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganisationRegistrationRequest {

    @NotBlank(message = "Organisation name is required")
    private String organisationName;

    @NotBlank(message = "Admin name is required")
    private String adminName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Pattern(regexp = AppConstants.PASSWORD_PATTERN,
            message = "Password must be at least 8 characters with uppercase, lowercase, numbers and special characters")
    private String password;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = AppConstants.PHONE_PATTERN, message = "Invalid phone number format")
    private String phoneNumber;

    private String address;

    private String kycDocumentBase64; // Optional KYC document
}
