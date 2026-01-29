# Dark Mode Implementation Guide

## Overview

Zali supports a comprehensive dark mode theme with three options:
- **Light Mode**: Traditional light theme
- **Dark Mode**: Dark theme for low-light environments
- **System Mode**: Automatically matches your system preferences

## Features

- 🌓 Three theme modes: light, dark, and system
- 💾 Persistent theme selection via localStorage
- 🔄 Smooth transitions between themes
- 🎨 CSS variables for consistent theming
- ♿ Accessible theme toggle component
- 📱 Full mobile and desktop support

## How It Works

### ThemeContext

The theme system is built on React Context (`ThemeContext.tsx`):

```typescript
const { theme, setTheme, resolvedTheme } = useTheme();
```

- `theme`: Current theme setting ('light' | 'dark' | 'system')
- `setTheme`: Function to change the theme
- `resolvedTheme`: The actual theme being displayed ('light' | 'dark')

### CSS Variables

Dark mode colors are defined in `globals.css`:

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
  /* ... */
}

.dark {
  --background: #030712;
  --foreground: #f9fafb;
  /* ... */
}
```

### Using Dark Mode in Components

#### Method 1: Tailwind Dark Mode Classes

```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  Content
</div>
```

#### Method 2: CSS Variables

```tsx
<div className="bg-background text-foreground">
  Content
</div>
```

## Theme Toggle Component

The `ThemeToggle` component provides an accessible UI for switching themes:

```tsx
import { ThemeToggle } from '@/components/ThemeToggle';

<ThemeToggle />
```

## Color Palette

### Light Mode
- Background: #ffffff
- Foreground: #171717
- Primary: #3b82f6
- Secondary: #f3f4f6

### Dark Mode
- Background: #030712
- Foreground: #f9fafb
- Primary: #3b82f6
- Secondary: #1f2937

## Best Practices

1. **Use CSS Variables**: Prefer `bg-background` over `bg-white dark:bg-gray-900`
2. **Test Both Modes**: Always test components in both light and dark modes
3. **Contrast Ratios**: Ensure WCAG AA compliance (4.5:1 for text)
4. **Transitions**: Add `transition-colors duration-300` for smooth theme changes
5. **Icons**: Ensure icons are visible in both modes

## Accessibility

- Theme toggle has descriptive aria-labels
- Smooth transitions prevent jarring changes
- High contrast ratios for readability
- System preference detection respects user settings

## Examples

### Button Component

```tsx
<button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
  Click me
</button>
```

### Card Component

```tsx
<div className="bg-card border border-border rounded-lg p-4">
  <h3 className="text-card-foreground">Card Title</h3>
</div>
```

### Input Component

```tsx
<input
  className="bg-input border border-border text-foreground focus:ring-ring"
  type="text"
/>
```

## Troubleshooting

### Theme not persisting
- Check localStorage is enabled
- Verify ThemeProvider is wrapping your app

### Colors not changing
- Ensure `.dark` class is applied to `<html>` element
- Check CSS variables are properly defined

### Flashing on page load
- Theme is applied before render via useEffect
- Consider adding `suppressHydrationWarning` to `<html>` tag

## Future Enhancements

- [ ] Custom color schemes
- [ ] Per-component theme overrides
- [ ] Theme preview in settings
- [ ] High contrast mode
- [ ] Color blind friendly palettes
