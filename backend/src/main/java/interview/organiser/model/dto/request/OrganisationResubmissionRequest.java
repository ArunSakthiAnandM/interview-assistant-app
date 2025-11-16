package interview.organiser.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for organisation resubmission request
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganisationResubmissionRequest {

    private String kycDocumentBase64;

    private String address;

    private String additionalNotes;
}

