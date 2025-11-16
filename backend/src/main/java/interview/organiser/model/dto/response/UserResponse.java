package interview.organiser.model.dto.response;

import interview.organiser.constants.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for user response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private String id;
    private String email;
    private String name;
    private String phoneNumber;
    private String address;
    private UserRole role;
    private String skills;
    private String experience;
    private String expertise;
    private Integer yearsOfExperience;
    private String specialization;
    private String resumeUrl;
    private Double expectedSalary;
    private String organisationId;
    private String organisationName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

