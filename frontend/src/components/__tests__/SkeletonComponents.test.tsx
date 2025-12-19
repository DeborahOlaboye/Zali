import React from 'react';
import { render } from '@testing-library/react';
import { RewardCardSkeleton } from '../skeletons/RewardCardSkeleton';
import { PlayerInfoSkeleton } from '../skeletons/PlayerInfoSkeleton';
import { StatsCardSkeleton } from '../skeletons/StatsCardSkeleton';
import { QuestionCardSkeleton } from '../skeletons/QuestionCardSkeleton';

describe('RewardCardSkeleton', () => {
  it('renders with default count of 4', () => {
    const { container } = render(<RewardCardSkeleton />);
    const cards = container.querySelectorAll('.bg-white.rounded-xl');
    
    expect(cards.length).toBe(4);
  });

  it('renders with custom count', () => {
    const { container } = render(<RewardCardSkeleton count={2} />);
    const cards = container.querySelectorAll('.bg-white.rounded-xl');
    
    expect(cards.length).toBe(2);
  });
});

describe('PlayerInfoSkeleton', () => {
  it('renders player info skeleton structure', () => {
    const { container } = render(<PlayerInfoSkeleton />);
    const card = container.querySelector('.bg-white.rounded-2xl');
    
    expect(card).toBeInTheDocument();
  });

  it('applies correct styling', () => {
    const { container } = render(<PlayerInfoSkeleton />);
    const card = container.querySelector('.bg-white.rounded-2xl');
    
    expect(card).toHaveClass('shadow-lg');
    expect(card).toHaveClass('p-6');
    expect(card).toHaveClass('mb-8');
  });
});

describe('StatsCardSkeleton', () => {
  it('renders with default count of 3', () => {
    const { container } = render(<StatsCardSkeleton />);
    const cards = container.querySelectorAll('.bg-white.rounded-xl');
    
    expect(cards.length).toBe(3);
  });

  it('renders with custom count', () => {
    const { container } = render(<StatsCardSkeleton count={5} />);
    const cards = container.querySelectorAll('.bg-white.rounded-xl');
    
    expect(cards.length).toBe(5);
  });

  it('renders in grid layout', () => {
    const { container } = render(<StatsCardSkeleton />);
    const grid = container.querySelector('.grid');
    
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('md:grid-cols-3');
  });
});

describe('QuestionCardSkeleton', () => {
  it('renders question card skeleton', () => {
    const { container } = render(<QuestionCardSkeleton />);
    const card = container.querySelector('.bg-white.rounded-2xl');
    
    expect(card).toBeInTheDocument();
  });

  it('renders 4 option skeletons', () => {
    const { container } = render(<QuestionCardSkeleton />);
    const options = container.querySelectorAll('.flex.items-center.p-3.rounded-lg');
    
    expect(options.length).toBe(4);
  });

  it('applies correct styling', () => {
    const { container } = render(<QuestionCardSkeleton />);
    const card = container.querySelector('.bg-white.rounded-2xl');
    
    expect(card).toHaveClass('shadow-lg');
    expect(card).toHaveClass('p-8');
    expect(card).toHaveClass('mb-8');
  });
});
