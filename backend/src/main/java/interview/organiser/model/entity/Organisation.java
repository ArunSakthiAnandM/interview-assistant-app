package interview.organiser.model.entity;

import interview.organiser.constants.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing an Organisation
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "organisations")
public class Organisation {

    @Id
    private String id;

    @Indexed(unique = true)
    private String name;

    private String adminEmail;

    private String adminUserId;

    private String kycDocumentUrl;

    private VerificationStatus verificationStatus;

    private String verifiedBy;

    private LocalDateTime verifiedAt;

    private String rejectionReason;

    // Verification history
    @Builder.Default
    private List<VerificationHistory> verificationHistory = new ArrayList<>();

    // Soft delete
    private Boolean deleted;

    // Audit fields
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String createdBy;

    private String updatedBy;
}

