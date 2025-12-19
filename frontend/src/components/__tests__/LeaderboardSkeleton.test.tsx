import React from 'react';
import { render } from '@testing-library/react';
import { LeaderboardSkeleton } from '../skeletons/LeaderboardSkeleton';

describe('LeaderboardSkeleton', () => {
  it('renders with default count of 5', () => {
    const { container } = render(<LeaderboardSkeleton />);
    const skeletonItems = container.querySelectorAll('[role="status"]');
    
    expect(skeletonItems.length).toBeGreaterThan(0);
  });

  it('renders with custom count', () => {
    const { container } = render(<LeaderboardSkeleton count={3} />);
    const rows = container.querySelectorAll('.flex.items-center.justify-between');
    
    expect(rows.length).toBe(3);
  });

  it('renders multiple skeleton items in grid layout', () => {
    const { container } = render(<LeaderboardSkeleton count={2} />);
    const space = container.querySelector('.space-y-4');
    
    expect(space).toBeInTheDocument();
  });

  it('applies correct styling to skeleton items', () => {
    const { container } = render(<LeaderboardSkeleton count={1} />);
    const item = container.querySelector('.flex.items-center');
    
    expect(item).toHaveClass('p-4');
    expect(item).toHaveClass('rounded-xl');
    expect(item).toHaveClass('border-2');
  });
});
