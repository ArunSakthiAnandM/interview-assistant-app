package interview.organiser.service;

import interview.organiser.model.dto.request.InterviewerFilterRequest;
import interview.organiser.model.dto.response.InterviewerMatchResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Service interface for user filtering and search operations
 */
public interface UserFilterService {

    /**
     * Filter interviewers by skills, experience, and availability
     */
    List<InterviewerMatchResponse> filterInterviewers(String organisationId, InterviewerFilterRequest request);

    /**
     * Search users by various criteria
     */
    Page<?> searchUsers(String role, String organisationId, String name, String email,
                        String skills, Pageable pageable);
}

