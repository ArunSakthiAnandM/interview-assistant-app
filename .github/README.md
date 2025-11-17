# GitHub Actions CI/CD Documentation

Complete CI/CD pipeline for deploying the Interview Assistant Application (Spring Boot + Angular) to AWS.

## 📚 Documentation Files

### Quick Start

- **[SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)** - Step-by-step checklist to set up the pipeline ⭐ START HERE

### Detailed Guides

- **[CICD_SETUP_GUIDE.md](../CICD_SETUP_GUIDE.md)** - Comprehensive setup and usage guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Visual architecture diagrams and data flow
- **[ENVIRONMENT_EXAMPLES.md](ENVIRONMENT_EXAMPLES.md)** - Example configurations for all environments

### Pipeline File

- **[deploy.yml](workflows/deploy.yml)** - The actual GitHub Actions workflow

---

## 🚀 Quick Overview

This CI/CD pipeline automates:

1. ✅ Building Spring Boot backend (Maven)
2. ✅ Building Angular frontend (npm)
3. ✅ Running tests for both applications
4. ✅ Deploying backend to AWS Elastic Beanstalk
5. ✅ Deploying frontend to AWS S3 + CloudFront
6. ✅ Environment-specific configurations (dev/prod)

### Key Features

- **Single Pipeline**: One workflow handles both backend and frontend
- **Parallel Execution**: Builds and deployments run concurrently
- **Environment Management**: Uses GitHub Environments for secrets/variables
- **Zero Downtime**: Elastic Beanstalk and CloudFront ensure continuous availability
- **Fast**: Typical deployment completes in ~15 minutes

---

## 📋 Getting Started

### Prerequisites

- AWS account with Elastic Beanstalk and S3/CloudFront already set up
- GitHub repository with admin access
- IAM user with deployment permissions

### Setup Steps (High Level)

1. **Configure GitHub Environments**

   - Create `development` and `production` environments
   - Add AWS secrets (keys, database credentials)
   - Add variables (bucket names, URLs, etc.)

2. **Add Workflow File**

   - Copy `.github/workflows/deploy.yml` to your repository
   - Commit and push to GitHub

3. **Test the Pipeline**
   - Push to `develop` branch → deploys to development
   - Push to `main` branch → deploys to production

### Detailed Instructions

👉 Follow the [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) for detailed step-by-step instructions.

---

## 🎯 Usage

### Automatic Deployment

```bash
# Deploy to development
git checkout develop
git push origin develop

# Deploy to production
git checkout main
git merge develop
git push origin main
```

### Manual Deployment

1. Go to **Actions** tab in GitHub
2. Select **"Build and Deploy Interview Assistant App"**
3. Click **"Run workflow"**
4. Choose environment and branch
5. Click **"Run workflow"**

---

## 🏗️ Architecture

```
GitHub Push → Build (Backend + Frontend) → Deploy (EB + S3/CF) → Live
     ↓              ↓                           ↓                  ↓
  develop      3-5 minutes                  5-10 minutes      Development
    or                                                             or
   main                                                        Production
```

For detailed architecture diagrams, see [ARCHITECTURE.md](ARCHITECTURE.md).

---

## 📊 Pipeline Jobs

| Job                 | Purpose                     | Duration  | Runs When    |
| ------------------- | --------------------------- | --------- | ------------ |
| **build-backend**   | Compile Spring Boot app     | ~3-5 min  | Always       |
| **build-frontend**  | Build Angular app           | ~2-4 min  | Always       |
| **deploy-backend**  | Deploy to Elastic Beanstalk | ~5-10 min | Push/Manual  |
| **deploy-frontend** | Deploy to S3/CloudFront     | ~2-3 min  | Push/Manual  |
| **notify**          | Report status               | ~10 sec   | After deploy |

Jobs 1-2 run in **parallel** (concurrent builds)
Jobs 3-4 run in **parallel** (concurrent deployments)

---

## 🔐 Required Secrets & Variables

### Secrets (per environment)

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`

### Variables (per environment)

- `AWS_REGION`
- `S3_BUCKET_NAME`
- `CLOUDFRONT_DISTRIBUTION_ID`
- `EB_APPLICATION_NAME`
- `EB_ENVIRONMENT_NAME`
- `BACKEND_URL`
- `FRONTEND_URL`
- `API_URL`
- `ENVIRONMENT_NAME`

See [ENVIRONMENT_EXAMPLES.md](ENVIRONMENT_EXAMPLES.md) for example values.

---

## 🐛 Troubleshooting

### Build Failures

```bash
# Test locally first
cd backend && ./mvnw clean package
cd frontend && npm ci && npm run build
```

### Deployment Failures

- Check GitHub Actions logs
- Review AWS CloudWatch logs
- Verify environment variables
- Check IAM permissions

For detailed troubleshooting, see [CICD_SETUP_GUIDE.md](../CICD_SETUP_GUIDE.md#troubleshooting).

---

## 🔄 Rollback

### Backend Rollback

```bash
# Via AWS Console
1. Go to Elastic Beanstalk
2. Select environment
3. Choose previous version
4. Click "Deploy"
```

### Frontend Rollback

```bash
# Re-run previous workflow
gh workflow run deploy.yml -f environment=production
```

---

## 📈 Monitoring

### Health Checks

```bash
# Backend
curl https://your-backend-url.com/actuator/health

# Frontend
curl -I https://your-frontend-url.com
```

### View Logs

- **Backend**: AWS CloudWatch Logs
- **Frontend**: CloudFront access logs
- **Pipeline**: GitHub Actions logs

---

## 💰 Cost Estimate

Approximate monthly AWS costs:

| Component                    | Development | Production        |
| ---------------------------- | ----------- | ----------------- |
| Elastic Beanstalk (t3.small) | $20         | $60 (auto-scaled) |
| RDS Database                 | $15         | $30 (Multi-AZ)    |
| S3 Storage                   | $1          | $5                |
| CloudFront                   | $1          | $10               |
| **Total**                    | **~$37/mo** | **~$105/mo**      |

---

## 🆘 Support

### Need Help?

1. Check the [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)
2. Review [CICD_SETUP_GUIDE.md](../CICD_SETUP_GUIDE.md)
3. Check GitHub Actions logs
4. Review AWS CloudWatch logs

### Common Issues

- **Build fails**: Run builds locally to debug
- **Deploy fails**: Check IAM permissions and environment variables
- **App doesn't work**: Verify database connectivity and API configuration

---

## 🎯 Best Practices

✅ Always test locally before pushing
✅ Use separate environments (dev/prod)
✅ Review deployment logs
✅ Monitor application health
✅ Keep dependencies updated
✅ Rotate AWS credentials regularly
✅ Use semantic versioning for releases

---

## 📝 Files in This Directory

```
.github/
├── workflows/
│   └── deploy.yml              # Main CI/CD workflow
├── ARCHITECTURE.md             # Architecture diagrams
├── ENVIRONMENT_EXAMPLES.md     # Configuration examples
├── README.md                   # This file
└── SETUP_CHECKLIST.md          # Setup checklist

../CICD_SETUP_GUIDE.md          # Detailed guide (root)
```

---

## 🔗 Related Documentation

- [Spring Boot Production Deployment](https://docs.spring.io/spring-boot/docs/current/reference/html/deployment.html)
- [Angular Deployment Guide](https://angular.io/guide/deployment)
- [AWS Elastic Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

## 📄 License

This CI/CD configuration is part of the Interview Assistant Application.

---

**Version**: 1.0  
**Last Updated**: November 2025  
**Maintained By**: DevOps Team
