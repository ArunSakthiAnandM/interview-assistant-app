# Validation Package - Agent Instructions

## Purpose
This package contains custom validators and validation logic beyond standard Bean Validation annotations.

## Responsibilities
- Custom validation annotations
- Complex validation logic
- Cross-field validation
- Business rule validation

## Structure
```
validation/
├── annotations/
│   ├── ValidDate.java           - Custom date validator
│   ├── ValidPhoneNumber.java    - Phone number validator
│   └── UniqueEmail.java         - Uniqueness validator
└── validators/
    ├── DateValidator.java       - Date validation logic
    ├── PhoneNumberValidator.java
    └── EmailUniquenessValidator.java
```

## When to Use Custom Validators
- Complex validation rules
- Cross-field validation
- Database-dependent validation (uniqueness checks)
- Custom business rules
- Validation requiring external services

## Creating Custom Validator

### 1. Create Annotation
```java
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = DateValidator.class)
@Documented
public @interface ValidDate {
    
    String message() default "Invalid date";
    
    Class<?>[] groups() default {};
    
    Class<? extends Payload>[] payload() default {};
    
    boolean allowPast() default false;
    
    boolean allowFuture() default true;
}
```

### 2. Create Validator Implementation
```java
public class DateValidator implements ConstraintValidator<ValidDate, LocalDateTime> {
    
    private boolean allowPast;
    private boolean allowFuture;
    
    @Override
    public void initialize(ValidDate annotation) {
        this.allowPast = annotation.allowPast();
        this.allowFuture = annotation.allowFuture();
    }
    
    @Override
    public boolean isValid(LocalDateTime value, ConstraintValidatorContext context) {
        if (value == null) return true; // Use @NotNull separately
        
        LocalDateTime now = LocalDateTime.now();
        
        if (!allowPast && value.isBefore(now)) {
            return false;
        }
        
        if (!allowFuture && value.isAfter(now)) {
            return false;
        }
        
        return true;
    }
}
```

### 3. Use in DTO
```java
@Data
public class CreateInterviewRequestDTO {
    
    @NotNull(message = "Scheduled date is required")
    @ValidDate(allowPast = false, message = "Interview date must be in the future")
    private LocalDateTime scheduledDate;
}
```

## Best Practices
1. **Separation of Concerns**: Keep validation logic separate
2. **Reusability**: Create reusable validators
3. **Clear Messages**: Provide meaningful error messages
4. **Null Handling**: Handle null values appropriately
5. **Performance**: Optimize database-dependent validators
6. **Testing**: Write unit tests for validators

## Common Custom Validators
1. **Date Validators**: Future dates, date ranges
2. **Uniqueness Validators**: Email, username uniqueness
3. **Format Validators**: Phone numbers, postal codes
4. **Business Rule Validators**: Complex business constraints
5. **Cross-Field Validators**: Field interdependencies

## Cross-Field Validation Example
```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = DateRangeValidator.class)
public @interface ValidDateRange {
    String message() default "End date must be after start date";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

public class DateRangeValidator implements ConstraintValidator<ValidDateRange, InterviewDTO> {
    
    @Override
    public boolean isValid(InterviewDTO dto, ConstraintValidatorContext context) {
        if (dto.getStartDate() == null || dto.getEndDate() == null) {
            return true;
        }
        return dto.getEndDate().isAfter(dto.getStartDate());
    }
}
```

## Validation Groups
Use validation groups for different scenarios:
```java
public interface CreateValidation {}
public interface UpdateValidation {}

@Data
public class InterviewDTO {
    
    @Null(groups = CreateValidation.class)
    @NotNull(groups = UpdateValidation.class)
    private String id;
}
```

## Standard Validation Annotations
Use built-in annotations when possible:
- `@NotNull`, `@NotBlank`, `@NotEmpty`
- `@Size`, `@Min`, `@Max`
- `@Email`, `@Pattern`
- `@Past`, `@Future`
- `@Positive`, `@Negative`
- `@Valid` (for nested objects)
# Configuration Package - Agent Instructions

## Purpose
This package contains all application configuration classes for the Interview Organiser backend.

## Responsibilities
- Application-wide configurations
- Bean definitions
- External service configurations
- Database configurations
- Security configurations
- CORS settings
- Async processing configuration
- Scheduling configuration

## Naming Conventions
- Configuration classes should end with `Config`
- Example: `MongoConfig.java`, `WebConfig.java`, `SecurityConfig.java`

## Annotations to Use
- `@Configuration` - Marks class as configuration
- `@Bean` - Defines Spring beans
- `@EnableWebMvc` - Enable Spring MVC
- `@EnableAsync` - Enable async support
- `@EnableScheduling` - Enable scheduling
- `@ConfigurationProperties` - Bind external properties

## Common Configuration Classes
1. **MongoConfig** - MongoDB connection and settings
2. **WebConfig** - Web MVC configurations, CORS
3. **SecurityConfig** - Security settings
4. **ApplicationConfig** - General application settings
5. **AsyncConfig** - Async executor configuration
6. **ValidationConfig** - Custom validation configurations

## Best Practices
- Keep configurations modular and focused
- Use environment variables for sensitive data
- Document complex configurations
- Use profile-specific configurations when needed
- Externalize configurable values to application.properties

## Example Structure
```java
@Configuration
public class MongoConfig {
    // MongoDB configuration beans
}
```

