package com.interview.organiser.model.entity;

import com.interview.organiser.constants.enums.CandidateStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "candidates")
public class Candidate {

    @Id
    private String id;

    private String firstName;

    private String lastName;

    @Indexed(unique = true)
    private String email;

    private String phone;

    private String position;

    private Double experience;

    private List<String> skills;

    private String resumeUrl;

    private String linkedinUrl;

    private String githubUrl;

    @Builder.Default
    private CandidateStatus status = CandidateStatus.APPLIED;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

