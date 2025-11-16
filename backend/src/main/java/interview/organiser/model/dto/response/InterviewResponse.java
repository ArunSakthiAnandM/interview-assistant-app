package interview.organiser.model.dto.response;

import interview.organiser.constants.CandidateStatus;
import interview.organiser.constants.InterviewStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for interview response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewResponse {

    private String id;
    private String organisationId;
    private String organisationName;
    private String jobPosition;
    private String jobDescription;
    private String candidateEmail;
    private String candidateUserId;
    private String candidateName;
    private CandidateStatus candidateStatus;
    private InterviewStatus overallStatus;
    private List<RoundResponse> rounds;
    private String createdByUserId;
    private String createdByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

