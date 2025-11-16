package interview.organiser.model.dto.request;

import interview.organiser.constants.AppConstants;
import interview.organiser.constants.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for user registration request
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationRequest {

    @NotBlank(message = "Name is required")
    private String name;

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

    @NotNull(message = "Role is required")
    private UserRole role;

    // Optional fields
    private String address;
    private String skills;
    private String experience;
    private String expertise;
    private Integer yearsOfExperience;
    private String specialization;
    private String resumeBase64; // For CANDIDATE
    private Double expectedSalary;
}

