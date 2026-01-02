# Loading Indicators System

This document describes the comprehensive loading indicators system implemented in the Zali application.

## Overview

The loading system provides a unified approach to handling loading states across the application with:

- **Centralized state management** via Zustand store
- **Multiple loading components** for different use cases
- **Progress tracking** with smooth animations
- **Consistent user experience** across all pages
- **Accessibility support** with proper ARIA attributes

## Components

### LoadingSpinner

A versatile spinner component with customizable size, color, message, and progress.

```tsx
import { LoadingSpinner } from '@/components/loading';

<LoadingSpinner
  size="lg"
  color="primary"
  message="Loading data..."
  progress={75}
/>
```

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `color`: 'primary' | 'secondary' | 'white' | 'gray'
- `message`: Optional loading message
- `progress`: Optional progress percentage (0-100)
- `className`: Additional CSS classes

### LoadingButton

A button component with integrated loading states and spinner.

```tsx
import { LoadingButton } from '@/components/loading';

<LoadingButton
  isLoading={isSubmitting}
  loadingText="Submitting..."
  variant="primary"
  size="lg"
  onClick={handleSubmit}
>
  Submit Form
</LoadingButton>
```

**Props:**
- `isLoading`: Boolean loading state
- `loadingText`: Text to show when loading
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- All standard button props

### LoadingOverlay

A full-screen overlay for global loading states.

```tsx
import { LoadingOverlay } from '@/components/loading';

<LoadingOverlay
  isVisible={isLoading}
  message="Processing transaction..."
  progress={50}
  backdrop={true}
/>
```

**Props:**
- `isVisible`: Boolean to show/hide overlay
- `message`: Optional loading message
- `progress`: Optional progress percentage
- `backdrop`: Show backdrop (default: true)
- `size`: Spinner size

### LoadingCard

A card-based loading component for content areas.

```tsx
import { LoadingCard } from '@/components/loading';

<LoadingCard
  title="Loading Game"
  message="Fetching questions from blockchain..."
  progress={60}
  showSpinner={true}
/>
```

**Props:**
- `title`: Optional card title
- `message`: Optional loading message
- `progress`: Optional progress percentage
- `showSpinner`: Show/hide spinner (default: true)
- `children`: Optional custom content

### LoadingDots

Subtle animated dots for inline loading states.

```tsx
import { LoadingDots } from '@/components/loading';

<LoadingDots size="md" color="primary" />
```

**Props:**
- `size`: 'sm' | 'md' | 'lg'
- `color`: 'primary' | 'secondary' | 'white' | 'gray'

### ProgressBar

Standalone progress bar component.

```tsx
import { ProgressBar } from '@/components/loading';

<ProgressBar
  progress={75}
  label="Upload Progress"
  color="success"
  showPercentage={true}
/>
```

**Props:**
- `progress`: Progress percentage (0-100)
- `label`: Optional label text
- `color`: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `showPercentage`: Show percentage text

### Skeleton Components

Enhanced skeleton loading components.

```tsx
import { Skeleton, TextSkeleton, CardSkeleton, ButtonSkeleton } from '@/components/loading';

// Basic skeleton
<Skeleton width="100%" height="2rem" shape="rectangle" />

// Text skeleton
<TextSkeleton lines={3} />

// Card skeleton
<CardSkeleton />

// Button skeleton
<ButtonSkeleton width="120px" height="40px" />
```

## Hooks

### useLoading

A custom hook for managing loading states with the centralized store.

```tsx
import { useLoading } from '@/components/loading';

function MyComponent() {
  const { 
    isLoading, 
    message, 
    progress, 
    setLoading, 
    clearLoading, 
    updateProgress, 
    updateMessage 
  } = useLoading({ component: 'my-component' });

  const handleSubmit = async () => {
    setLoading(true, 'Starting process...', 0);
    
    try {
      updateMessage('Step 1: Validating...');
      updateProgress(25);
      await step1();
      
      updateMessage('Step 2: Processing...');
      updateProgress(50);
      await step2();
      
      updateMessage('Step 3: Finalizing...');
      updateProgress(75);
      await step3();
      
      updateProgress(100);
      clearLoading();
    } catch (error) {
      clearLoading();
      // Handle error
    }
  };

  return (
    <LoadingButton
      isLoading={isLoading}
      loadingText={message}
      onClick={handleSubmit}
    >
      Submit
    </LoadingButton>
  );
}
```

**Options:**
- `component`: Component identifier for isolated loading state
- `global`: Use global loading state (default: false)

**Returns:**
- `isLoading`: Current loading state
- `message`: Current loading message
- `progress`: Current progress percentage
- `setLoading(isLoading, message?, progress?)`: Set loading state
- `clearLoading()`: Clear loading state
- `updateProgress(progress, message?)`: Update progress
- `updateMessage(message)`: Update message
- `clearAllLoading()`: Clear all loading states

## State Management

The loading system uses Zustand for centralized state management:

```tsx
interface UISlice {
  globalLoading: LoadingState;
  componentLoading: Record<string, LoadingState>;
  setGlobalLoading: (loading: LoadingState) => void;
  setComponentLoading: (component: string, loading: LoadingState) => void;
  clearComponentLoading: (component: string) => void;
  clearAllLoading: () => void;
}

interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}
```

## Provider Setup

The `LoadingProvider` is integrated into the main app layout:

```tsx
// app/layout.tsx
import { LoadingProvider } from '@/components/LoadingProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>
          <LoadingProvider>
            {children}
          </LoadingProvider>
        </Providers>
      </body>
    </html>
  );
}
```

## Usage Examples

### Page-Level Loading

```tsx
function PlayPage() {
  const { setLoading, clearLoading } = useLoading({ component: 'play-page' });

  const handleStartGame = async () => {
    setLoading(true, 'Preparing game...', 10);
    
    try {
      updateMessage('Checking registration...');
      updateProgress(25);
      await checkRegistration();
      
      updateMessage('Starting game session...');
      updateProgress(50);
      await startGameSession();
      
      updateMessage('Loading questions...');
      updateProgress(75);
      await loadQuestions();
      
      updateProgress(100);
      clearLoading();
      router.push('/play/game');
    } catch (error) {
      clearLoading();
      toast.error('Failed to start game');
    }
  };

  return (
    <LoadingButton
      isLoading={isLoading}
      loadingText={message}
      onClick={handleStartGame}
    >
      Start Game
    </LoadingButton>
  );
}
```

### Global Loading

```tsx
function App() {
  const { setLoading, clearLoading } = useLoading({ global: true });

  const handleGlobalAction = async () => {
    setLoading(true, 'Processing...', 0);
    
    // Long-running operation
    await processData();
    
    clearLoading();
  };
}
```

### Form Submission

```tsx
function RegisterForm() {
  const { isLoading, setLoading, clearLoading } = useLoading({ 
    component: 'register-form' 
  });

  const onSubmit = async (data) => {
    setLoading(true, 'Registering username...', 25);
    
    try {
      await registerUsername(data.username);
      setLoading(true, 'Registration successful!', 100);
      clearLoading();
    } catch (error) {
      clearLoading();
      toast.error('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username')} />
      <LoadingButton
        type="submit"
        isLoading={isLoading}
        loadingText="Registering..."
      >
        Register
      </LoadingButton>
    </form>
  );
}
```

## Best Practices

### 1. Use Appropriate Components

- **LoadingSpinner**: For inline loading states
- **LoadingButton**: For interactive elements
- **LoadingOverlay**: For blocking operations
- **LoadingCard**: For content areas
- **LoadingDots**: For subtle indicators
- **Skeleton**: For content placeholders

### 2. Provide Meaningful Messages

```tsx
// Good
setLoading(true, 'Submitting transaction to blockchain...', 50);

// Bad
setLoading(true, 'Loading...', 50);
```

### 3. Use Progress Indicators

```tsx
const handleMultiStepProcess = async () => {
  setLoading(true, 'Step 1: Validation', 0);
  await step1();
  
  updateMessage('Step 2: Processing');
  updateProgress(33);
  await step2();
  
  updateMessage('Step 3: Finalizing');
  updateProgress(66);
  await step3();
  
  updateProgress(100);
  clearLoading();
};
```

### 4. Handle Errors Properly

```tsx
try {
  setLoading(true, 'Processing...');
  await operation();
  clearLoading();
} catch (error) {
  clearLoading(); // Always clear loading on error
  handleError(error);
}
```

### 5. Use Component-Specific Loading

```tsx
// Good - isolated loading state
const { setLoading } = useLoading({ component: 'user-profile' });

// Avoid - global loading for component-specific actions
const { setLoading } = useLoading({ global: true });
```

## Accessibility

All loading components include proper accessibility features:

- **ARIA attributes** for screen readers
- **Role attributes** for semantic meaning
- **Live regions** for dynamic content updates
- **Focus management** during loading states
- **Keyboard navigation** support

## Testing

The loading system includes comprehensive tests:

```bash
# Run loading component tests
npm test LoadingSpinner
npm test LoadingButton
npm test useLoading
```

## Performance

The loading system is optimized for performance:

- **Minimal re-renders** with Zustand
- **Smooth animations** with Framer Motion
- **Lazy loading** of components
- **Memory efficient** state management
- **Debounced updates** for rapid state changes

## Migration Guide

To migrate existing loading states to the new system:

1. Replace custom spinners with `LoadingSpinner`
2. Replace loading buttons with `LoadingButton`
3. Use `useLoading` hook instead of local state
4. Add progress indicators where appropriate
5. Update tests to use new components

## Troubleshooting

### Common Issues

1. **Loading state not clearing**: Ensure `clearLoading()` is called in error handlers
2. **Multiple loading states**: Use component-specific loading instead of global
3. **Performance issues**: Avoid frequent progress updates (debounce if needed)
4. **Accessibility warnings**: Ensure proper ARIA attributes are present

### Debug Mode

Enable debug mode to log loading state changes:

```tsx
const { setLoading } = useLoading({ 
  component: 'debug-component',
  debug: true // Enable logging
});
```

## Future Enhancements

Planned improvements:

- **Queue management** for multiple loading operations
- **Retry mechanisms** with exponential backoff
- **Loading analytics** and performance metrics
- **Custom animation presets**
- **Theme integration** with design system
- **Internationalization** support for messages