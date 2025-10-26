# Service Package - Agent Instructions

## Purpose
This package contains the business logic layer of the application.

## Responsibilities
- Implement business logic and rules
- Orchestrate operations between multiple repositories
- Transaction management
- Data transformation between entities and DTOs
- Business validations

## Naming Conventions
- Service interfaces: `*Service.java`
- Service implementations: `*ServiceImpl.java`
- Example: `InterviewService.java`, `InterviewServiceImpl.java`

## Structure
```
service/
├── InterviewService.java           (interface)
├── impl/
│   └── InterviewServiceImpl.java   (implementation)
```

## Annotations to Use
- `@Service` - Marks implementation class as service
- `@Transactional` - For transaction management
- `@Validated` - For method-level validation

## Design Principles
1. **Interface-Based Design**: Always define an interface and implementation
2. **Single Responsibility**: Each service should have one clear purpose
3. **Dependency Injection**: Use constructor injection
4. **Error Handling**: Throw custom exceptions for business errors
5. **Logging**: Log important operations and errors

## Best Practices
- Define interfaces for all services
- Keep services focused and cohesive
- Use DTOs for data transfer
- Don't expose repositories to controllers
- Handle transactions appropriately
- Use meaningful method names
- Document complex business logic
- Write unit tests for all business logic

## Example Structure
```java
// Interface
public interface InterviewService {
    InterviewResponseDTO createInterview(InterviewRequestDTO request);
    // Other methods
}

// Implementation
@Service
@Transactional
public class InterviewServiceImpl implements InterviewService {
    
    private final InterviewRepository interviewRepository;
    
    public InterviewServiceImpl(InterviewRepository interviewRepository) {
        this.interviewRepository = interviewRepository;
    }
    
    @Override
    public InterviewResponseDTO createInterview(InterviewRequestDTO request) {
        // Business logic
    }
}
```

## Transaction Guidelines
- Use `@Transactional` for operations that modify data
- Read-only operations: `@Transactional(readOnly = true)`
- Be careful with transaction boundaries
- Handle exceptions to ensure proper rollback

