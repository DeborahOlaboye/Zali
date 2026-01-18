import type { Meta, StoryObj } from '@storybook/react';
import Rating from '../components/Rating';

const meta: Meta<typeof Rating> = {
  title: 'Components/Rating',
  component: Rating,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A rating component for collecting user ratings with stars or custom icons.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 5, step: 0.5 },
      description: 'Current rating value',
    },
    max: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Maximum rating value',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Rating size',
    },
    readonly: {
      control: { type: 'boolean' },
      description: 'Whether the rating is read-only',
    },
    showValue: {
      control: { type: 'boolean' },
      description: 'Whether to show the numeric value',
    },
    label: {
      control: { type: 'text' },
      description: 'Rating label',
    },
    onChange: {
      action: 'ratingChanged',
      description: 'Callback fired when rating changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Rating>;

export const Interactive: Story = {
  args: {
    value: 0,
    max: 5,
    size: 'md',
    readonly: false,
    showValue: true,
    label: 'Rate this question',
    onChange: (rating) => console.log('Rating changed:', rating),
  },
};

export const ReadOnly: Story = {
  args: {
    value: 4.5,
    max: 5,
    size: 'md',
    readonly: true,
    showValue: true,
    label: 'Average Rating',
    onChange: (rating) => console.log('Rating changed:', rating),
  },
};

export const Small: Story = {
  args: {
    value: 3,
    max: 5,
    size: 'sm',
    readonly: false,
    showValue: false,
    label: 'Quick Rating',
    onChange: (rating) => console.log('Rating changed:', rating),
  },
};

export const Large: Story = {
  args: {
    value: 2.5,
    max: 5,
    size: 'lg',
    readonly: false,
    showValue: true,
    label: 'Detailed Rating',
    onChange: (rating) => console.log('Rating changed:', rating),
  },
};

export const TenStars: Story = {
  args: {
    value: 7,
    max: 10,
    size: 'md',
    readonly: false,
    showValue: true,
    label: 'Difficulty Rating (1-10)',
    onChange: (rating) => console.log('Difficulty rating:', rating),
  },
};

export const HalfStars: Story = {
  args: {
    value: 3.5,
    max: 5,
    size: 'md',
    readonly: true,
    showValue: true,
    label: 'User Rating',
    onChange: (rating) => console.log('Rating changed:', rating),
  },
};

export const NoValue: Story = {
  args: {
    value: 0,
    max: 5,
    size: 'md',
    readonly: false,
    showValue: false,
    label: 'Rate this feature',
    onChange: (rating) => console.log('Rating changed:', rating),
  },
};