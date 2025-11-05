# Interview Organiser Backend API

A comprehensive Spring Boot application for managing the complete interview process, from candidate application to feedback collection.

## 🎯 Features

- **User Management**: Admin, Recruiter, Interviewer, and Candidate roles
- **Candidate Tracking**: Full candidate lifecycle management
- **Interview Scheduling**: Schedule and manage interviews with availability tracking
- **Feedback System**: Structured feedback collection with ratings and recommendations
- **Custom JWT Authentication**: Secure API with JWT tokens
- **MongoDB Integration**: NoSQL database for flexible data storage

## 🏗️ Tech Stack

- **Framework**: Spring Boot 3.5.7
- **Language**: Java 25
- **Database**: MongoDB
- **Security**: Custom JWT authentication with Spring Security
- **Build Tool**: Maven
- **Documentation**: OpenAPI 3.0 (api.yaml)

## 📋 Prerequisites

- Java 25 or higher
- Maven 3.6+
- MongoDB 4.4+ (running locally or remote)
- IDE (IntelliJ IDEA, Eclipse, or VS Code recommended)

## 🚀 Getting Started

### 1. Clone and Navigate

```bash
cd backend
```

### 2. Configure MongoDB

Update `src/main/resources/application.properties`:

```properties
spring.data.mongodb.uri=mongodb://localhost:27017/interview_organiser
```

Or use environment variables:

```bash
export MONGODB_URI=mongodb://localhost:27017/interview_organiser
```

### 3. Update JWT Secret

For production, update the JWT secret in `application.properties`:

```properties
jwt.secret=your-secure-secret-key-minimum-256-bits-change-this-in-production
```

### 4. Install Dependencies

```bash
./mvnw clean install
```

### 5. Run the Application

```bash
./mvnw spring-boot:run
```

Or with local profile:

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

The application will start on `http://localhost:8080`

### 6. Verify Health

```bash
curl http://localhost:8080/api/v1/health
```

Expected response:
```json
{
  "status": "UP",
  "timestamp": "2025-11-01T10:30:00",
  "message": "Interview Organiser API is running"
}
```

## 📚 API Documentation

### Base URL

```
http://localhost:8080/api/v1
```

### Authentication Flow

1. **Register**: `POST /auth/register`
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "RECRUITER"
}
```

2. **Login**: `POST /auth/login`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response includes `accessToken` and `refreshToken`.

3. **Use Token**: Include in Authorization header
```
Authorization: Bearer <your_access_token>
```

### Available Endpoints

See `src/main/resources/API.md` for complete documentation or `api.yaml` for OpenAPI specification.

| Category | Endpoints |
|----------|-----------|
| Health | `GET /health` |
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout` |
| Users | `GET /users`, `GET /users/{id}`, `PUT /users/{id}`, `DELETE /users/{id}` |
| Candidates | CRUD operations on `/candidates` |
| Interviewers | CRUD operations on `/interviewers` |
| Interviews | CRUD operations on `/interviews` |
| Feedback | CRUD operations on `/feedback` |

## 🗂️ Project Structure

```
backend/
├── src/main/java/com/interview/organiser/
│   ├── OrganiserApplication.java          # Main application
│   ├── config/                            # Configuration classes
│   │   ├── SecurityConfig.java
│   │   └── WebConfig.java
│   ├── constants/                         # Constants and enums
│   │   ├── ApiConstants.java
│   │   ├── AppConstants.java
│   │   └── enums/
│   ├── controller/                        # REST controllers
│   │   ├── AuthController.java
│   │   ├── CandidateController.java
│   │   ├── FeedbackController.java
│   │   ├── HealthController.java
│   │   ├── InterviewController.java
│   │   ├── InterviewerController.java
│   │   └── UserController.java
│   ├── exception/                         # Exception handling
│   │   ├── GlobalExceptionHandler.java
│   │   └── ... custom exceptions
│   ├── model/
│   │   ├── dto/                          # Data Transfer Objects
│   │   │   ├── request/
│   │   │   └── response/
│   │   └── entity/                       # MongoDB entities
│   ├── repository/                       # MongoDB repositories
│   ├── service/                          # Service interfaces
│   │   └── impl/                         # Service implementations
│   ├── util/                             # Utility classes
│   │   ├── EntityMapper.java
│   │   └── JwtUtil.java
│   └── security/                         # Security components
├── src/main/resources/
│   ├── application.properties
│   ├── application-local.properties
│   ├── API.md                            # API documentation
│   └── api.yaml                          # OpenAPI specification
└── pom.xml                               # Maven configuration
```

## ⚙️ Configuration

### Application Properties

**Main Configuration** (`application.properties`):
```properties
# Application
spring.application.name=interview-organiser
server.port=8080

# MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/interview_organiser
spring.data.mongodb.auto-index-creation=true

# JWT
jwt.secret=your-secret-key
jwt.expiration=3600000
jwt.refresh-expiration=604800000
```

**Local Development** (`application-local.properties`):
- Enhanced logging
- Local MongoDB connection
- Development mode enabled

### Profiles

Run with specific profile:
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

## 🔐 Security

### JWT Authentication

- **Access Token**: Expires in 1 hour
- **Refresh Token**: Expires in 7 days
- **Password Hashing**: BCrypt with default strength

### Authorization

User roles:
- `ADMIN`: Full system access
- `RECRUITER`: Manage candidates and schedule interviews
- `INTERVIEWER`: Conduct interviews and submit feedback
- `CANDIDATE`: Limited access to own profile

### CORS Configuration

Configured to allow:
- Origins: `http://localhost:3000`, `http://localhost:4200`
- Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
- Credentials: Enabled

## 🗄️ Database Schema

### MongoDB Collections

1. **users**: User accounts with authentication
2. **candidates**: Candidate profiles and status
3. **interviewers**: Interviewer profiles with expertise
4. **interviews**: Interview schedules and details
5. **feedback**: Interview feedback and ratings
6. **refresh_tokens**: JWT refresh tokens

### Indexes

Unique indexes on:
- `users.email`
- `candidates.email`
- `refresh_tokens.token`

## 🧪 Testing

### Run Tests

```bash
./mvnw test
```

### Test Coverage

```bash
./mvnw clean test jacoco:report
```

View report: `target/site/jacoco/index.html`

## 📦 Building for Production

### Create JAR

```bash
./mvnw clean package
```

### Run JAR

```bash
java -jar target/organiser-0.0.1-SNAPSHOT.jar
```

### Docker Deployment

```dockerfile
FROM openjdk:25-jdk-slim
COPY target/organiser-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

Build and run:
```bash
docker build -t interview-organiser .
docker run -p 8080:8080 interview-organiser
```

## 🛠️ Development

### Adding New Endpoints

1. Create DTOs in `model/dto/`
2. Create entity in `model/entity/`
3. Create repository in `repository/`
4. Implement service in `service/impl/`
5. Create controller in `controller/`
6. Update API documentation

### Code Style

- Follow Java naming conventions
- Use Lombok annotations (@Data, @Builder, etc.)
- Add JavaDoc for public methods
- Implement proper exception handling

## 📝 TODO

- [ ] Complete service implementations (UserService, CandidateService, etc.)
- [ ] Add JWT authentication filter
- [ ] Add role-based authorization
- [ ] Implement unit tests
- [ ] Add integration tests
- [ ] Add email notifications
- [ ] Add file upload for resumes
- [ ] Add search and filtering enhancements
- [ ] Add audit logging
- [ ] Add rate limiting

## 🐛 Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
mongosh

# Start MongoDB (macOS)
brew services start mongodb-community

# Start MongoDB (Linux)
sudo systemctl start mongod
```

### Port Already in Use

Change port in `application.properties`:
```properties
server.port=8081
```

### JWT Token Issues

Ensure the secret key is at least 256 bits (32 characters).

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributors

- Development Team

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Email: support@intervieworganiser.com

---

**Note**: This is the backend API. A frontend application is needed to interact with these endpoints.

