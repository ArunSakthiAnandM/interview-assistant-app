package interview.organiser.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for organisation update request
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganisationUpdateRequest {

    private String name;

    private String kycDocumentBase64;
}

