package com.interview.organiser.model.dto.request;

import com.interview.organiser.model.entity.Organisation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrganisationRequest {

    @NotBlank(message = "Organisation name is required")
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

        public Organisation.Address toEntity() {
            return Organisation.Address.builder()
                    .street(street)
                    .city(city)
                    .state(state)
                    .country(country)
                    .postalCode(postalCode)
                    .build();
        }
    }
}
