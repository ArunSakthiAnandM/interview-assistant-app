package interview.organiser.model.dto.response;

import interview.organiser.constants.InvitationStatus;
import interview.organiser.constants.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for invitation response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvitationResponse {

    private String id;
    private String email;
    private String organisationId;
    private String organisationName;
    private String interviewId;
    private UserRole invitedRole;
    private InvitationStatus status;
    private Integer expiryDays;
    private LocalDateTime expiryDate;
    private String invitedBy;
    private LocalDateTime createdAt;
}

