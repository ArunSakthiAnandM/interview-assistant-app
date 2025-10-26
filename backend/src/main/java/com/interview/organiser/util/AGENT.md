# Util Package - Agent Instructions

## Purpose
This package contains utility classes and helper methods used across the application.

## Responsibilities
- Reusable helper methods
- Common transformations
- Formatting utilities
- Validation helpers
- Date/time utilities
- String manipulation

## Naming Conventions
- Utility classes should end with `Util` or `Utils`
- Example: `DateUtil.java`, `ValidationUtils.java`, `StringUtils.java`

## Structure
```
util/
├── DateTimeUtil.java      - Date/time helper methods
├── ValidationUtil.java    - Validation helper methods
├── StringUtil.java        - String manipulation
├── MapperUtil.java        - Object mapping utilities
└── CodeGeneratorUtil.java - Code/ID generation
```

## Best Practices
1. **Static Methods**: Utility methods should be static
2. **No State**: Utility classes should be stateless
3. **Private Constructor**: Prevent instantiation
4. **Final Class**: Make utility classes final
5. **Single Purpose**: Each utility class should have one clear purpose
6. **Documentation**: Document complex utility methods
7. **Testing**: Write unit tests for all utilities

## Example Utility Class
```java
public final class DateTimeUtil {
    
    private DateTimeUtil() {
        // Private constructor to prevent instantiation
    }
    
    /**
     * Formats a LocalDateTime to ISO format string
     */
    public static String formatToIso(LocalDateTime dateTime) {
        if (dateTime == null) return null;
        return dateTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }
    
    /**
     * Parses ISO format string to LocalDateTime
     */
    public static LocalDateTime parseFromIso(String dateTimeString) {
        if (dateTimeString == null || dateTimeString.isBlank()) return null;
        return LocalDateTime.parse(dateTimeString, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }
    
    /**
     * Checks if a date is in the future
     */
    public static boolean isFutureDate(LocalDateTime dateTime) {
        return dateTime != null && dateTime.isAfter(LocalDateTime.now());
    }
}
```

## Example Validation Utility
```java
public final class ValidationUtil {
    
    private ValidationUtil() {}
    
    public static boolean isValidEmail(String email) {
        if (email == null || email.isBlank()) return false;
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        return email.matches(emailRegex);
    }
    
    public static boolean isValidPhoneNumber(String phone) {
        if (phone == null || phone.isBlank()) return false;
        return phone.matches("^\\+?[1-9]\\d{1,14}$");
    }
}
```

## Example Code Generator
```java
public final class CodeGeneratorUtil {
    
    private CodeGeneratorUtil() {}
    
    private static final Random RANDOM = new Random();
    
    public static String generateInterviewCode() {
        String prefix = "INT";
        long timestamp = System.currentTimeMillis();
        int randomNum = RANDOM.nextInt(9999);
        return String.format("%s-%d-%04d", prefix, timestamp, randomNum);
    }
    
    public static String generateUniqueId() {
        return UUID.randomUUID().toString();
    }
}
```

## Common Utility Types
1. **DateTimeUtil** - Date formatting, parsing, calculations
2. **StringUtil** - String manipulation, formatting
3. **ValidationUtil** - Common validation logic
4. **MapperUtil** - Object mapping (Entity ↔ DTO)
5. **EncryptionUtil** - Encryption/decryption helpers
6. **FileUtil** - File operations
7. **JsonUtil** - JSON serialization/deserialization

## When NOT to Use Utils
- Don't use utils for business logic (use services)
- Don't use utils for Spring-managed beans
- Avoid god classes with unrelated methods

