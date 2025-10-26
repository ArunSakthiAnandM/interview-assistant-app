# Interview Organiser Backend - Agent Instructions

## 🚨 CRITICAL: Documentation Management Policy

**DO NOT CREATE NEW .MD FILES IN THE ROOT DIRECTORY**

All project documentation must be maintained in the existing files:
- **README.md** - Main project documentation (update this for all changes)
- **AGENT.md** - This file (project guidelines and agent instructions)
- **Package AGENT.md files** - Layer-specific instructions (in each package)

### Documentation Update Rules

1. **For Project Changes:**
   - ✅ UPDATE README.md with new features, changes, or improvements
   - ❌ DO NOT create SETUP.md, GUIDE.md, or any other root-level .md files
   - ✅ Keep README.md as the single source of truth

2. **For Package-Specific Changes:**
   - ✅ UPDATE the relevant package's AGENT.md file
   - ❌ DO NOT create new .md files in packages
   - ✅ Keep package documentation within existing AGENT.md files

3. **When Adding Features:**
   - Update README.md sections: Getting Started, API Documentation, or Development Guide
   - Add code examples directly to README.md
   - Update relevant package AGENT.md files with implementation details

4. **When Changing Architecture:**
   - Update the Architecture section in README.md
   - Update the Project Structure section in README.md
   - No separate architecture .md files needed

5. **For Quick References:**
   - Add to README.md under appropriate sections
   - Use the existing "Quick Commands Reference" section
   - Add tables and code blocks inline

### README.md Sections to Update

When making changes, update the relevant section(s) in README.md:
- **Overview** - For major feature additions or project description changes
- **Architecture** - For architectural changes or design pattern updates
- **Project Structure** - For new packages or structural changes
- **Getting Started** - For setup process changes
- **API Documentation** - For new endpoints or API changes
- **Configuration** - For new config properties or environment variables
- **Development Guide** - For new development patterns or workflows
- **Best Practices** - For new coding standards or guidelines
- **Testing** - For testing approach changes
- **Deployment** - For deployment process updates

---

## Project Overview
This is a production-grade Spring Boot backend application for an Interview Organiser system.
The application follows industry best practices and clean architecture principles.

## Technology Stack
- **Framework**: Spring Boot 3.5.7
- **Java Version**: 25
- **Database**: MongoDB
- **Build Tool**: Maven
- **Additional Libraries**: Lombok, Spring Validation

## Project Structure
```
src/main/java/com/interview/organiser/
├── config/          - Application configuration classes
├── controller/      - REST API controllers
├── service/         - Business logic layer
├── repository/      - Data access layer (MongoDB repositories)
├── model/           - Domain models and entities
│   ├── entity/      - Database entities
│   └── dto/         - Data Transfer Objects
├── exception/       - Custom exceptions and error handling
├── constants/       - Application constants and enums
├── util/            - Utility classes and helper methods
├── security/        - Security configuration and filters
└── validation/      - Custom validators
```

## Coding Standards
1. **Naming Conventions**:
   - Controllers: `*Controller.java`
   - Services: `*Service.java` (interface) and `*ServiceImpl.java` (implementation)
   - Repositories: `*Repository.java`
   - DTOs: `*DTO.java` or `*Request.java`/`*Response.java`
   - Entities: No suffix, just the entity name

2. **Package Organization**:
   - Each layer should be in its own package
   - Keep related classes together
   - Use sub-packages for better organization

3. **Code Quality**:
   - Use Lombok annotations to reduce boilerplate
   - Validate input using Spring Validation annotations
   - Handle exceptions properly using @ControllerAdvice
   - Write comprehensive API documentation
   - Follow RESTful principles for API design

4. **Best Practices**:
   - Use DTOs for API requests/responses (don't expose entities)
   - Implement proper error handling and logging
   - Use constants instead of magic numbers/strings
   - Write unit and integration tests
   - Use dependency injection properly

## API Standards
- Base URL: `/api/v1`
- Use appropriate HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Return appropriate HTTP status codes
- Use consistent response formats

## Configuration
- Environment-specific configurations should be in separate property files
- Sensitive data should be externalized (use environment variables)
- Use profiles for different environments (dev, test, prod)

## Documentation
- Each package contains an AGENT.md file with specific instructions
- Refer to package-specific AGENT.md for detailed guidelines
- **IMPORTANT:** All project-level documentation lives in README.md
- Never create additional .md files in the root directory

## Documentation Workflow

### When Adding New Features
1. **Implement the code** in appropriate packages
2. **Update README.md** with:
   - New API endpoints (in API Documentation section)
   - Code examples (in Development Guide section)
   - Any new configuration (in Configuration section)
3. **Update package AGENT.md** if the change affects that layer's patterns
4. **DO NOT** create separate feature documentation files

### When Fixing Bugs
1. **Fix the code**
2. **Update README.md** only if the fix affects:
   - Public API behavior
   - Configuration requirements
   - Setup instructions
3. **DO NOT** create BUGFIX.md or similar files

### When Refactoring
1. **Refactor the code**
2. **Update README.md** if architectural changes affect:
   - Project structure
   - Development workflow
   - Best practices
3. **Update relevant AGENT.md** files in affected packages
4. **DO NOT** create REFACTORING.md or similar files

### Examples of Documentation Updates

#### ✅ CORRECT: Adding a New API Endpoint
```markdown
Update README.md, API Documentation section:

### Available Endpoints

#### Interviews
- **POST** `/interviews`
  - **Description:** Create a new interview
  - **Request Body:** InterviewRequestDTO
  - **Response:** 201 CREATED with InterviewResponseDTO
```

#### ❌ WRONG: Creating New Documentation File
```
DO NOT CREATE: API_ENDPOINTS.md
DO NOT CREATE: INTERVIEW_API.md
DO NOT CREATE: ENDPOINTS_GUIDE.md
```

#### ✅ CORRECT: Adding Configuration
```markdown
Update README.md, Configuration section:

### Email Configuration
```properties
# Email Settings
spring.mail.host=smtp.gmail.com
spring.mail.port=587
```
```

#### ❌ WRONG: Creating Configuration File
```
DO NOT CREATE: EMAIL_CONFIG.md
DO NOT CREATE: CONFIGURATION_GUIDE.md
```

## File Management Rules

### Allowed Files in Root Directory
- ✅ README.md (main documentation)
- ✅ AGENT.md (this file)
- ✅ start.sh (startup script)
- ✅ pom.xml (Maven configuration)
- ✅ .gitignore (Git configuration)
- ✅ LICENSE (if applicable)

### Prohibited Files in Root Directory
- ❌ Any additional .md files (SETUP.md, GUIDE.md, FEATURES.md, etc.)
- ❌ Documentation files (API.md, ARCHITECTURE.md, etc.)
- ❌ Change logs as separate files (CHANGELOG.md - use README.md or Git tags)
- ❌ Temporary documentation files

### Exception Handling
If you need to document something complex:
1. **First choice:** Add a new section to README.md
2. **Second choice:** Add subsection to existing README.md section
3. **Third choice:** Expand relevant package AGENT.md
4. **Never:** Create a new .md file in root

## Getting Started
1. Ensure MongoDB is running
2. Update application.properties with database connection details
3. Run `mvn clean install` to build the project
4. Run `mvn spring-boot:run` to start the application
5. Access health check at: `http://localhost:8080/api/v1/health`

## Quick Checklist for Agents/Developers

Before making any changes, ask yourself:
- [ ] Am I about to create a new .md file? **DON'T!**
- [ ] Can this documentation go in README.md? **YES, IT CAN!**
- [ ] Does this change affect package-specific patterns? **Update package AGENT.md**
- [ ] Is README.md already comprehensive? **Keep it that way by updating it**
- [ ] Am I following the documentation workflow above? **Follow it strictly**

**Remember: README.md is the single source of truth for project documentation. Keep it updated and comprehensive.**

