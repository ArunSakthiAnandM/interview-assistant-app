# Assets Folder - /src/assets

## Purpose

Contains static assets used throughout the application including images, icons, fonts, and other media files.

## Typical Structure

```
assets/
  ├── images/        # Application images
  ├── icons/         # Icon files (SVG, PNG, etc.)
  ├── fonts/         # Custom font files
  ├── data/          # Static JSON data files (if any)
  └── styles/        # Global style utilities (if any)
```

## Angular 20 Image Optimization

### Using NgOptimizedImage

For all static images, use the `NgOptimizedImage` directive:

```typescript
import { NgOptimizedImage } from '@angular/common';

@Component({
  // ...
  imports: [NgOptimizedImage],
})
export class MyComponent {
  // Component logic
}
```

```html
<!-- In template -->
<img ngSrc="assets/images/logo.png" alt="Logo" width="200" height="100" priority />
```

### Important Notes

- **ALWAYS** specify width and height for optimized images
- Use `priority` attribute for above-the-fold images
- `NgOptimizedImage` does **NOT** work with base64 inline images
- Prefer SVG for icons when possible for scalability

## File Organization

- Use descriptive filenames: `user-avatar.png`, `company-logo.svg`
- Organize by feature or type in subdirectories
- Keep file sizes optimized (compress images before adding)
- Use appropriate formats: SVG for icons/logos, WebP/PNG for photos

## Best Practices

- Compress images before committing
- Use SVG for scalable graphics
- Provide alt text for accessibility
- Use lazy loading for below-the-fold images
- Consider responsive images for different screen sizes

## Accessing Assets

```typescript
// In component
public logoPath = 'assets/images/logo.png';

// In templates
<img [ngSrc]="logoPath" alt="Logo" width="200" height="100">

// In SCSS
background-image: url('/assets/images/background.png');
```

## Notes for AI Agents

- This folder should only contain static files
- No TypeScript or Angular code should be placed here
- Use `NgOptimizedImage` for all image references in components
- Maintain organized subdirectories by asset type
- Reference assets using relative paths from the assets folder
