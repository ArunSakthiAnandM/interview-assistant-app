package com.interview.organiser.model.entity;

import com.interview.organiser.constants.enums.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "organisations")
public class Organisation {

    @Id
    private String id;

    @Indexed(unique = true)
    private String name;

    private String registrationNumber;

    private Address address;

    @Indexed(unique = true)
    private String contactEmail;

    private String contactPhone;

    private String website;

    private String description;

    @Builder.Default
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    private String adminUserId;

    @Builder.Default
    private Boolean isActive = true;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Address {
        private String street;
        private String city;
        private String state;
        private String country;
        private String postalCode;
    }
}
