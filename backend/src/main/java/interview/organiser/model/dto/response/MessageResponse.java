package interview.organiser.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Generic API response wrapper for success messages
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {

    private String message;
}

