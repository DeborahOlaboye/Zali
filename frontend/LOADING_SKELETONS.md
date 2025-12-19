# Loading Skeletons Documentation

## Overview

Loading skeletons provide a better user experience by displaying placeholder animations while content is being loaded. This document describes how to use the skeleton components in the application.

## Available Skeleton Components

### 1. BaseSkeleton

The base skeleton component that can be customized for any use case.

**Props:**
- `width` (string | number): CSS width value (default: '100%')
- `height` (string | number): CSS height value (default: '1rem')
- `rounded` ('none' | 'sm' | 'md' | 'lg' | 'full'): Border radius style (default: 'md')
- `pulse` (boolean): Enable/disable pulse animation (default: true)
- `className` (string): Additional CSS classes

**Example:**
```tsx
import { BaseSkeleton } from '@/components/skeletons';

<BaseSkeleton width="200px" height="20px" rounded="md" />
```

### 2. LeaderboardSkeleton

Displays a skeleton for leaderboard player entries.

**Props:**
- `count` (number): Number of skeleton rows to display (default: 5)

**Example:**
```tsx
import { LeaderboardSkeleton } from '@/components/skeletons';

{isLoading ? (
  <LeaderboardSkeleton count={5} />
) : (
  <div>Leaderboard content</div>
)}
```

### 3. RewardCardSkeleton

Shows skeleton placeholders for reward cards.

**Props:**
- `count` (number): Number of reward cards to display (default: 4)

**Example:**
```tsx
import { RewardCardSkeleton } from '@/components/skeletons';

{isLoading ? (
  <RewardCardSkeleton count={4} />
) : (
  <div>Reward cards content</div>
)}
```

### 4. PlayerInfoSkeleton

Displays a skeleton for player profile information.

**Example:**
```tsx
import { PlayerInfoSkeleton } from '@/components/skeletons';

{!username ? (
  <PlayerInfoSkeleton />
) : (
  <div>Player info content</div>
)}
```

### 5. StatsCardSkeleton

Shows skeleton placeholders for statistics cards.

**Props:**
- `count` (number): Number of stat cards to display (default: 3)

**Example:**
```tsx
import { StatsCardSkeleton } from '@/components/skeletons';

{isLoading ? (
  <StatsCardSkeleton count={3} />
) : (
  <div>Statistics content</div>
)}
```

### 6. QuestionCardSkeleton

Displays a skeleton for trivia question cards.

**Example:**
```tsx
import { QuestionCardSkeleton } from '@/components/skeletons';

{isLoading ? (
  <QuestionCardSkeleton />
) : (
  <div>Question content</div>
)}
```

## Usage Patterns

### Pattern 1: Conditional Rendering Based on Loading State

```tsx
import { RewardCardSkeleton } from '@/components/skeletons';

export function MyComponent() {
  const { data, isLoading } = useData();

  return (
    <>
      {isLoading ? (
        <RewardCardSkeleton count={4} />
      ) : (
        <div>{data && data.map(item => ...)}</div>
      )}
    </>
  );
}
```

### Pattern 2: Conditional Rendering Based on Data Availability

```tsx
import { PlayerInfoSkeleton } from '@/components/skeletons';

export function ProfileComponent() {
  const { username } = usePlayerRegistration();

  return (
    <>
      {!username ? (
        <PlayerInfoSkeleton />
      ) : (
        <div>Profile Info: {username}</div>
      )}
    </>
  );
}
```

### Pattern 3: Combining Multiple Skeletons

```tsx
import { 
  PlayerInfoSkeleton,
  StatsCardSkeleton,
  LeaderboardSkeleton
} from '@/components/skeletons';

export function DashboardComponent() {
  const { isLoading } = useData();

  if (isLoading) {
    return (
      <div>
        <PlayerInfoSkeleton />
        <StatsCardSkeleton count={3} />
        <LeaderboardSkeleton count={5} />
      </div>
    );
  }

  return <div>Dashboard content</div>;
}
```

## Styling

All skeleton components use Tailwind CSS classes:
- Background color: `bg-gray-300`
- Animation: `animate-pulse`
- Border radius: Configurable via `rounded` prop

To customize colors or animations, pass a `className` prop to `BaseSkeleton` or override styles in your CSS.

## Testing

All skeleton components have unit tests in `src/components/__tests__/`. Run tests with:

```bash
npm test
```

## Performance Considerations

1. **Minimal DOM Footprint**: Skeletons are lightweight and don't add significant overhead.
2. **Pure CSS Animation**: Uses Tailwind's `animate-pulse` for smooth animations.
3. **No API Calls**: Skeletons are rendered client-side without any data fetching.

## Accessibility

- Skeleton components use `role="status"` for screen reader compatibility
- Set `aria-label="Loading"` for assistive technology
- Pulse animation is accessible to users with motion sensitivity through Tailwind's prefers-reduced-motion support

## Best Practices

1. **Use Appropriate Skeleton Types**: Choose skeletons that match the content structure.
2. **Show Skeletons During Loading**: Always display skeletons while data is being fetched.
3. **Maintain Layout Consistency**: Ensure skeleton layout matches final content layout.
4. **Limit Animation**: Use pulse animations sparingly to avoid visual fatigue.
5. **Test Loading States**: Always test component behavior during loading phases.

## Examples in the Codebase

- **Leaderboard Page**: `frontend/src/app/leaderboard/page.tsx`
- **Play Page**: `frontend/src/app/play/page.tsx`
- **Rewards Page**: `frontend/src/app/rewards/page.tsx`
- **Profile Page**: `frontend/src/app/profile/page.tsx`

## Customizing Skeletons

To create a custom skeleton component:

```tsx
import { BaseSkeleton } from '@/components/skeletons';

export const CustomSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <BaseSkeleton width="100%" height="40px" rounded="lg" />
      <div className="space-y-2">
        <BaseSkeleton width="80%" height="20px" />
        <BaseSkeleton width="60%" height="20px" />
      </div>
    </div>
  );
};
```

## Common Issues

### Issue: Skeleton doesn't animate
**Solution**: Ensure `animate-pulse` class is applied and Tailwind CSS is properly configured.

### Issue: Skeleton doesn't match content layout
**Solution**: Make sure the skeleton dimensions match the actual content dimensions.

### Issue: Multiple skeletons causing layout shift
**Solution**: Use a fixed container size or min-height for consistent layouts.
