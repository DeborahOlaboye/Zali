# Mobile Responsiveness Documentation

This document provides comprehensive documentation for the mobile responsiveness system implemented in the application.

## Table of Contents

1. [Overview](#overview)
2. [Hooks](#hooks)
3. [Components](#components)
4. [Usage Examples](#usage-examples)
5. [Best Practices](#best-practices)
6. [Breakpoints](#breakpoints)
7. [Testing](#testing)

## Overview

The mobile responsiveness system provides a complete solution for building responsive applications that work seamlessly across all devices. It includes:

- **Hooks** for media query detection and viewport management
- **Components** for responsive layouts, forms, and UI elements
- **Utilities** for breakpoint-specific rendering

### Key Features

- ✅ Custom media query hooks
- ✅ Predefined breakpoint hooks
- ✅ Responsive container components
- ✅ Mobile-optimized form components
- ✅ Adaptive typography
- ✅ Mobile menu with animations
- ✅ Responsive tables with card view
- ✅ Touch-friendly buttons

---

## Hooks

### useMediaQuery

Hook for detecting custom media query matches.

**Usage:**

```typescript
import { useMediaQuery } from '@/responsive';

function MyComponent() {
  const isLargeScreen = useMediaQuery('(min-width: 1200px)');

  return (
    <div>
      {isLargeScreen ? <DesktopLayout /> : <MobileLayout />}
    </div>
  );
}
```

### useIsMobile / useIsTablet / useIsDesktop

Predefined breakpoint hooks for common device types.

**Usage:**

```typescript
import { useIsMobile, useIsTablet, useIsDesktop } from '@/responsive';

function MyComponent() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();

  return (
    <div>
      {isMobile && <p>Mobile View</p>}
      {isTablet && <p>Tablet View</p>}
      {isDesktop && <p>Desktop View</p>}
    </div>
  );
}
```

### useBreakpoint

Hook to get the current breakpoint.

**Usage:**

```typescript
import { useBreakpoint } from '@/responsive';

function MyComponent() {
  const breakpoint = useBreakpoint(); // 'sm' | 'md' | 'lg' | 'xl' | '2xl'

  const columns = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
    '2xl': 5,
  }[breakpoint];

  return <Grid columns={columns} />;
}
```

### useViewport

Hook to get current viewport dimensions.

**Usage:**

```typescript
import { useViewport } from '@/responsive';

function MyComponent() {
  const { width, height } = useViewport();

  return (
    <div>
      Viewport: {width}x{height}
    </div>
  );
}
```

### useOrientation

Hook to detect device orientation.

**Usage:**

```typescript
import { useOrientation } from '@/responsive';

function MyComponent() {
  const orientation = useOrientation(); // 'portrait' | 'landscape'

  return (
    <div>
      {orientation === 'landscape' ? <LandscapeView /> : <PortraitView />}
    </div>
  );
}
```

---

## Components

### ResponsiveContainer

Container component with adaptive max-width and padding.

**Usage:**

```typescript
import { ResponsiveContainer } from '@/responsive';

<ResponsiveContainer
  maxWidth="lg"
  padding="md"
  centerContent
>
  {/* Content */}
</ResponsiveContainer>
```

### ResponsiveGrid

Grid component with adaptive columns.

**Usage:**

```typescript
import { ResponsiveGrid } from '@/responsive';

<ResponsiveGrid
  cols={{ sm: 1, md: 2, lg: 3, xl: 4 }}
  gap="md"
>
  {items.map(item => <Card key={item.id} {...item} />)}
</ResponsiveGrid>
```

### ResponsiveStack

Stack component with adaptive direction.

**Usage:**

```typescript
import { ResponsiveStack } from '@/responsive';

<ResponsiveStack
  direction="responsive" // vertical on mobile, horizontal on desktop
  gap="md"
  align="center"
  justify="between"
>
  <div>Item 1</div>
  <div>Item 2</div>
</ResponsiveStack>
```

### MobileOnly / DesktopOnly

Visibility components for responsive rendering.

**Usage:**

```typescript
import { MobileOnly, DesktopOnly } from '@/responsive';

<>
  <MobileOnly>
    <MobileNavigation />
  </MobileOnly>

  <DesktopOnly>
    <DesktopNavigation />
  </DesktopOnly>
</>
```

### ResponsiveRender

Component for breakpoint-specific content.

**Usage:**

```typescript
import { ResponsiveRender } from '@/responsive';

<ResponsiveRender
  mobile={<MobileView />}
  tablet={<TabletView />}
  desktop={<DesktopView />}
/>
```

### MobileMenu

Slide-in mobile menu with animations.

**Usage:**

```typescript
import { MobileMenu, MobileMenuButton, MobileMenuItem } from '@/responsive';
import { useState } from 'react';

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <MobileMenuButton onClick={() => setIsOpen(true)} />

      <MobileMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        position="right"
      >
        <MobileMenuItem label="Home" href="/" />
        <MobileMenuItem label="About" href="/about" />
        <MobileMenuItem label="Contact" href="/contact" />
      </MobileMenu>
    </>
  );
}
```

### ResponsiveText

Text component with adaptive font sizes.

**Usage:**

```typescript
import { ResponsiveText } from '@/responsive';

<ResponsiveText
  size="xl"
  weight="bold"
  align="center"
  responsive
>
  This text adapts to screen size
</ResponsiveText>
```

### ResponsiveHeading

Heading component with responsive sizing.

**Usage:**

```typescript
import { ResponsiveHeading } from '@/responsive';

<ResponsiveHeading
  level={1}
  align="center"
  gradient
>
  Welcome to Our App
</ResponsiveHeading>
```

### ResponsiveFormField

Form field with adaptive layout.

**Usage:**

```typescript
import { ResponsiveFormField, ResponsiveInput } from '@/responsive';

<ResponsiveFormField
  label="Email"
  required
  error={errors.email}
  hint="We'll never share your email"
  layout="responsive"
>
  <ResponsiveInput
    type="email"
    placeholder="you@example.com"
  />
</ResponsiveFormField>
```

### ResponsiveCard

Card component with adaptive padding and styles.

**Usage:**

```typescript
import {
  ResponsiveCard,
  ResponsiveCardHeader,
  ResponsiveCardBody,
  ResponsiveCardFooter
} from '@/responsive';

<ResponsiveCard padding="md" hover>
  <ResponsiveCardHeader
    title="Card Title"
    subtitle="Card subtitle"
  />
  <ResponsiveCardBody>
    Card content goes here
  </ResponsiveCardBody>
  <ResponsiveCardFooter align="right">
    <button>Action</button>
  </ResponsiveCardFooter>
</ResponsiveCard>
```

### ResponsiveButton

Button component with adaptive sizing.

**Usage:**

```typescript
import { ResponsiveButton } from '@/responsive';

<ResponsiveButton
  variant="primary"
  size="md"
  fullWidth
  icon={<Icon />}
  loading={isLoading}
  responsive
>
  Submit
</ResponsiveButton>
```

### ResponsiveTable

Table component that switches to cards on mobile.

**Usage:**

```typescript
import { ResponsiveTable } from '@/responsive';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email', hideOnMobile: true },
  {
    key: 'status',
    label: 'Status',
    render: (value) => <StatusBadge status={value} />
  },
];

<ResponsiveTable
  columns={columns}
  data={users}
  mobileCardView
  striped
  hover
/>
```

---

## Usage Examples

### Example 1: Responsive Page Layout

```typescript
import {
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveHeading
} from '@/responsive';

function HomePage() {
  return (
    <ResponsiveContainer maxWidth="xl" padding="md">
      <ResponsiveHeading level={1} align="center" gradient>
        Welcome to Our App
      </ResponsiveHeading>

      <ResponsiveGrid
        cols={{ sm: 1, md: 2, lg: 3 }}
        gap="md"
        className="mt-8"
      >
        {features.map(feature => (
          <FeatureCard key={feature.id} {...feature} />
        ))}
      </ResponsiveGrid>
    </ResponsiveContainer>
  );
}
```

### Example 2: Responsive Form

```typescript
import {
  ResponsiveFormField,
  ResponsiveInput,
  ResponsiveTextarea,
  ResponsiveFormActions,
  ResponsiveButton,
} from '@/responsive';

function ContactForm() {
  return (
    <form>
      <ResponsiveFormField label="Name" required>
        <ResponsiveInput placeholder="John Doe" />
      </ResponsiveFormField>

      <ResponsiveFormField label="Email" required>
        <ResponsiveInput type="email" placeholder="john@example.com" />
      </ResponsiveFormField>

      <ResponsiveFormField label="Message" required>
        <ResponsiveTextarea rows={5} placeholder="Your message..." />
      </ResponsiveFormField>

      <ResponsiveFormActions align="right">
        <ResponsiveButton variant="outline">Cancel</ResponsiveButton>
        <ResponsiveButton variant="primary">Submit</ResponsiveButton>
      </ResponsiveFormActions>
    </form>
  );
}
```

### Example 3: Responsive Navigation

```typescript
import {
  MobileOnly,
  DesktopOnly,
  MobileMenu,
  MobileMenuButton,
  MobileMenuItem,
} from '@/responsive';

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <DesktopOnly>
        <nav className="flex items-center space-x-6">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
      </DesktopOnly>

      {/* Mobile Navigation */}
      <MobileOnly>
        <MobileMenuButton onClick={() => setIsMenuOpen(true)} />

        <MobileMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        >
          <MobileMenuItem label="Home" href="/" />
          <MobileMenuItem label="About" href="/about" />
          <MobileMenuItem label="Contact" href="/contact" />
        </MobileMenu>
      </MobileOnly>
    </>
  );
}
```

---

## Best Practices

### 1. Use Mobile-First Approach

Start with mobile styles and add complexity for larger screens:

```typescript
// Good: Mobile-first
<div className="px-4 md:px-6 lg:px-8">

// Avoid: Desktop-first
<div className="px-8 md:px-6 sm:px-4">
```

### 2. Touch-Friendly Targets

Ensure interactive elements are at least 44x44 pixels on mobile:

```typescript
<ResponsiveButton size="md"> // Automatically sized for touch
  Click Me
</ResponsiveButton>
```

### 3. Test on Real Devices

Always test on actual mobile devices, not just browser dev tools.

### 4. Optimize Images

Use responsive images with appropriate sizes:

```typescript
<picture>
  <source media="(max-width: 768px)" srcSet="mobile.jpg" />
  <source media="(min-width: 769px)" srcSet="desktop.jpg" />
  <img src="fallback.jpg" alt="Responsive image" />
</picture>
```

### 5. Consider Orientation

Handle both portrait and landscape orientations:

```typescript
const orientation = useOrientation();

return (
  <div className={orientation === 'landscape' ? 'flex-row' : 'flex-col'}>
    {/* Content */}
  </div>
);
```

---

## Breakpoints

The application uses the following breakpoints:

| Breakpoint | Min Width | Max Width | Description    |
|-----------|-----------|-----------|----------------|
| sm        | 0px       | 640px     | Small mobile   |
| md        | 641px     | 768px     | Large mobile   |
| lg        | 769px     | 1024px    | Tablet         |
| xl        | 1025px    | 1280px    | Small desktop  |
| 2xl       | 1281px    | ∞         | Large desktop  |

---

## Testing

### Testing Responsive Components

```typescript
import { render, screen } from '@testing-library/react';
import { useIsMobile } from '@/responsive';

// Mock the hook
jest.mock('@/responsive', () => ({
  useIsMobile: jest.fn(),
}));

describe('ResponsiveComponent', () => {
  it('renders mobile view on mobile', () => {
    (useIsMobile as jest.Mock).mockReturnValue(true);

    render(<MyComponent />);

    expect(screen.getByText('Mobile View')).toBeInTheDocument();
  });

  it('renders desktop view on desktop', () => {
    (useIsMobile as jest.Mock).mockReturnValue(false);

    render(<MyComponent />);

    expect(screen.getByText('Desktop View')).toBeInTheDocument();
  });
});
```

### Testing Media Queries

```typescript
import { renderHook } from '@testing-library/react';
import { useMediaQuery } from '@/responsive';

describe('useMediaQuery', () => {
  it('detects mobile viewport', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(max-width: 768px)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    });

    const { result } = renderHook(() =>
      useMediaQuery('(max-width: 768px)')
    );

    expect(result.current).toBe(true);
  });
});
```

---

## Additional Resources

- [MDN - Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Web.dev - Responsive Design](https://web.dev/responsive-web-design-basics/)
- [TailwindCSS - Responsive Design](https://tailwindcss.com/docs/responsive-design)

---

For more information or questions, please refer to the code documentation or open an issue on GitHub.
