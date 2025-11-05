package com.interview.organiser.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "interviewers")
public class Interviewer {

    @Id
    private String id;

    @DBRef
    private User user;

    private String department;

    private List<String> expertise;

    private Integer yearsOfExperience;

    @Builder.Default
    private Boolean availability = true;

    @Builder.Default
    private Integer totalInterviews = 0;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

