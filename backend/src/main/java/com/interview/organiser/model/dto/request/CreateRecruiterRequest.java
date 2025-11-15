package com.interview.organiser.model.dto.request;

import com.interview.organiser.model.entity.Recruiter;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateRecruiterRequest {

    @NotBlank(message = "Recruiter name is required")
    private String name;

    private String registrationNumber;

    @Valid
    private AddressDTO address;

    @NotBlank(message = "Contact email is required")
    @Email(message = "Invalid email format")
    private String contactEmail;

    @NotBlank(message = "Contact phone is required")
    private String contactPhone;

    private String website;

    private String description;

    // Admin user credentials
    @NotBlank(message = "Admin first name is required")
    private String adminFirstName;

    @NotBlank(message = "Admin last name is required")
    private String adminLastName;

    @NotBlank(message = "Admin email is required")
    @Email(message = "Invalid admin email format")
    private String adminEmail;

    @NotBlank(message = "Admin password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String adminPassword;

    private String adminPhone;

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

        public Recruiter.Address toEntity() {
            return Recruiter.Address.builder()
                    .street(street)
                    .city(city)
                    .state(state)
                    .country(country)
                    .postalCode(postalCode)
                    .build();
        }
    }
}
