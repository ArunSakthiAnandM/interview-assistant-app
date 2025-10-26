# Interview Assistant App - Frontend

## Project Overview

This is the frontend application for the Interview Assistant platform, built with **Angular 20** using modern best practices and features.

## Technology Stack

- **Angular 20** - Latest features with standalone components
- **TypeScript** - Strict type checking enabled
- **SCSS** - Styling with component-scoped styles
- **Signals** - Modern reactive state management

## Angular 20 Best Practices

### Component Architecture

- **ALWAYS use standalone components** - No NgModules
- **DO NOT set `standalone: true`** - It's the default in Angular 20
- Use `changeDetection: ChangeDetectionStrategy.OnPush` for optimal performance
- Keep components small and focused on single responsibility
- Prefer inline templates for small components

### Modern APIs

- Use `input()` and `output()` functions instead of `@Input()` and `@Output()` decorators
- Use `computed()` for derived state
- Use `effect()` for side effects
- Use the `inject()` function instead of constructor injection
- DO NOT use `@HostBinding` and `@HostListener` - use `host` object in decorator instead

### State Management

- Use **signals** for local component state
- Use `computed()` for derived state
- Use `set()` or `update()` methods - DO NOT use `mutate()`
- Keep state transformations pure and predictable

### Templates

- Use native control flow: `@if`, `@for`, `@switch` (NOT `*ngIf`, `*ngFor`, `*ngSwitch`)
- DO NOT use `ngClass` - use `[class.xxx]` bindings instead
- DO NOT use `ngStyle` - use `[style.xxx]` bindings instead
- Use `async` pipe for observables
- Keep templates simple - avoid complex logic

### Forms

- Prefer **Reactive Forms** over Template-driven forms
- Use typed forms with strict typing
- Implement proper validation

### Images

- Use `NgOptimizedImage` directive for all static images
- Note: `NgOptimizedImage` does not work for inline base64 images

### Services

- Design services around single responsibility
- Use `providedIn: 'root'` for singleton services
- Use `inject()` function for dependency injection

### Routing

- Implement lazy loading for feature routes
- Use route guards for authentication and authorization

## TypeScript Standards

- Use **strict type checking**
- Prefer type inference when obvious
- Avoid `any` type - use `unknown` when type is uncertain
- Use interfaces for data models
- Use enums or const objects for constants

## Code Quality

- Write maintainable, performant, and accessible code
- Follow SOLID principles
- Keep functions pure when possible
- Write meaningful tests

## Project Structure

- `/src/app` - Main application configuration and root component
- `/src/assets` - Static assets
- `/src/components` - All UI components organized by feature
- `/src/constants` - Application-wide constants
- `/src/guards` - Route guards for authentication and authorization
- `/src/models` - TypeScript interfaces and types
- `/src/services` - Business logic and API services
- `/src/store` - Signal-based state management stores
- `/src/utils` - Utility functions and interceptors

## Development Commands

```bash
npm install          # Install dependencies
npm start            # Start development server
npm run build        # Build for production
npm test             # Run unit tests
npm run lint         # Run linter
```

## Notes for AI Agents

- Always follow Angular 20 conventions strictly
- Check folder-specific AGENT.md files for detailed requirements
- Ensure all new code follows the established patterns
- Maintain consistency with existing codebase structure

## Documentation Policy

### **IMPORTANT: Update README.md, Don't Create New Files**

When making changes to the project:

- ❌ **DO NOT create separate .md files** to document changes (e.g., CHANGES.md, BUGFIXES.md, ENHANCEMENTS.md, etc.)
- ✅ **DO update the README.md file** directly to reflect the current state of the project

### What to Update in README.md

When you make changes, update the relevant sections in README.md:

1. **Features Section**: Update completed ✅ or pending 🚧 features
2. **Project Structure**: Add/remove components, services, or folders
3. **Architecture Section**: Document new patterns or architectural decisions
4. **Getting Started**: Update if setup steps change
5. **Configuration**: Add new environment variables or configuration
6. **Security**: Document new security measures
7. **Known Issues**: Add/remove known issues as they're discovered/fixed

### Example Workflow

When you:

- **Add a new feature** → Update "Features" section, mark as ✅
- **Fix a bug** → Remove from "Known Issues" if listed
- **Add a component** → Update "Project Structure" section
- **Change architecture** → Update "Architecture" section
- **Add dependencies** → Update "Technology Stack" section

### Maintaining README.md

The README.md should always represent the **current, final version** of the project:

- Keep it concise but comprehensive
- Remove outdated information
- Update version numbers and dates
- Ensure all links work
- Keep the table of contents synchronized

### When to Create New Documentation

Only create separate documentation files for:

- **API Documentation** (e.g., API.md) - Detailed API endpoint documentation
- **CONTRIBUTING.md** - Contribution guidelines for open source projects
- **CHANGELOG.md** - Version history (if using semantic versioning)
- **LICENSE** - Project license
- Folder-specific **AGENT.md** files (already exist)

**Remember**: README.md is the single source of truth for project documentation!
