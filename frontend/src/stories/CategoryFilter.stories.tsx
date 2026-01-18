import type { Meta, StoryObj } from '@storybook/react';
import CategoryFilter from '../components/CategoryFilter';
import { Category } from '../types/question';

const meta: Meta<typeof CategoryFilter> = {
  title: 'Components/CategoryFilter',
  component: CategoryFilter,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A filter component for selecting trivia question categories.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    selectedCategories: {
      control: { type: 'multi-select' },
      options: Object.values(Category),
      description: 'Currently selected categories',
    },
    onCategoryChange: {
      action: 'categoryChanged',
      description: 'Callback fired when categories change',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CategoryFilter>;

export const Default: Story = {
  args: {
    selectedCategories: [],
    onCategoryChange: (categories) => console.log('Selected categories:', categories),
  },
};

export const SomeSelected: Story = {
  args: {
    selectedCategories: [Category.SCIENCE, Category.HISTORY],
    onCategoryChange: (categories) => console.log('Selected categories:', categories),
  },
};

export const AllSelected: Story = {
  args: {
    selectedCategories: Object.values(Category),
    onCategoryChange: (categories) => console.log('Selected categories:', categories),
  },
};

export const SingleCategory: Story = {
  args: {
    selectedCategories: [Category.GEOGRAPHY],
    onCategoryChange: (categories) => console.log('Selected categories:', categories),
  },
};