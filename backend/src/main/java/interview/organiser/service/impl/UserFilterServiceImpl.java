package interview.organiser.service.impl;

import interview.organiser.constants.UserRole;
import interview.organiser.model.dto.request.InterviewerFilterRequest;
import interview.organiser.model.dto.response.InterviewerMatchResponse;
import interview.organiser.model.dto.response.UserResponse;
import interview.organiser.model.entity.AvailabilitySlot;
import interview.organiser.model.entity.User;
import interview.organiser.repository.AvailabilitySlotRepository;
import interview.organiser.repository.UserRepository;
import interview.organiser.service.UserFilterService;
import interview.organiser.util.EntityMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of UserFilterService
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserFilterServiceImpl implements UserFilterService {

    private final UserRepository userRepository;
    private final AvailabilitySlotRepository availabilitySlotRepository;
    private final EntityMapper entityMapper;

    @Override
    public List<InterviewerMatchResponse> filterInterviewers(String organisationId, InterviewerFilterRequest request) {
        log.info("Filtering interviewers for organisation {} with criteria: {}", organisationId, request);

        // Get all interviewers from the organisation
        Page<User> interviewers = userRepository.findByOrganisationIdAndRoleAndDeletedFalse(
                organisationId, UserRole.INTERVIEWER, Pageable.unpaged());

        List<InterviewerMatchResponse> matches = new ArrayList<>();

        for (User interviewer : interviewers.getContent()) {
            int matchScore = calculateMatchScore(interviewer, request);

            if (matchScore > 0) {
                // Get available slots count if availability criteria provided
                int availableSlots = 0;
                if (request.getAvailabilityStartDate() != null && request.getAvailabilityEndDate() != null) {
                    List<AvailabilitySlot> slots = availabilitySlotRepository
                            .findByInterviewerIdAndBlockedFalseAndDeletedFalseAndStartDateTimeBetween(
                                    interviewer.getId(),
                                    request.getAvailabilityStartDate(),
                                    request.getAvailabilityEndDate());
                    availableSlots = slots.size();
                }

                InterviewerMatchResponse match = InterviewerMatchResponse.builder()
                        .id(interviewer.getId())
                        .name(interviewer.getName())
                        .email(interviewer.getEmail())
                        .expertise(interviewer.getExpertise())
                        .specialization(interviewer.getSpecialization())
                        .yearsOfExperience(interviewer.getYearsOfExperience())
                        .matchScore(matchScore)
                        .availableSlots(availableSlots)
                        .matchReason(buildMatchReason(interviewer, request))
                        .build();

                matches.add(match);
            }
        }

        // Sort by match score descending
        matches.sort((a, b) -> Integer.compare(b.getMatchScore(), a.getMatchScore()));

        return matches;
    }

    @Override
    public Page<?> searchUsers(String role, String organisationId, String name, String email,
                                String skills, Pageable pageable) {
        log.info("Searching users with criteria: role={}, org={}, name={}, email={}, skills={}",
                role, organisationId, name, email, skills);

        // Get all users (we'll filter in memory for simplicity - in production use MongoDB queries)
        List<User> allUsers = userRepository.findAll();

        List<User> filteredUsers = allUsers.stream()
                .filter(user -> user.getDeleted() == null || !user.getDeleted())
                .filter(user -> role == null || user.getRole().name().equalsIgnoreCase(role))
                .filter(user -> organisationId == null || (user.getOrganisationId() != null &&
                        user.getOrganisationId().equals(organisationId)))
                .filter(user -> name == null || (user.getName() != null &&
                        user.getName().toLowerCase().contains(name.toLowerCase())))
                .filter(user -> email == null || (user.getEmail() != null &&
                        user.getEmail().toLowerCase().contains(email.toLowerCase())))
                .filter(user -> skills == null || (user.getSkills() != null &&
                        user.getSkills().toLowerCase().contains(skills.toLowerCase())))
                .collect(Collectors.toList());

        // Paginate results
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filteredUsers.size());

        List<UserResponse> userResponses = filteredUsers.subList(start, end).stream()
                .map(entityMapper::toUserResponse)
                .collect(Collectors.toList());

        return new PageImpl<>(userResponses, pageable, filteredUsers.size());
    }

    // Helper methods

    private int calculateMatchScore(User interviewer, InterviewerFilterRequest request) {
        int score = 0;

        // Skills match (40 points max)
        if (request.getSkills() != null && !request.getSkills().isEmpty() && interviewer.getSkills() != null) {
            long matchingSkills = request.getSkills().stream()
                    .filter(skill -> interviewer.getSkills().toLowerCase().contains(skill.toLowerCase()))
                    .count();
            score += (int) ((matchingSkills / (double) request.getSkills().size()) * 40);
        }

        // Experience match (30 points max)
        if (interviewer.getYearsOfExperience() != null) {
            if (request.getMinExperience() != null && request.getMaxExperience() != null) {
                if (interviewer.getYearsOfExperience() >= request.getMinExperience() &&
                    interviewer.getYearsOfExperience() <= request.getMaxExperience()) {
                    score += 30;
                }
            } else if (request.getMinExperience() != null) {
                if (interviewer.getYearsOfExperience() >= request.getMinExperience()) {
                    score += 30;
                }
            }
        }

        // Specialization match (30 points max)
        if (request.getSpecialization() != null && interviewer.getSpecialization() != null) {
            if (interviewer.getSpecialization().toLowerCase().contains(request.getSpecialization().toLowerCase())) {
                score += 30;
            }
        }

        return score;
    }

    private String buildMatchReason(User interviewer, InterviewerFilterRequest request) {
        List<String> reasons = new ArrayList<>();

        if (request.getSkills() != null && !request.getSkills().isEmpty() && interviewer.getSkills() != null) {
            long matchingSkills = request.getSkills().stream()
                    .filter(skill -> interviewer.getSkills().toLowerCase().contains(skill.toLowerCase()))
                    .count();
            if (matchingSkills > 0) {
                reasons.add(matchingSkills + " matching skill(s)");
            }
        }

        if (interviewer.getYearsOfExperience() != null && request.getMinExperience() != null) {
            reasons.add(interviewer.getYearsOfExperience() + " years experience");
        }

        if (request.getSpecialization() != null && interviewer.getSpecialization() != null &&
            interviewer.getSpecialization().toLowerCase().contains(request.getSpecialization().toLowerCase())) {
            reasons.add("Specialization match: " + interviewer.getSpecialization());
        }

        return String.join(", ", reasons);
    }
}

