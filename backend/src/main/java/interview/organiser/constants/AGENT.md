# Constants Package - Agent Instructions

## Purpose
This package contains application-wide constants, enums, and configuration values.

## Responsibilities
- Define constant values
- Application-wide enumerations
- API endpoints constants
- Status codes and messages
- Configuration keys

## Structure
```
constants/
├── AppConstants.java       - General application constants
├── ApiConstants.java       - API-related constants
├── ErrorMessages.java      - Error message constants
├── ValidationMessages.java - Validation message constants
└── enums/
    ├── InterviewStatus.java
    ├── UserRole.java
    └── ...
```

## Why Use Constants?
1. **Maintainability**: Change values in one place
2. **Consistency**: Ensure consistent values across application
3. **Type Safety**: Compile-time checking
4. **Readability**: Self-documenting code
5. **Refactoring**: Easier to update values

## Best Practices
1. **Organization**: Group related constants
2. **Naming**: Use UPPER_SNAKE_CASE for constants
3. **Access**: Make classes final with private constructor
4. **Documentation**: Document non-obvious constants
5. **Enums**: Use enums for fixed sets of values

## Example Constants Class
```java
public final class AppConstants {
    
    private AppConstants() {
        // Private constructor to prevent instantiation
    }
    
    // API Version
    public static final String API_VERSION = "v1";
    public static final String API_BASE_PATH = "/api/" + API_VERSION;
    
    // Pagination
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 100;
    public static final String DEFAULT_SORT_FIELD = "createdAt";
    
    // Date Formats
    public static final String DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";
    public static final String DATE_FORMAT = "yyyy-MM-dd";
    
    // Other constants
    public static final int MIN_PASSWORD_LENGTH = 8;
    public static final int MAX_NAME_LENGTH = 100;
}
```

## Example API Constants
```java
public final class ApiConstants {
    
    private ApiConstants() {}
    
    // Endpoints
    public static final String HEALTH_ENDPOINT = "/health";
    public static final String INTERVIEWS_ENDPOINT = "/interviews";
    public static final String CANDIDATES_ENDPOINT = "/candidates";
    
    // Headers
    public static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String CONTENT_TYPE_HEADER = "Content-Type";
    
    // Response Messages
    public static final String SUCCESS_MESSAGE = "Operation completed successfully";
    public static final String CREATED_MESSAGE = "Resource created successfully";
}
```

## Example Error Messages
```java
public final class ErrorMessages {
    
    private ErrorMessages() {}
    
    public static final String RESOURCE_NOT_FOUND = "Resource not found";
    public static final String INVALID_INPUT = "Invalid input provided";
    public static final String DUPLICATE_RESOURCE = "Resource already exists";
    public static final String UNAUTHORIZED_ACCESS = "Unauthorized access";
}
```

## Example Enum
```java
public enum InterviewStatus {
    SCHEDULED("Scheduled"),
    IN_PROGRESS("In Progress"),
    COMPLETED("Completed"),
    CANCELLED("Cancelled"),
    RESCHEDULED("Rescheduled");
    
    private final String displayName;
    
    InterviewStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
```

## Enums vs Constants
- **Use Enums**: For fixed set of related values (status, roles, types)
- **Use Constants**: For configuration values, messages, limits

