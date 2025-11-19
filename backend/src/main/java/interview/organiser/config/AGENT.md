# Config Package - Agent Instructions

## Purpose
This package contains Spring configuration classes for the application.

## Responsibilities
- Application configuration
- Bean definitions
- External service configuration
- Security configuration
- Database configuration
- CORS configuration
- Swagger/API documentation configuration

## Naming Conventions
- Configuration classes should end with `Config`
- Example: `SecurityConfig.java`, `CorsConfig.java`, `AwsConfig.java`

## Annotations to Use
- `@Configuration` - Marks class as configuration
- `@Bean` - Defines Spring beans
- `@ConfigurationProperties` - Binds properties to objects
- `@EnableConfigurationProperties` - Enables @ConfigurationProperties beans
- `@ConditionalOnProperty` - Conditional configuration
- `@Profile` - Profile-specific configuration

## Structure
```
config/
├── SecurityConfig.java           - Security configuration
├── CorsConfig.java              - CORS configuration
├── MongoConfig.java             - MongoDB configuration
├── AwsS3Config.java             - AWS S3 configuration
├── SwaggerConfig.java           - API documentation
└── properties/
    ├── AwsProperties.java       - AWS properties binding
    └── AppProperties.java       - Application properties
```

## Best Practices
1. **Separation of Concerns**: One config class per concern
2. **Externalize Configuration**: Use application.properties/yml
3. **Type-Safe Properties**: Use @ConfigurationProperties
4. **Documentation**: Document configuration options
5. **Environment Specific**: Use profiles for different environments
6. **Validation**: Validate configuration properties
7. **Security**: Never hardcode sensitive data

## Configuration Properties Example
```java
@Configuration
@ConfigurationProperties(prefix = "aws.s3")
@Validated
public class AwsS3Properties {
    
    @NotBlank
    private String bucketName;
    
    @NotBlank
    private String region;
    
    private String accessKey;
    
    private String secretKey;
    
    // Getters and setters
}
```

## Bean Definition Example
```java
@Configuration
public class AwsS3Config {
    
    @Bean
    public S3Client s3Client(AwsS3Properties properties) {
        return S3Client.builder()
            .region(Region.of(properties.getRegion()))
            .credentialsProvider(createCredentialsProvider(properties))
            .build();
    }
    
    private AwsCredentialsProvider createCredentialsProvider(
            AwsS3Properties properties) {
        // Implementation
    }
}
```

## Security Best Practices
- Use environment variables for secrets
- Don't commit sensitive configuration
- Use Spring Cloud Config for centralized configuration
- Encrypt sensitive properties
- Use profiles for different environments (dev, test, prod)

## Profile-Specific Configuration
```java
@Configuration
@Profile("production")
public class ProductionConfig {
    // Production-specific beans
}

@Configuration
@Profile("dev")
public class DevelopmentConfig {
    // Development-specific beans
}
```

## Conditional Configuration
```java
@Configuration
public class EmailConfig {
    
    @Bean
    @ConditionalOnProperty(
        name = "email.enabled", 
        havingValue = "true"
    )
    public EmailService emailService() {
        return new EmailServiceImpl();
    }
}
```
