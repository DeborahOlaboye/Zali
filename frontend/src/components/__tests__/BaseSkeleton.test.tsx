import React from 'react';
import { render, screen } from '@testing-library/react';
import { BaseSkeleton } from '../skeletons/BaseSkeleton';

describe('BaseSkeleton', () => {
  it('renders with default props', () => {
    const { container } = render(<BaseSkeleton />);
    const skeleton = container.querySelector('[role="status"]');
    
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('animate-pulse');
  });

  it('applies custom width and height', () => {
    const { container } = render(<BaseSkeleton width="200px" height="50px" />);
    const skeleton = container.querySelector('[role="status"]');
    
    expect(skeleton).toHaveStyle('width: 200px');
    expect(skeleton).toHaveStyle('height: 50px');
  });

  it('applies custom rounded class', () => {
    const { container } = render(<BaseSkeleton rounded="lg" />);
    const skeleton = container.querySelector('[role="status"]');
    
    expect(skeleton).toHaveClass('rounded-lg');
  });

  it('applies custom className', () => {
    const { container } = render(<BaseSkeleton className="custom-class" />);
    const skeleton = container.querySelector('[role="status"]');
    
    expect(skeleton).toHaveClass('custom-class');
  });

  it('disables pulse animation when specified', () => {
    const { container } = render(<BaseSkeleton pulse={false} />);
    const skeleton = container.querySelector('[role="status"]');
    
    expect(skeleton).not.toHaveClass('animate-pulse');
  });

  it('handles numeric width and height', () => {
    const { container } = render(<BaseSkeleton width={100} height={25} />);
    const skeleton = container.querySelector('[role="status"]');
    
    expect(skeleton).toHaveStyle('width: 100px');
    expect(skeleton).toHaveStyle('height: 25px');
  });

  it('renders with full border radius', () => {
    const { container } = render(<BaseSkeleton rounded="full" />);
    const skeleton = container.querySelector('[role="status"]');
    
    expect(skeleton).toHaveClass('rounded-full');
  });
});
