package interview.organiser.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for interviewer basic info
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewerInfo {

    private String id;
    private String name;
    private String email;
    private String expertise;
}

