# Model Package - Agent Instructions

## Purpose
This package contains all data models used in the application.

## Structure
```
model/
├── entity/     - Database entities (MongoDB documents)
└── dto/        - Data Transfer Objects
    ├── request/   - Request DTOs
    └── response/  - Response DTOs
```

## Responsibilities
- Define data structures
- Data validation rules
- Data transformation contracts

## Sub-packages

### entity/
- MongoDB document classes
- Annotated with `@Document`
- Represent database collections
- Use Lombok for boilerplate reduction

### dto/
- Objects for API communication
- Separate request and response DTOs
- Never expose entities directly to clients
- Use validation annotations

## Best Practices
- Keep entities and DTOs separate
- Use meaningful property names
- Add validation annotations
- Use Lombok to reduce boilerplate
- Document complex structures
- Use appropriate data types
- Consider immutability where appropriate

## Common Annotations
- **Lombok**: `@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`
- **Validation**: `@NotNull`, `@NotBlank`, `@Email`, `@Size`, `@Pattern`
- **MongoDB**: `@Document`, `@Id`, `@Field`, `@Indexed`
- **Jackson**: `@JsonProperty`, `@JsonFormat`, `@JsonIgnore`

## Naming Conventions
- Entities: Plain names (e.g., `Interview.java`, `Candidate.java`)
- Request DTOs: `*RequestDTO.java` or `*Request.java`
- Response DTOs: `*ResponseDTO.java` or `*Response.java`

## Example Structures
Refer to entity/AGENT.md and dto/AGENT.md for detailed examples.

