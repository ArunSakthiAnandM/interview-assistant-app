package com.interview.organiser.model.dto.response;

import com.interview.organiser.constants.enums.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecruiterResponse {

    private String id;

    private String name;

    private String registrationNumber;

    private AddressDTO address;

    private String contactEmail;

    private String contactPhone;

    private String website;

    private String description;

    private VerificationStatus verificationStatus;

    private String adminUserId;

    private Boolean isActive;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddressDTO {
        private String street;
        private String city;
        private String state;
        private String country;
        private String postalCode;
    }
}

