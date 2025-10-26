# DTO Package - Agent Instructions

## Purpose
This package contains Data Transfer Objects for API communication.

## Structure
```
dto/
├── request/   - Request DTOs (client to server)
└── response/  - Response DTOs (server to client)
```

## Responsibilities
- Define API contracts
- Input validation
- Data transformation layer
- Decouple API from database schema

## Why DTOs?
1. **Security**: Don't expose entity structure
2. **Flexibility**: API can differ from database schema
3. **Validation**: Apply input validation rules
4. **Versioning**: Easier API version management
5. **Documentation**: Clear API contracts

## Naming Conventions
- Request DTOs: `*RequestDTO.java` or `Create*Request.java`, `Update*Request.java`
- Response DTOs: `*ResponseDTO.java` or `*Response.java`

## Annotations to Use
- **Validation**: `@NotNull`, `@NotBlank`, `@Email`, `@Size`, `@Min`, `@Max`, `@Pattern`, `@Valid`
- **Jackson**: `@JsonProperty`, `@JsonFormat`, `@JsonIgnore`, `@JsonInclude`
- **Lombok**: `@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`

## Best Practices
1. **Separation**: Always separate request and response DTOs
2. **Validation**: Apply validation on request DTOs
3. **Immutability**: Consider making response DTOs immutable
4. **Documentation**: Add JavaDoc for complex fields
5. **Nested DTOs**: Use composition for complex structures
6. **Null Handling**: Use `@JsonInclude` to handle nulls

## Example Request DTO
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateInterviewRequestDTO {
    
    @NotBlank(message = "Candidate name is required")
    @Size(max = 100, message = "Candidate name must not exceed 100 characters")
    private String candidateName;
    
    @NotBlank(message = "Position is required")
    private String position;
    
    @NotNull(message = "Scheduled date is required")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime scheduledDate;
    
    @Email(message = "Invalid email format")
    private String email;
}
```

## Example Response DTO
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewResponseDTO {
    
    private String id;
    private String interviewCode;
    private String candidateName;
    private String position;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime scheduledDate;
    
    private String status;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
}
```

## Validation Messages
- Provide clear, user-friendly validation messages
- Use constants for reusable validation messages
- Localize messages when needed

