# Security Package - Agent Instructions

## Purpose
This package contains security-related configurations, filters, and authentication/authorization logic.

## Responsibilities
- Security configuration
- Authentication filters
- Authorization rules
- JWT token handling
- Password encoding
- CORS configuration
- Security utilities

## Structure
```
security/
├── SecurityConfig.java        - Main security configuration
├── JwtTokenProvider.java      - JWT token generation/validation
├── JwtAuthenticationFilter.java - JWT filter
├── CustomUserDetailsService.java - User details loading
└── PasswordEncoderConfig.java - Password encoder bean
```

## Common Components

### 1. Security Configuration
- Configure authentication and authorization
- Define public and protected endpoints
- Configure CORS
- Set up security filters

### 2. JWT Authentication (if using JWT)
- Token generation
- Token validation
- Token parsing
- Token refresh

### 3. User Details
- Load user from database
- Map to Spring Security UserDetails
- Handle user authorities

## Best Practices
1. **Passwords**: Never store plain-text passwords
2. **JWT Secrets**: Use strong, externalized secrets
3. **HTTPS**: Always use HTTPS in production
4. **CORS**: Configure CORS properly
5. **Role-Based Access**: Implement fine-grained authorization
6. **Security Headers**: Add security headers
7. **Rate Limiting**: Implement rate limiting
8. **Audit**: Log security events

## Example Security Config (Basic)
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/health").permitAll()
                .requestMatchers("/api/v1/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

## Public Endpoints
Typical endpoints that should be public:
- `/api/v1/health` - Health check
- `/api/v1/auth/login` - Login
- `/api/v1/auth/register` - Registration
- `/api/v1/auth/forgot-password` - Password reset
- API documentation endpoints

## Protected Endpoints
All other API endpoints should require authentication.

## CORS Configuration
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}
```

## Security Considerations
- Always validate and sanitize input
- Implement proper rate limiting
- Use HTTPS in production
- Keep dependencies updated
- Follow OWASP guidelines
- Implement proper logging and monitoring
- Use secure session management
- Implement account lockout for failed login attempts

## Notes
- For initial development, security can be minimal
- Add JWT authentication when user management is implemented
- Gradually enhance security as application matures

