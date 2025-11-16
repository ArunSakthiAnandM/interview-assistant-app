# Environments Folder Guidelines

## Purpose

This folder contains environment-specific configurations for development, staging, and production environments. Provides type-safe configuration management with feature flags, API settings, and integration configurations.

## Critical Conventions

### 1. Type-Safe Configuration

**Always use the `Environment` interface:**

```typescript
import { Environment } from './environment.interface';

export const environment: Environment = {
  production: true,
  apiBaseUrl: 'https://api.example.com/api/v1',
  // ... TypeScript ensures all required properties are present
};
```

**Benefits:**

- Compile-time type checking
- IDE autocomplete support
- Prevents configuration errors
- Documents expected properties

### 2. Importing Environment in Application

**✅ CORRECT - Use barrel export:**

```typescript
import { environment } from '@/environments';

// Access configuration
const apiUrl = environment.apiBaseUrl;
const isProduction = environment.production;
```

**✅ CORRECT - Import specific environment (testing):**

```typescript
import { environment as devEnv } from '@/environments/environment.development';
import { environment as prodEnv } from '@/environments/environment';
```

**❌ INCORRECT - Direct path imports:**

```typescript
import { environment } from '../environments/environment'; // Use path alias
```

### 3. Environment Selection (Angular Build)

Angular automatically replaces `environment.ts` based on the build configuration:

```bash
npm start                    # Uses environment.development.ts
ng build --configuration=development  # Uses environment.development.ts
ng build --configuration=staging      # Uses environment.staging.ts
ng build --configuration=production   # Uses environment.ts
npm run build:prod           # Uses environment.ts
```

**Configuration in `angular.json`:**

```json
{
  "configurations": {
    "production": {
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.production.ts"
        }
      ]
    }
  }
}
```

### 4. Configuration Structure

#### Core Properties

**production (boolean):**

- Controls optimization, minification, source maps
- Affects error handling and logging verbosity

**apiBaseUrl (string):**

- Base URL for all HTTP requests
- Used by `HttpClient` and interceptors
- Should NOT include trailing slash

**environmentName:**

- Identifies current environment
- Useful for conditional logic and debugging

#### Feature Flags

Control feature availability across environments:

```typescript
features: {
  enableWebSocket: true,      // Real-time updates
  enableAnalytics: true,      // User behavior tracking
  enableVirusScan: true,      // File upload security
  enableDebugMode: false,     // Extra logging/debugging
  enableMockData: false,      // Use mock data instead of API
}
```

**Usage in components:**

```typescript
import { environment } from '@/environments';

if (environment.features.enableWebSocket) {
  this.initializeWebSocket();
}

if (environment.features.enableDebugMode) {
  console.log('Debug info:', data);
}
```

#### API Configuration

```typescript
api: {
  timeout: 30000,           // Request timeout (ms)
  retryAttempts: 3,         // Failed request retries
  retryDelay: 2000,         // Delay between retries (ms)
  enableLogging: false,     // Log API calls
}
```

**Integration with interceptors:**

```typescript
// In HTTP interceptor
const timeout$ = timer(environment.api.timeout);
return next.pipe(retry(environment.api.retryAttempts), takeUntil(timeout$));
```

#### Authentication Configuration

```typescript
auth: {
  tokenKey: 'access_token',          // localStorage key for JWT
  refreshTokenKey: 'refresh_token',  // localStorage key for refresh token
  userDataKey: 'user_data',          // localStorage key for user object
  refreshThreshold: 300,             // Refresh token 5 min before expiry
  autoLogout: true,                  // Logout on token expiry
}
```

**Usage in AuthService:**

```typescript
private getToken(): string | null {
  return localStorage.getItem(environment.auth.tokenKey);
}

private shouldRefreshToken(expiresAt: number): boolean {
  const now = Date.now() / 1000;
  return (expiresAt - now) < environment.auth.refreshThreshold;
}
```

#### Logging Configuration

```typescript
logging: {
  enableConsole: false,              // Console.log output
  logLevel: 'error',                 // 'debug' | 'info' | 'warn' | 'error'
  enableRemoteLogging: true,         // Send to Sentry/similar
  remoteLoggingUrl?: string,         // Error tracking service URL
}
```

**Usage in LoggerService:**

```typescript
private log(level: string, message: string, data?: any): void {
  if (!this.shouldLog(level)) return;

  if (environment.logging.enableConsole) {
    console[level](message, data);
  }

  if (environment.logging.enableRemoteLogging) {
    this.sendToRemoteLogger(level, message, data);
  }
}
```

#### File Upload Configuration

```typescript
upload: {
  maxFileSize: 10485760,             // 10MB in bytes
  allowedKycFileTypes: [             // KYC document types
    'image/jpeg',
    'image/png',
    'application/pdf'
  ],
  allowedFeedbackFileTypes: [        // Feedback attachment types
    'image/jpeg',
    'application/pdf',
    'application/msword'
  ],
  chunkSize: 1048576,                // 1MB chunks for large files
}
```

**Usage in FileUploadService:**

```typescript
validateFile(file: File, type: 'kyc' | 'feedback'): boolean {
  const allowedTypes = type === 'kyc'
    ? environment.upload.allowedKycFileTypes
    : environment.upload.allowedFeedbackFileTypes;

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }

  if (file.size > environment.upload.maxFileSize) {
    throw new Error('File too large');
  }

  return true;
}
```

#### Notifications Configuration

```typescript
notifications: {
  duration: 5000,              // Auto-dismiss after 5 seconds
  maxNotifications: 3,         // Max concurrent notifications
  enableSound: true,           // Audio notifications
  enablePushNotifications: true, // Browser push notifications
}
```

#### Third-Party Integrations

```typescript
integrations: {
  googleAnalyticsId?: string,   // Google Analytics tracking ID
  sentryDsn?: string,           // Sentry error tracking DSN
  webSocketUrl?: string,        // WebSocket server URL
}
```

**Usage in AnalyticsService:**

```typescript
initializeAnalytics(): void {
  if (environment.integrations?.googleAnalyticsId) {
    // Initialize Google Analytics
    gtag('config', environment.integrations.googleAnalyticsId);
  }
}
```

## Environment-Specific Configurations

### Development Environment

**Characteristics:**

- `production: false`
- Verbose logging (`logLevel: 'debug'`)
- API logging enabled
- Mock data support
- Relaxed security (no virus scan)
- Local API URL: `http://localhost:8080/api/v1`

**When to use:**

- Local development
- Unit testing
- Feature development

### Staging Environment

**Characteristics:**

- `production: false` (but production-like)
- Moderate logging (`logLevel: 'info'`)
- Real integrations (analytics, error tracking)
- Production-like API URL
- All security features enabled

**When to use:**

- Pre-production testing
- Client demos
- QA testing
- Integration testing

### Production Environment

**Characteristics:**

- `production: true`
- Minimal logging (`logLevel: 'error'`)
- All security features enabled
- No debug mode or mock data
- Real API URL and integrations
- Optimized performance

**When to use:**

- Live application
- End-user access

## Best Practices

### 1. Never Commit Secrets

**❌ NEVER do this:**

```typescript
export const environment = {
  apiKey: 'sk_live_abc123xyz', // NEVER commit real API keys
  sentryDsn: 'https://abc@sentry.io/123', // Use environment variables
};
```

**✅ CORRECT approach:**

```typescript
export const environment = {
  apiKey: undefined, // TODO: Set via CI/CD environment variables
  sentryDsn: undefined, // Will be injected at build time
};
```

### 2. Use Feature Flags for Gradual Rollouts

```typescript
// Enable feature only in specific environments
if (environment.features.enableNewFeature && environment.environmentName === 'staging') {
  this.loadNewFeature();
}
```

### 3. Validate Required Configuration

```typescript
// In app initialization (app.config.ts or main.ts)
if (environment.production && !environment.integrations?.sentryDsn) {
  console.warn('Sentry DSN not configured for production!');
}
```

### 4. Document TODOs for Production

Mark configuration items that need updating:

```typescript
apiBaseUrl: 'https://api.example.com/api/v1', // TODO: Update before deployment
googleAnalyticsId: undefined, // TODO: Add production GA ID
```

### 5. Type Safety for New Properties

When adding new configuration:

1. Update `environment.interface.ts` first
2. TypeScript will error on incomplete environments
3. Add the property to all environment files

```typescript
// 1. Add to interface
export interface Environment {
  newFeature: {
    enabled: boolean;
    apiEndpoint: string;
  };
}

// 2. TypeScript forces you to add to all environments
export const environment: Environment = {
  // ... existing config
  newFeature: {
    enabled: true,
    apiEndpoint: '/api/v1/new-feature',
  },
};
```

### 6. Avoid Logic in Environment Files

**❌ INCORRECT:**

```typescript
export const environment = {
  apiBaseUrl: process.env['API_URL'] || 'http://localhost:8080', // No runtime logic
  isDev: !this.production, // No computed properties
};
```

**✅ CORRECT:**

```typescript
// Keep environment files as pure configuration objects
export const environment = {
  apiBaseUrl: 'http://localhost:8080',
  production: false,
};

// Put logic in services
export class EnvironmentService {
  isDevelopment(): boolean {
    return !environment.production;
  }
}
```

## Common Use Cases

### 1. Conditional API Endpoint

```typescript
const endpoint = environment.production ? '/api/v1/users' : '/api/v1/mock-users';
```

### 2. Debug Logging

```typescript
if (environment.features.enableDebugMode) {
  console.log('API Response:', response);
}
```

### 3. Feature Toggle

```typescript
@if (environment.features.enableNewDashboard) {
  <app-new-dashboard />
} @else {
  <app-legacy-dashboard />
}
```

### 4. Environment-Specific Behavior

```typescript
initializeApp(): void {
  if (environment.production) {
    this.initErrorTracking();
    this.initAnalytics();
  } else {
    this.initMockData();
    this.enableDebugTools();
  }
}
```

## Security Considerations

### 1. Client-Side Configuration is Public

**Everything in environment files is visible to users.** Never store:

- API keys or secrets
- Private tokens
- Database credentials
- Encryption keys

### 2. Use Backend for Sensitive Configuration

Fetch sensitive config from backend after authentication:

```typescript
this.configService.getSecureConfig().subscribe((config) => {
  this.apiKey = config.apiKey; // Fetched securely, not in environment
});
```

### 3. Environment Variables via CI/CD

Use build-time environment variable substitution:

```bash
# In CI/CD pipeline
export API_URL=https://api.production.com
ng build --configuration=production
```

## Testing with Environments

### Unit Tests

```typescript
import { environment } from '@/environments';

describe('MyService', () => {
  it('should use correct API URL', () => {
    expect(service.apiUrl).toBe(environment.apiBaseUrl);
  });

  it('should enable logging in dev', () => {
    // Mock environment for testing
    spyOnProperty(environment, 'production').and.returnValue(false);
    expect(service.shouldLog()).toBe(true);
  });
});
```

### E2E Tests

```typescript
// Use staging environment for E2E tests
import { environment } from '@/environments/environment.staging';

describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit(environment.apiBaseUrl);
  });
});
```

## Troubleshooting

### Problem: Wrong environment loaded

**Solution:** Check `angular.json` fileReplacements configuration.

### Problem: TypeScript errors after adding property

**Solution:** Add property to ALL environment files (dev, staging, prod).

### Problem: Environment changes not reflected

**Solution:**

1. Stop dev server
2. Clear build cache: `rm -rf .angular/cache`
3. Restart: `npm start`

### Problem: Production API URL not working

**Solution:** Check CORS configuration on backend matches production URL.

## Maintenance Checklist

- [ ] All environments implement full `Environment` interface
- [ ] No secrets or API keys committed
- [ ] Production URLs marked with TODO comments
- [ ] Feature flags documented in code
- [ ] Staging environment mirrors production settings
- [ ] Integration IDs prepared for deployment
- [ ] File size limits appropriate for use case
- [ ] Timeout values tested under load
- [ ] Logging levels appropriate for environment

## Quick Reference

```typescript
// Import environment
import { environment } from '@/environments';

// Common checks
if (environment.production) {
  /* production only */
}
if (environment.features.enableDebugMode) {
  /* debug code */
}

// API configuration
const url = `${environment.apiBaseUrl}/users`;
const timeout = environment.api.timeout;

// Feature flags
const showNewFeature = environment.features.enableNewFeature;

// Upload validation
const maxSize = environment.upload.maxFileSize;
const allowedTypes = environment.upload.allowedKycFileTypes;

// Authentication
const token = localStorage.getItem(environment.auth.tokenKey);
```

## Angular CLI Integration

### Build Commands

```bash
# Development (uses environment.development.ts)
npm start
ng serve

# Staging (uses environment.staging.ts)
ng build --configuration=staging

# Production (uses environment.ts)
npm run build:prod
ng build --configuration=production
```

### Configuration in angular.json

```json
{
  "build": {
    "configurations": {
      "production": {
        "fileReplacements": [
          {
            "replace": "src/environments/environment.ts",
            "with": "src/environments/environment.ts"
          }
        ]
      },
      "development": {
        "fileReplacements": [
          {
            "replace": "src/environments/environment.ts",
            "with": "src/environments/environment.development.ts"
          }
        ]
      },
      "staging": {
        "fileReplacements": [
          {
            "replace": "src/environments/environment.ts",
            "with": "src/environments/environment.staging.ts"
          }
        ]
      }
    }
  }
}
```

## Support

For environment-related questions:

- Check `environment.interface.ts` for available properties
- Review existing environment files for examples
- Consult Angular documentation on environment configurations
- Check CI/CD pipeline for environment variable injection
