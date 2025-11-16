# Styles Folder - /src/styles

## Purpose

This folder contains centralized SCSS variables, mixins, theme configuration, and shared styles for consistent Azure/Blue themed minimalist design across the Angular 20 application.

## Critical Conventions

### 1. SCSS Module System (NOT @import)

**✅ CORRECT - Use `@use` with namespaces:**

```scss
@use 'variables' as *; // Import all variables without namespace
@use 'dashboard-shared' as *; // Import all placeholders

.my-component {
  color: $color-primary; // From variables
  @extend %dashboard-container; // From dashboard-shared
}
```

**❌ INCORRECT - Never use `@import`:**

```scss
@import 'variables'; // DEPRECATED in modern SCSS
```

### 2. Variable Naming Conventions

**Semantic Naming Pattern:**

```scss
// Color hierarchy: base → functional → semantic
$primary-500: #3b82f6; // Base color
$color-primary: $primary-500; // Functional assignment
$bg-primary: $white; // Semantic usage
```

**Naming Rules:**

- **Colors:** `$primary-XXX`, `$secondary-XXX`, `$neutral-XXX`, `$success-XXX`, etc.
- **Functional:** `$color-primary`, `$bg-primary`, `$text-primary`, `$border-primary`
- **Semantic:** `$color-success`, `$color-error`, `$color-warning`, `$color-info`
- **Spacing:** `$spacing-xs` through `$spacing-2xl`
- **Border radius:** `$border-radius-sm` through `$border-radius-xl`
- **Transitions:** `$transition-fast`, `$transition-normal`, `$transition-slow`

### 3. Placeholder Selectors for Reusable Patterns

**Use `%` for extendable styles:**

```scss
// Define in _dashboard-shared.scss
%dashboard-container {
  padding: $spacing-lg;
  max-width: 1400px;
  margin: 0 auto;
}

// Use in components
.admin-dashboard {
  @extend %dashboard-container;
}
```

**Available Placeholders:**

- `%dashboard-container` - Main container layout
- `%dashboard-header` - Page header with title/subtitle
- `%stats-grid` - Responsive grid for stat cards
- `%stat-card` - Individual stat card styling
- `%loading-container` - Centered loading spinner
- `%empty-state` - Empty data placeholder
- `%interview-card` - Interview list card styling
- `%date-badge` - Calendar-style date badge

### 4. Component SCSS Usage Pattern

**Standard component setup:**

```scss
@use '@/styles/variables' as *;
@use '@/styles/dashboard-shared' as *;

.component-root {
  @extend %dashboard-container;

  .header {
    @extend %dashboard-header;
  }

  .custom-element {
    color: $color-primary;
    padding: $spacing-md;
    border-radius: $border-radius-md;
    transition: all $transition-normal;

    &:hover {
      background-color: $hover-overlay-primary;
    }
  }
}
```

### 5. Color Palette Guidelines

**Primary Colors (Blue):**

- Use for buttons, links, focus states
- Range: `$primary-900` (darkest) to `$primary-50` (lightest)
- Main: `$color-primary` → `$primary-500`

**Secondary Colors (Purple/Indigo):**

- Use for accents, highlights, secondary actions
- Range: `$secondary-900` to `$secondary-50`
- Main: `$color-secondary` → `$secondary-500`

**Semantic Colors:**

- **Success:** `$success-500` (#22c55e) - confirmations, completed states
- **Warning:** `$warning-500` (#f97316) - cautions, pending states
- **Error:** `$error-500` (#ef4444) - errors, destructive actions
- **Info:** `$info-500` (#0ea5e9) - informational messages

**Text Colors:**

- `$text-primary` - Main body text (87% black opacity)
- `$text-secondary` - Supporting text (60% black opacity)
- `$text-tertiary` - Subdued text (45% black opacity)
- `$text-disabled` - Disabled text (38% black opacity)
- `$text-on-primary` / `$text-on-dark` - White text on colored backgrounds

### 6. Spacing System

**Consistent spacing scale:**

```scss
$spacing-xs: 4px; // Tight spacing
$spacing-sm: 8px; // Small gaps
$spacing-md: 16px; // Default spacing
$spacing-lg: 24px; // Large gaps
$spacing-xl: 32px; // Extra large
$spacing-2xl: 48px; // Section separators
```

**Usage:**

```scss
.card {
  padding: $spacing-md; // 16px
  margin-bottom: $spacing-lg; // 24px
  gap: $spacing-sm; // 8px (for flex/grid)
}
```

### 7. Responsive Design Patterns

**Use CSS Grid with auto-fit:**

```scss
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-md;
}
```

**Avoid hard-coded breakpoints** - prefer flexible layouts with `auto-fit`, `auto-fill`, and `minmax()`.

### 8. Shadow and Elevation

**Shadow variables:**

```scss
$shadow-color: rgba($black, 0.1); // Light shadow
$shadow-color-dark: rgba($black, 0.15); // Medium shadow
$shadow-color-darker: rgba($black, 0.2); // Strong shadow
```

**Usage:**

```scss
.card {
  box-shadow: 0 2px 4px $shadow-color;

  &:hover {
    box-shadow: 0 4px 8px $shadow-color-dark;
  }
}
```

### 9. Gradient Usage

**Predefined gradients:**

```scss
$gradient-primary: linear-gradient(135deg, $primary-600 0%, $primary-500 100%);
$gradient-header: linear-gradient(90deg, $primary-800 0%, $primary-500 100%);
$gradient-blue-purple: linear-gradient(135deg, $primary-500 0%, $secondary-600 100%);
```

**Apply to backgrounds, headers, or accent elements:**

```scss
.hero-section {
  background: $gradient-header;
  color: $text-on-dark;
}
```

### 10. Transition Standards

**Timing functions:**

```scss
$transition-fast: 0.15s ease; // Quick interactions (hover effects)
$transition-normal: 0.2s ease; // Standard transitions
$transition-slow: 0.3s ease; // Animated entrances/exits
$transition-smooth: 0.2s cubic-bezier(0.4, 0, 0.2, 1); // Material design
```

**Usage:**

```scss
.button {
  transition: all $transition-normal; // Multiple properties
  transition: background-color $transition-fast, transform $transition-smooth; // Specific
}
```

## Production Standards

### File Organization

1. **\_variables.scss** - ALL global variables (colors, spacing, typography, shadows, etc.)
2. **\_mixins.scss** - Reusable SCSS mixins for common patterns
3. **\_theme.scss** - Angular Material theme configuration (Azure/Blue palette)
4. **Component SCSS** - Component-specific styles (never define global variables here)

### Naming Conventions

- **Variables:** `$kebab-case`
- **Placeholders:** `%kebab-case`
- **Selectors:** `.kebab-case`
- **Mixins:** `@mixin kebab-case`

### Performance Considerations

1. **Use placeholders (`%`) over mixins** when styles are identical
2. **Avoid deep nesting** (max 3 levels)
3. **Minimize `@extend` usage** in production builds
4. **Use CSS custom properties** for dynamic theming (if needed)

### Accessibility

1. **Contrast ratios:**

   - Normal text: 4.5:1 minimum
   - Large text: 3:1 minimum
   - Check with `$text-primary` on `$bg-primary`

2. **Focus indicators:**

   - Always visible
   - Use `$focus-outline` color
   - Minimum 2px outline

3. **Color-blind friendly:**
   - Don't rely on color alone
   - Use icons, labels, and patterns

## Common Pitfalls

1. ❌ Using `@import` instead of `@use`
2. ❌ Defining colors/variables in component SCSS files
3. ❌ Hard-coding color values (`#3b82f6` instead of `$color-primary`)
4. ❌ Inconsistent spacing (random pixel values instead of spacing scale)
5. ❌ Not using placeholder selectors for repeated patterns
6. ❌ Deep selector nesting (> 3 levels)
7. ❌ Importing `CommonModule` in components instead of specific pipes

## Style Import Path

Use the TypeScript path alias:

```scss
@use '@/styles/variables' as *;
@use '@/styles/dashboard-shared' as *;
```

**NOT:**

```scss
@use '../../../styles/variables' as *; // ❌ Fragile relative paths
```

## Adding New Variables

When adding new variables to `_variables.scss`:

1. **Follow the hierarchy:** Base → Functional → Semantic
2. **Document the purpose** with comments
3. **Group related variables** together
4. **Use consistent naming** patterns
5. **Consider dark mode** (if implementing in future)

## Adding New Shared Patterns

When adding to `_dashboard-shared.scss`:

1. **Use placeholder selectors** (`%pattern-name`)
2. **Keep patterns generic** and reusable
3. **Document usage** with comments
4. **Test across multiple components**

## Maintenance Checklist

- [ ] All colors defined in `_variables.scss`
- [ ] Consistent spacing scale used throughout
- [ ] No hard-coded colors in component SCSS
- [ ] Placeholders used for repeated patterns
- [ ] Modern `@use` syntax (not `@import`)
- [ ] Accessibility contrast ratios met
- [ ] Transitions use predefined variables
- [ ] No selector nesting beyond 3 levels

## Quick Reference

```scss
// Component template
@use '@/styles/variables' as *;
@use '@/styles/dashboard-shared' as *;

.component-name {
  // Layout
  @extend %dashboard-container;

  // Colors
  color: $text-primary;
  background-color: $bg-primary;
  border: 1px solid $border-medium;

  // Spacing
  padding: $spacing-md;
  gap: $spacing-sm;

  // Effects
  border-radius: $border-radius-md;
  box-shadow: 0 2px 4px $shadow-color;
  transition: all $transition-normal;

  // Hover state
  &:hover {
    background-color: $hover-overlay-light;
    box-shadow: 0 4px 8px $shadow-color-dark;
  }
}
```

## Support

For questions about styling patterns, refer to:

- Existing dashboard components for examples
- `_variables.scss` for available tokens
- `_dashboard-shared.scss` for reusable patterns
