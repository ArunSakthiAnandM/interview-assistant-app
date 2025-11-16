package interview.organiser.model.entity;

import interview.organiser.constants.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Entity representing a User in the system
 * Single source of truth for authentication
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String name;

    private String phoneNumber;

    private String address;

    private UserRole role;

    // Additional profile fields
    private String skills;

    private String experience;

    // Role-specific fields for RECRUITER/INTERVIEWER
    private String expertise;

    private Integer yearsOfExperience;

    private String specialization;

    // Role-specific fields for CANDIDATE
    private String resumeUrl;

    private Double expectedSalary;

    // Organisation reference (for RECRUITER, INTERVIEWER, ORGANISATION_ADMIN)
    private String organisationId;

    // Active refresh token (for single session management)
    private String refreshToken;

    private LocalDateTime refreshTokenExpiryDate;

    // Password reset
    private String resetToken;

    private LocalDateTime resetTokenExpiryDate;

    // Soft delete
    private Boolean deleted;

    // Audit fields
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String createdBy;

    private String updatedBy;
}

