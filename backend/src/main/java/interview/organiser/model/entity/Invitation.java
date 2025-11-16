package interview.organiser.model.entity;

import interview.organiser.constants.InvitationStatus;
import interview.organiser.constants.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Entity representing an Invitation to join an organisation or interview
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "invitations")
public class Invitation {

    @Id
    private String id;

    private String email;

    private String organisationId;

    private String interviewId; // For candidate interview invitations

    private UserRole invitedRole; // RECRUITER, INTERVIEWER, or CANDIDATE

    private InvitationStatus status;

    private Integer expiryDays;

    private LocalDateTime expiryDate;

    private String invitedBy;

    private LocalDateTime acceptedAt;

    private LocalDateTime declinedAt;

    // Audit fields
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

