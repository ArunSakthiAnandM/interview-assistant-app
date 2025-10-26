# Controller Package - Agent Instructions

## Purpose
This package contains REST API controllers that handle HTTP requests and responses.

## Responsibilities
- Handle HTTP requests
- Validate request data
- Delegate business logic to services
- Return appropriate HTTP responses
- API documentation

## Naming Conventions
- Controllers should end with `Controller`
- Example: `InterviewController.java`, `CandidateController.java`, `HealthController.java`

## Annotations to Use
- `@RestController` - Marks class as REST controller
- `@RequestMapping` - Base path for controller (use `/api/v1/*`)
- `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`, `@PatchMapping`
- `@RequestBody` - For request payload
- `@PathVariable` - For URL path variables
- `@RequestParam` - For query parameters
- `@Valid` - For validation
- `@ResponseStatus` - Set HTTP status code

## Structure Guidelines
1. **Base Path**: All APIs should start with `/api/v1`
2. **RESTful Design**: Follow REST conventions
3. **Request/Response**: Use DTOs, never expose entities
4. **Validation**: Validate all inputs using `@Valid`
5. **Error Handling**: Let GlobalExceptionHandler handle errors

## HTTP Status Codes
- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Validation errors
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server errors

## Best Practices
- Keep controllers thin - only handle HTTP concerns
- Delegate business logic to services
- Use meaningful endpoint names
- Return consistent response formats
- Document APIs properly
- Use appropriate HTTP methods
- Handle exceptions properly

## Example Structure
```java
@RestController
@RequestMapping("/api/v1/interviews")
public class InterviewController {
    
    private final InterviewService interviewService;
    
    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }
    
    // Controller methods
}
```

