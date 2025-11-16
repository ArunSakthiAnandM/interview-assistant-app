package interview.organiser.model.dto.request;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for user profile update request
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {

    private String name;

    @Pattern(regexp = "^[0-9]{10,15}$", message = "Invalid phone number format")
    private String phoneNumber;

    private String address;
    private String skills;
    private String experience;
    private String expertise;
    private Integer yearsOfExperience;
    private String specialization;
    private String resumeBase64;
    private Double expectedSalary;
}

