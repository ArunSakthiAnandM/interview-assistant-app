package interview.organiser.model.entity;

import interview.organiser.constants.CandidateStatus;
import interview.organiser.constants.InterviewStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Entity representing an Interview
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "interviews")
public class Interview {

    @Id
    private String id;

    private String organisationId;

    private String jobPosition;

    private String jobDescription;

    private String candidateEmail;

    private String candidateUserId;

    private CandidateStatus candidateStatus;

    private InterviewStatus overallStatus;

    private List<InterviewRound> rounds;

    private String createdByUserId;

    private String createdByName;

    // Soft delete
    private Boolean deleted;

    // Audit fields
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String updatedBy;
}

