import type { Meta, StoryObj } from '@storybook/react';
import Select from '../components/Select';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A select dropdown component with customizable options and validation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Select label',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text',
    },
    value: {
      control: { type: 'text' },
      description: 'Selected value',
    },
    options: {
      control: { type: 'object' },
      description: 'Array of option objects',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the select is disabled',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message',
    },
    onChange: {
      action: 'changed',
      description: 'Callback fired when selection changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Basic: Story = {
  args: {
    label: 'Choose an option',
    placeholder: 'Select...',
    value: '',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    onChange: (value) => console.log('Selected:', value),
  },
};

export const WithValue: Story = {
  args: {
    label: 'Choose an option',
    placeholder: 'Select...',
    value: 'option2',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    onChange: (value) => console.log('Selected:', value),
  },
};

export const Categories: Story = {
  args: {
    label: 'Question Category',
    placeholder: 'Select a category...',
    value: '',
    options: [
      { value: 'geography', label: 'Geography' },
      { value: 'history', label: 'History' },
      { value: 'science', label: 'Science' },
      { value: 'sports', label: 'Sports' },
      { value: 'entertainment', label: 'Entertainment' },
      { value: 'literature', label: 'Literature' },
    ],
    onChange: (value) => console.log('Category selected:', value),
  },
};

export const Difficulty: Story = {
  args: {
    label: 'Difficulty Level',
    placeholder: 'Select difficulty...',
    value: 'medium',
    options: [
      { value: 'easy', label: 'Easy' },
      { value: 'medium', label: 'Medium' },
      { value: 'hard', label: 'Hard' },
    ],
    onChange: (value) => console.log('Difficulty selected:', value),
  },
};

export const WithError: Story = {
  args: {
    label: 'Required Field',
    placeholder: 'Please select...',
    value: '',
    error: 'This field is required',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ],
    onChange: (value) => console.log('Selected:', value),
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Select',
    placeholder: 'Cannot select...',
    value: 'option1',
    disabled: true,
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ],
    onChange: (value) => console.log('Selected:', value),
  },
};