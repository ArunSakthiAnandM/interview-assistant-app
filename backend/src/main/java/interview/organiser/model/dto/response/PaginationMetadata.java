package interview.organiser.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for pagination metadata
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaginationMetadata {

    private Integer currentPage;
    private Integer pageSize;
    private Long totalElements;
    private Integer totalPages;
    private Boolean hasNext;
    private Boolean hasPrevious;
}

