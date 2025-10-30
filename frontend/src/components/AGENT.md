# Components Folder - /src/components

## Purpose

Contains all UI components for the Interview Assistant application, organized by feature or domain.

## Structure

Components are organized by feature areas:

- `dashboard/` - Dashboard views (admin, candidate, interviewer, organisation)
- `footer/` - Application footer
- `header/` - Application header/navigation
- `home/` - Home/landing page
- `interview/` - Interview management (create, list, detail, feedback)
- `login/` - Authentication
- `profile/` - User profile management
- `register/` - User registration flows
- `shared/` - Reusable shared components (file-upload, otp-input, etc.)

## Angular 20 Component Standards

### Component Structure

Each component should have:

- `[name].ts` - Component class
- `[name].html` - Template
- `[name].scss` - Styles
- `[name].spec.ts` - Unit tests

### Component Class Pattern

```typescript
import { Component, ChangeDetectionStrategy, input, output, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { inject } from '@angular/core';

@Component({
  selector: 'app-component-name',
  templateUrl: './component-name.html',
  styleUrl: './component-name.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // DO NOT set standalone: true - it's default
  imports: [DatePipe /* Import specific pipes/directives as needed, NOT CommonModule */],
  host: {
    // Use host object instead of @HostBinding/@HostListener
    '[class.active]': 'isActive()',
    '(click)': 'handleClick()',
  },
})
export class ComponentNameComponent {
  // Use inject() for dependencies
  private service = inject(SomeService);

  // Use input() function instead of @Input()
  data = input<DataType>();
  required = input.required<string>();

  // Use output() function instead of @Output()
  itemClicked = output<ItemType>();

  // Use signals for local state
  count = signal(0);

  // Use computed for derived state
  doubleCount = computed(() => this.count() * 2);

  // Methods
  handleClick() {
    this.count.update((c) => c + 1);
    this.itemClicked.emit({
      /* data */
    });
  }
}
```

### Template Patterns

```html
<!-- Use @if instead of *ngIf -->
@if (condition()) {
<div>Content</div>
}

<!-- Use @for instead of *ngFor -->
@for (item of items(); track item.id) {
<div>{{ item.name }}</div>
}

<!-- Use @switch instead of *ngSwitch -->
@switch (value()) { @case ('option1') {
<div>Option 1</div>
} @default {
<div>Default</div>
} }

<!-- Use class bindings instead of ngClass -->
<div [class.active]="isActive()" [class.disabled]="isDisabled()">
  <!-- Use style bindings instead of ngStyle -->
  <div [style.color]="textColor()" [style.font-size.px]="fontSize()">
    <!-- Use async pipe for observables -->
    <div>{{ data$ | async }}</div>
  </div>
</div>
```

## Component Best Practices

### Single Responsibility

- Each component should have one clear purpose
- Keep components small and focused
- Extract reusable logic into services
- Share common UI patterns in `shared/` folder

### State Management

- Use signals for local component state
- Use computed() for derived values
- Use effect() for side effects (sparingly)
- Lift state up or use store for shared state

### Styling

- Use component-scoped SCSS files
- Follow BEM or consistent naming convention
- Avoid deep nesting (max 3 levels)
- Use CSS custom properties for theming

### Accessibility

- Use semantic HTML elements
- Add proper ARIA attributes
- Ensure keyboard navigation
- Provide meaningful alt text for images

### Performance

- Use `OnPush` change detection
- Avoid complex logic in templates
- Use trackBy for @for loops
- Lazy load heavy components

## Forms

- Prefer Reactive Forms over Template-driven
- Use typed forms with FormControl<T>
- Implement proper validation
- Show meaningful error messages

## Shared Components

Place truly reusable components in `shared/`:

- Generic UI components (buttons, inputs, modals)
- Utility components (loaders, error displays)
- Layout components (cards, containers)

## Testing

- Write unit tests for all components
- Test user interactions
- Test input/output behavior
- Mock dependencies properly

## Notes for AI Agents

- Always use Angular 20 standalone component pattern
- Use modern signal-based APIs
- Follow the template syntax rules strictly
- Keep components small and maintainable
- Use inject() instead of constructor injection
- Organize components by feature domain
