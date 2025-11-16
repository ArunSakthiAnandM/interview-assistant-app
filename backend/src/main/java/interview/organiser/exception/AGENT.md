# Exception Package - Agent Instructions

## Purpose
This package contains custom exceptions and global exception handling for the application.

## Responsibilities
- Define custom business exceptions
- Global exception handling
- Error response formatting
- HTTP status code mapping

## Structure
```
exception/
├── GlobalExceptionHandler.java    - @ControllerAdvice handler
├── ResourceNotFoundException.java - Custom exceptions
├── BusinessException.java
├── ValidationException.java
└── ErrorResponse.java            - Standard error response format
```

## Custom Exceptions
Create specific exceptions for different scenarios:
- `ResourceNotFoundException` - Resource not found (404)
- `BusinessException` - Business rule violations (400)
- `DuplicateResourceException` - Duplicate data (409)
- `UnauthorizedException` - Authentication failures (401)
- `ForbiddenException` - Authorization failures (403)

## Global Exception Handler
Use `@ControllerAdvice` to handle exceptions globally:

```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
        ResourceNotFoundException ex) {
        ErrorResponse error = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.NOT_FOUND.value())
            .error("Not Found")
            .message(ex.getMessage())
            .build();
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
    
    // More exception handlers
}
```

## Error Response Format
Standardize error responses:

```java
@Data
@Builder
public class ErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
    private Map<String, String> validationErrors;
}
```

## Best Practices
1. **Specific Exceptions**: Create specific custom exceptions
2. **Meaningful Messages**: Provide clear error messages
3. **HTTP Status Codes**: Use appropriate status codes
4. **Consistent Format**: Use standard error response format
5. **Don't Expose Internals**: Don't leak stack traces to clients
6. **Logging**: Log errors appropriately
7. **Validation Errors**: Format validation errors clearly

## HTTP Status Code Guidelines
- `400 Bad Request` - Client errors, validation failures
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource doesn't exist
- `409 Conflict` - Duplicate resources, conflicts
- `500 Internal Server Error` - Unexpected server errors

## Example Custom Exception
```java
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s: '%s'", 
            resourceName, fieldName, fieldValue));
    }
}
```

## Validation Error Handling
Handle `MethodArgumentNotValidException` to return field-level validation errors:

```java
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<ErrorResponse> handleValidationErrors(
    MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult().getFieldErrors().forEach(error ->
        errors.put(error.getField(), error.getDefaultMessage())
    );
    // Build and return error response
}
```

