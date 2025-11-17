# Interview Assistant App

A full-stack application that helps in organizing and conducting interview drives, built with Spring Boot (backend) and Angular (frontend).

## 🚀 Features

- **Organization Management**: Manage multiple organizations and their interview processes
- **User Management**: Support for multiple roles (Admin, Recruiter, Interviewer, Candidate)
- **Interview Scheduling**: Create and manage interview schedules
- **File Management**: Upload and manage interview-related documents
- **Notification System**: Keep users informed about interview updates
- **Dashboard**: Role-specific dashboards for different user types

## 🏗️ Architecture

- **Backend**: Spring Boot 3.5.7 with Java 25
- **Frontend**: Angular 20.3.0 with TypeScript
- **Database**: PostgreSQL (via AWS RDS)
- **Cloud Infrastructure**: AWS (Elastic Beanstalk, S3, CloudFront)
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
interview-assistant-app/
├── backend/              # Spring Boot application
│   ├── src/
│   ├── pom.xml
│   └── README.md
├── frontend/             # Angular application
│   ├── src/
│   ├── package.json
│   └── README.md
├── .github/              # CI/CD workflows and documentation
│   ├── workflows/
│   │   └── deploy.yml   # Main deployment pipeline
│   ├── ARCHITECTURE.md
│   ├── SETUP_CHECKLIST.md
│   └── README.md
└── CICD_SETUP_GUIDE.md  # Comprehensive CI/CD guide
```

## 🚀 CI/CD Pipeline

This project includes a fully automated CI/CD pipeline using GitHub Actions that:

✅ Builds and tests both backend and frontend
✅ Deploys backend to AWS Elastic Beanstalk
✅ Deploys frontend to AWS S3 + CloudFront
✅ Supports multiple environments (development, production)
✅ Runs in ~15 minutes with parallel builds

### Quick Start

1. **Push to develop** → Deploys to development environment
2. **Push to main** → Deploys to production environment

### Documentation

- 📋 [Setup Checklist](.github/SETUP_CHECKLIST.md) - Step-by-step setup guide
- 📖 [CI/CD Guide](CICD_SETUP_GUIDE.md) - Comprehensive documentation
- 🏗️ [Architecture](.github/ARCHITECTURE.md) - Visual diagrams and flow
- 🔧 [Environment Examples](.github/ENVIRONMENT_EXAMPLES.md) - Configuration examples

## 🛠️ Development Setup

### Prerequisites

- Java 25+
- Node.js 20+
- PostgreSQL
- Maven
- npm

### Backend Setup

```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

Backend runs on: `http://localhost:8080`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on: `http://localhost:4200`

## 🌐 Deployment

### AWS Infrastructure

- **Backend**: Deployed on AWS Elastic Beanstalk
- **Frontend**: Hosted on S3 with CloudFront CDN
- **Database**: PostgreSQL on AWS RDS

### Automated Deployment

Push to the repository triggers automatic deployment:

```bash
# Deploy to development
git push origin develop

# Deploy to production
git push origin main
```

See [CICD_SETUP_GUIDE.md](CICD_SETUP_GUIDE.md) for detailed setup instructions.

## 📚 Documentation

- [Backend API Documentation](backend/docs/API.md)
- [Frontend Documentation](frontend/README.md)
- [CI/CD Setup Guide](CICD_SETUP_GUIDE.md)
- [Architecture Documentation](.github/ARCHITECTURE.md)

## 🧪 Testing

### Backend Tests

```bash
cd backend
./mvnw test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 🔒 Security

- AWS credentials managed via GitHub Secrets
- Database credentials encrypted
- HTTPS enforced via CloudFront
- IAM roles with least privilege

## 📊 Monitoring

- **Backend**: AWS CloudWatch + Spring Boot Actuator
- **Frontend**: CloudFront metrics
- **Pipeline**: GitHub Actions logs

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests locally
4. Create a pull request
5. Wait for CI/CD checks to pass

## 📝 License

[Add your license information here]

## 👥 Team

[Add team information here]

---

**Need Help?** Check the [CI/CD Setup Guide](CICD_SETUP_GUIDE.md) or [Setup Checklist](.github/SETUP_CHECKLIST.md)
