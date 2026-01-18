import type { Meta, StoryObj } from '@storybook/react';
import RadioGroup from '../components/RadioGroup';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A radio group component for selecting one option from multiple choices.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Group label',
    },
    value: {
      control: { type: 'text' },
      description: 'Selected value',
    },
    options: {
      control: { type: 'object' },
      description: 'Array of radio options',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the entire group is disabled',
    },
    onChange: {
      action: 'changed',
      description: 'Callback fired when selection changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Basic: Story = {
  args: {
    label: 'Choose your favorite color',
    value: '',
    options: [
      { value: 'red', label: 'Red' },
      { value: 'blue', label: 'Blue' },
      { value: 'green', label: 'Green' },
    ],
    onChange: (value) => console.log('Selected:', value),
  },
};

export const WithSelection: Story = {
  args: {
    label: 'Choose your favorite color',
    value: 'blue',
    options: [
      { value: 'red', label: 'Red' },
      { value: 'blue', label: 'Blue' },
      { value: 'green', label: 'Green' },
    ],
    onChange: (value) => console.log('Selected:', value),
  },
};

export const DifficultySelection: Story = {
  args: {
    label: 'Select Difficulty',
    value: 'medium',
    options: [
      { value: 'easy', label: 'Easy' },
      { value: 'medium', label: 'Medium' },
      { value: 'hard', label: 'Hard' },
    ],
    onChange: (value) => console.log('Difficulty selected:', value),
  },
};

export const GameMode: Story = {
  args: {
    label: 'Game Mode',
    value: 'classic',
    options: [
      { value: 'classic', label: 'Classic Mode' },
      { value: 'blitz', label: 'Blitz Mode' },
      { value: 'time-attack', label: 'Time Attack' },
    ],
    onChange: (value) => console.log('Game mode selected:', value),
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Options',
    value: 'option1',
    disabled: true,
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ],
    onChange: (value) => console.log('Selected:', value),
  },
};