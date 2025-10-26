# Interview Organiser Backend

> A production-grade Spring Boot application for managing interview scheduling and organization.

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.7-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-25-orange.svg)](https://www.oracle.com/java/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green.svg)](https://www.mongodb.com/)
[![Maven](https://img.shields.io/badge/Maven-3.x-red.svg)](https://maven.apache.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> 📖 **Living Documentation:** This README is the single source of truth for the project. All documentation updates, new features, and changes are reflected here. For coding guidelines and layer-specific instructions, see [AGENT.md](AGENT.md) and package-specific AGENT.md files.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)
- [Development Guide](#development-guide)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 Overview

This is a **production-grade Spring Boot backend** application designed for interview management. The application follows clean architecture principles with clear separation of concerns, industry-standard package organization, and comprehensive documentation.

### ✨ Key Features

- ✅ **Clean Architecture** - Layered architecture with clear separation
- ✅ **Production-Ready** - Industry-standard structure and patterns
- ✅ **Well-Documented** - Comprehensive AGENT.md files in each package
- ✅ **MongoDB Integration** - Ready for NoSQL database operations
- ✅ **RESTful APIs** - Following REST best practices
- ✅ **DTO Pattern** - Separation between entities and API contracts
- ✅ **Exception Handling** - Centralized error management
- ✅ **Validation** - Input validation with custom validators
- ✅ **Security Ready** - Structure for authentication/authorization
- ✅ **Scalable** - Designed to grow with your needs

### 🛠️ Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Spring Boot** | 3.5.7 | Application framework |
| **Java** | 25 | Programming language |
| **MongoDB** | Latest | NoSQL database |
| **Maven** | 3.x | Build tool |
| **Lombok** | Latest | Reduce boilerplate code |
| **Spring Validation** | Latest | Input validation |
| **Jackson** | Latest | JSON processing |

---

## 🏗️ Architecture

The application follows a **layered architecture** pattern:

```
┌─────────────────────────────────────────────────────────┐
│                    Client / Frontend                     │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST
┌────────────────────▼────────────────────────────────────┐
│              Controller Layer (API)                      │
│  • REST endpoints, validation, HTTP handling             │
└────────────────────┬────────────────────────────────────┘
                     │ DTOs
┌────────────────────▼────────────────────────────────────┐
│           Service Layer (Business Logic)                 │
│  • Business rules, transactions, orchestration           │
└────────────────────┬────────────────────────────────────┘
                     │ Entities
┌────────────────────▼────────────────────────────────────┐
│            Repository Layer (Data Access)                │
│  • Query methods, database operations                    │
└────────────────────┬────────────────────────────────────┘
                     │ MongoDB Protocol
┌────────────────────▼────────────────────────────────────┐
│                  MongoDB Database                        │
└─────────────────────────────────────────────────────────┘

Cross-Cutting Concerns:
├── Exception Handling (Global)
├── Security (Authentication/Authorization)
├── Validation (Request validation)
└── Logging & Monitoring
```

### Design Patterns

- **Layered Architecture** - Clear separation between layers
- **Repository Pattern** - Abstract data access
- **DTO Pattern** - API/Entity separation
- **Service Interface Pattern** - Interface-based design
- **Builder Pattern** - Object creation (via Lombok)
- **Singleton Pattern** - Constants management

---

## 📂 Project Structure

```
src/main/java/com/interview/organiser/
│
├── OrganiserApplication.java          # Main Spring Boot application
│
├── config/                            # ⚙️ Configuration Layer
│   └── AGENT.md                       # Configuration guidelines
│
├── controller/                        # 🌐 REST API Controllers
│   ├── HealthController.java         # Health check endpoint
│   └── AGENT.md                       # Controller best practices
│
├── service/                           # 💼 Business Logic Layer
│   ├── impl/                          # Service implementations
│   └── AGENT.md                       # Service patterns
│
├── repository/                        # 💾 Data Access Layer
│   └── AGENT.md                       # Repository guidelines
│
├── model/                             # 📦 Data Models
│   ├── entity/                        # MongoDB entities
│   │   └── AGENT.md
│   └── dto/                           # Data Transfer Objects
│       ├── request/                   # Request DTOs
│       ├── response/                  # Response DTOs
│       │   └── HealthResponseDTO.java
│       └── AGENT.md
│
├── exception/                         # ⚠️ Exception Handling
│   └── AGENT.md                       # Error handling patterns
│
├── constants/                         # 🔤 Constants & Enums
│   ├── AppConstants.java             # Application constants
│   ├── ApiConstants.java             # API constants
│   ├── enums/                         # Enumerations
│   └── AGENT.md                       # Constants usage
│
├── util/                              # 🔧 Utility Classes
│   └── AGENT.md                       # Utility guidelines
│
├── security/                          # 🔐 Security Layer
│   └── AGENT.md                       # Security setup
│
└── validation/                        # ✅ Custom Validators
    ├── annotations/                   # Custom validation annotations
    ├── validators/                    # Validator implementations
    └── AGENT.md                       # Validation patterns
```

### Package Overview

| Package | Purpose | Key Files |
|---------|---------|-----------|
| `config/` | Application configuration | *Config.java |
| `controller/` | REST endpoints | *Controller.java |
| `service/` | Business logic | *Service.java, *ServiceImpl.java |
| `repository/` | Data access | *Repository.java |
| `model/entity/` | Database entities | *.java |
| `model/dto/request/` | Request DTOs | *RequestDTO.java |
| `model/dto/response/` | Response DTOs | *ResponseDTO.java |
| `exception/` | Error handling | *Exception.java |
| `constants/` | Constants & enums | *Constants.java |
| `util/` | Utilities | *Util.java |
| `security/` | Security config | SecurityConfig.java |
| `validation/` | Custom validators | *Validator.java |

> 💡 **Note:** Each package contains an `AGENT.md` file with detailed instructions, naming conventions, and code examples specific to that layer.

### Git Configuration

The project includes a comprehensive `.gitignore` file that excludes:

**Build & Dependencies:**
- `target/` - Maven build output
- `*.class` - Compiled Java files
- `*.jar`, `*.war` - Package files

**IDE Files:**
- `.idea/` - IntelliJ IDEA
- `.vscode/` - VS Code
- `.classpath`, `.project` - Eclipse

**Operating System:**
- `.DS_Store` - macOS
- `Thumbs.db` - Windows
- `*~` - Linux backup files

**Security:**
- `*.key`, `*.pem` - Private keys
- `.env` - Environment variables
- `application-secret.properties` - Secret configurations

**Documentation Policy:**
- Allows: `README.md`, `AGENT.md`, `**/AGENT.md`
- Ignores: Any other `.md` files (following documentation policy)

> 🔒 **Security Note:** Never commit sensitive files like private keys, passwords, or environment-specific configurations. Use environment variables or external configuration for production secrets.

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- ☕ **Java 25** or higher
- 📦 **Maven 3.x**
- 🍃 **MongoDB** (optional for initial testing)
- 🔧 **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd interview-assistant-app/backend
   ```

2. **Build the project:**
   ```bash
   mvn clean install
   ```

3. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```

   Or use the interactive script:
   ```bash
   ./start.sh
   # Select option 5: Clean, Build, and Run
   ```

4. **Verify the application:**
   ```bash
   curl http://localhost:8080/api/v1/health
   ```

### Expected Response

```json
{
  "status": "UP",
  "message": "Service is up and running",
  "applicationName": "organiser",
  "version": "1.0.0",
  "timestamp": "2025-10-26T16:00:00",
  "environment": "dev"
}
```

---

## 📡 API Documentation

### Base URL

```
http://localhost:8080/api/v1
```

### Available Endpoints

#### Health Check
- **GET** `/health`
- **Description:** Check application health status
- **Response:** `200 OK`

```bash
curl http://localhost:8080/api/v1/health
```

### API Conventions

- ✅ All endpoints start with `/api/v1`
- ✅ Use appropriate HTTP methods (GET, POST, PUT, DELETE, PATCH)
- ✅ Return appropriate HTTP status codes
- ✅ Use consistent response formats
- ✅ DTOs for all request/response

---

## ⚙️ Configuration

### Application Properties

The application can be configured via `application.properties`:

```properties
# Server Configuration
server.port=8080

# MongoDB Configuration (when ready)
# spring.data.mongodb.uri=mongodb://localhost:27017/interview_organiser
# spring.data.mongodb.database=interview_organiser

# Active Profile
spring.profiles.active=dev

# Logging
logging.level.root=INFO
logging.level.com.interview.organiser=DEBUG
```

### Profiles

| Profile | Purpose | Activate |
|---------|---------|----------|
| `dev` | Development | `spring.profiles.active=dev` |
| `test` | Testing | `spring.profiles.active=test` |
| `prod` | Production | `spring.profiles.active=prod` |

Change profile via command line:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

### MongoDB Setup

MongoDB auto-configuration is currently **disabled** to allow the app to run without MongoDB.

**To enable MongoDB:**

1. Install and start MongoDB
2. Edit `application.properties`:
   - Remove the `spring.autoconfigure.exclude` line
   - Uncomment MongoDB configuration
   - Update connection URI if needed

---

## 👨‍💻 Development Guide

### Adding New Features

Follow this checklist when adding new features:

1. **Create Entity** in `model/entity/`
   - Define MongoDB document
   - Add annotations (@Document, @Id, etc.)
   - Follow entity AGENT.md guidelines

2. **Create Repository** in `repository/`
   - Extend MongoRepository
   - Add custom query methods
   - Follow repository AGENT.md guidelines

3. **Create DTOs** in `model/dto/`
   - Request DTOs in `request/`
   - Response DTOs in `response/`
   - Add validation annotations
   - Follow DTO AGENT.md guidelines

4. **Create Service** in `service/`
   - Define service interface
   - Implement in `service/impl/`
   - Add business logic
   - Follow service AGENT.md guidelines

5. **Create Controller** in `controller/`
   - Define REST endpoints
   - Use DTOs for request/response
   - Add validation
   - Follow controller AGENT.md guidelines

6. **Add Constants** (if needed) in `constants/`

7. **Create Custom Exceptions** (if needed) in `exception/`

8. **Write Tests** in `src/test/`

### Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Controller | *Controller | `InterviewController.java` |
| Service Interface | *Service | `InterviewService.java` |
| Service Implementation | *ServiceImpl | `InterviewServiceImpl.java` |
| Repository | *Repository | `InterviewRepository.java` |
| Entity | Plain name | `Interview.java` |
| Request DTO | *RequestDTO | `CreateInterviewRequestDTO.java` |
| Response DTO | *ResponseDTO | `InterviewResponseDTO.java` |
| Exception | *Exception | `ResourceNotFoundException.java` |
| Constants | *Constants | `AppConstants.java` |
| Enum | Plain name | `InterviewStatus.java` |
| Util | *Util | `DateTimeUtil.java` |

### Code Examples

#### Creating an Entity

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "interviews")
public class Interview {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String interviewCode;
    
    private String candidateName;
    private String position;
    private LocalDateTime scheduledDate;
    private String status;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

#### Creating a Repository

```java
@Repository
public interface InterviewRepository extends MongoRepository<Interview, String> {
    
    Optional<Interview> findByInterviewCode(String code);
    
    List<Interview> findByStatus(String status);
    
    @Query("{ 'status': ?0, 'scheduledDate': { $gte: ?1 } }")
    List<Interview> findUpcomingInterviews(String status, LocalDate date);
}
```

#### Creating a Service

```java
// Interface
public interface InterviewService {
    InterviewResponseDTO createInterview(InterviewRequestDTO request);
    InterviewResponseDTO getInterviewById(String id);
    List<InterviewResponseDTO> getAllInterviews();
}

// Implementation
@Service
@Transactional
public class InterviewServiceImpl implements InterviewService {
    
    private final InterviewRepository repository;
    
    public InterviewServiceImpl(InterviewRepository repository) {
        this.repository = repository;
    }
    
    @Override
    public InterviewResponseDTO createInterview(InterviewRequestDTO request) {
        // Business logic here
    }
}
```

#### Creating a Controller

```java
@RestController
@RequestMapping(AppConstants.API_BASE_PATH + "/interviews")
public class InterviewController {
    
    private final InterviewService service;
    
    public InterviewController(InterviewService service) {
        this.service = service;
    }
    
    @PostMapping
    public ResponseEntity<InterviewResponseDTO> create(
            @Valid @RequestBody InterviewRequestDTO request) {
        InterviewResponseDTO response = service.createInterview(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<InterviewResponseDTO> getById(@PathVariable String id) {
        InterviewResponseDTO response = service.getInterviewById(id);
        return ResponseEntity.ok(response);
    }
}
```

---

## 🎯 Best Practices

### General Guidelines

1. **Follow Package Structure** - Keep files in appropriate packages
2. **Use DTOs** - Never expose entities in APIs
3. **Validate Input** - Use validation annotations
4. **Handle Exceptions** - Implement proper error handling
5. **Document Code** - Add JavaDoc for public methods
6. **Write Tests** - Unit and integration tests
7. **Use Constants** - Avoid magic numbers/strings
8. **Follow Naming Conventions** - Be consistent

### Layer-Specific Best Practices

#### Controller Layer
- Keep controllers thin
- Only handle HTTP concerns
- Delegate to services
- Use appropriate HTTP methods and status codes
- Validate all inputs with `@Valid`

#### Service Layer
- Implement business logic here
- Use interfaces for all services
- Keep services focused and cohesive
- Handle transactions appropriately
- Use DTOs for data transfer

#### Repository Layer
- Keep repositories simple
- Use Spring Data naming conventions
- Add custom queries only when needed
- Return Optional for single results

#### Model Layer
- Separate entities and DTOs
- Use validation annotations on DTOs
- Use Lombok to reduce boilerplate
- Document complex structures

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
mvn test

# Run specific test
mvn test -Dtest=HealthControllerTest

# Run with coverage
mvn clean test jacoco:report
```

### Test Structure

Create tests following the same package structure:

```
src/test/java/com/interview/organiser/
├── controller/
│   └── HealthControllerTest.java
├── service/
│   └── InterviewServiceTest.java
└── repository/
    └── InterviewRepositoryTest.java
```

### Testing Best Practices

- Write unit tests for business logic
- Write integration tests for APIs
- Mock external dependencies
- Use meaningful test names
- Aim for high code coverage
- Test edge cases and error scenarios

---

## 🚢 Deployment

### Building for Production

```bash
# Build the application
mvn clean package -DskipTests

# The JAR file will be in target/
ls -lh target/organiser-*.jar
```

### Running the JAR

```bash
java -jar target/organiser-0.0.1-SNAPSHOT.jar
```

### Environment Variables

Set production environment variables:

```bash
export SPRING_PROFILES_ACTIVE=prod
export MONGODB_URI=mongodb://prod-server:27017/interview_organiser
export SERVER_PORT=8080
```

### Docker (Future)

```dockerfile
FROM openjdk:25-jdk-slim
WORKDIR /app
COPY target/organiser-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## 📚 Documentation

### AGENT.md Files

Each package contains an `AGENT.md` file with:
- Purpose and responsibilities
- Naming conventions
- Required annotations
- Best practices
- Code examples

### Where to Look for Help

| Need Help With... | Look Here |
|------------------|-----------|
| Overall Project | `AGENT.md` (root) |
| REST APIs | `controller/AGENT.md` |
| Business Logic | `service/AGENT.md` |
| Database | `repository/AGENT.md` |
| Data Models | `model/entity/AGENT.md` |
| API DTOs | `model/dto/AGENT.md` |
| Error Handling | `exception/AGENT.md` |
| Constants | `constants/AGENT.md` |
| Utilities | `util/AGENT.md` |
| Security | `security/AGENT.md` |
| Validation | `validation/AGENT.md` |

---

## 🔄 Next Steps

### Immediate Tasks
- [ ] Configure MongoDB connection
- [ ] Create your first domain entity
- [ ] Implement repositories
- [ ] Build business services
- [ ] Create REST controllers
- [ ] Add exception handling

### Future Enhancements
- [ ] Add Swagger/OpenAPI documentation
- [ ] Implement JWT authentication
- [ ] Add caching layer
- [ ] Set up monitoring (Spring Actuator)
- [ ] Implement rate limiting
- [ ] Add comprehensive logging
- [ ] Set up CI/CD pipeline
- [ ] Add integration tests
- [ ] Implement email notifications
- [ ] Add file upload/download

---

## 🤝 Contributing

### Development Workflow

1. Create a feature branch
2. Follow the coding standards
3. Write tests for new features
4. Update documentation
5. Submit a pull request

### Coding Standards

- Follow Java naming conventions
- Use meaningful variable names
- Add comments for complex logic
- Keep methods small and focused
- Follow SOLID principles
- Refer to AGENT.md files for guidelines

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- MongoDB team for the database
- All contributors and maintainers

---

## 📞 Support

For issues and questions:
- Check the relevant `AGENT.md` file in each package
- Review the code examples
- Consult Spring Boot documentation

---

## 🎯 Quick Commands Reference

```bash
# Compile
mvn clean compile

# Run tests
mvn test

# Build package
mvn clean package

# Run application
mvn spring-boot:run

# Run with profile
mvn spring-boot:run -Dspring-boot.run.profiles=prod

# Use interactive script
./start.sh
```

---

## 📊 Project Status

- ✅ **Structure:** Complete production-grade layout
- ✅ **Documentation:** Comprehensive AGENT.md files
- ✅ **Sample Code:** Working health check endpoint
- ✅ **Configuration:** Proper setup with profiles
- ✅ **Build:** Successful compilation
- ✅ **Health Check:** Verified and working

---

**Built with ❤️ using Spring Boot**

**Happy Coding! 🚀**

