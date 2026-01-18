import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import MultiSelect from '../components/MultiSelect';

const meta: Meta<typeof MultiSelect> = {
  title: 'Components/MultiSelect',
  component: MultiSelect,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A multi-select dropdown component with search functionality.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      const [value, setValue] = useState<string[]>([]);
      return <Story args={{ value, onChange: setValue }} />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

const sampleOptions = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'nuxt', label: 'Nuxt.js' },
  { value: 'gatsby', label: 'Gatsby' },
  { value: 'remix', label: 'Remix' },
];

export const Basic: Story = {
  args: {
    options: sampleOptions,
    placeholder: 'Select frameworks...',
  },
};

export const WithPreselected: Story = {
  args: {
    options: sampleOptions,
    placeholder: 'Select frameworks...',
  },
  decorators: [
    (Story) => {
      const [value, setValue] = useState<string[]>(['react', 'nextjs']);
      return <Story args={{ value, onChange: setValue }} />;
    },
  ],
};

export const Categories: Story = {
  args: {
    options: [
      { value: 'geography', label: 'Geography' },
      { value: 'history', label: 'History' },
      { value: 'science', label: 'Science' },
      { value: 'literature', label: 'Literature' },
      { value: 'sports', label: 'Sports' },
      { value: 'entertainment', label: 'Entertainment' },
      { value: 'technology', label: 'Technology' },
      { value: 'art', label: 'Art' },
    ],
    placeholder: 'Select categories...',
  },
};

export const DifficultyLevels: Story = {
  args: {
    options: [
      { value: 'easy', label: 'Easy' },
      { value: 'medium', label: 'Medium' },
      { value: 'hard', label: 'Hard' },
      { value: 'expert', label: 'Expert' },
    ],
    placeholder: 'Select difficulty levels...',
  },
};

export const WithDisabledOptions: Story = {
  args: {
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive', disabled: true },
      { value: 'pending', label: 'Pending' },
      { value: 'suspended', label: 'Suspended', disabled: true },
      { value: 'banned', label: 'Banned' },
    ],
    placeholder: 'Select status...',
  },
};

export const ManyOptions: Story = {
  args: {
    options: Array.from({ length: 50 }, (_, i) => ({
      value: `option-${i + 1}`,
      label: `Option ${i + 1}`,
    })),
    placeholder: 'Select many options...',
  },
};

export const Disabled: Story = {
  args: {
    options: sampleOptions,
    placeholder: 'Select frameworks...',
    disabled: true,
  },
  decorators: [
    (Story) => {
      const [value, setValue] = useState<string[]>(['react']);
      return <Story args={{ value, onChange: setValue }} />;
    },
  ],
};