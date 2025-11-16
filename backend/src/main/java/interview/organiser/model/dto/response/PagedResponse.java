package interview.organiser.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Generic paginated response wrapper
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PagedResponse<T> {

    private List<T> content;
    private PaginationMetadata pagination;
}

