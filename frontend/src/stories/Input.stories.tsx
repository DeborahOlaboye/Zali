import type { Meta, StoryObj } from '@storybook/react';
import Input from '../components/Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'An input component with validation, icons, and various input types.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'Input type',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text',
    },
    value: {
      control: { type: 'text' },
      description: 'Input value',
    },
    label: {
      control: { type: 'text' },
      description: 'Input label',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the input is disabled',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Whether the input is required',
    },
    onChange: {
      action: 'changed',
      description: 'Callback fired when value changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Text: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter your name',
    label: 'Full Name',
    value: '',
    onChange: (e) => console.log('Input changed:', e.target.value),
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter your email',
    label: 'Email Address',
    value: '',
    onChange: (e) => console.log('Email changed:', e.target.value),
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter your password',
    label: 'Password',
    value: '',
    onChange: (e) => console.log('Password changed:', e.target.value),
  },
};

export const WithValue: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter your name',
    label: 'Full Name',
    value: 'John Doe',
    onChange: (e) => console.log('Input changed:', e.target.value),
  },
};

export const WithError: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter your email',
    label: 'Email Address',
    value: 'invalid-email',
    error: 'Please enter a valid email address',
    onChange: (e) => console.log('Input changed:', e.target.value),
  },
};

export const Disabled: Story = {
  args: {
    type: 'text',
    placeholder: 'This input is disabled',
    label: 'Disabled Input',
    value: 'Cannot edit this',
    disabled: true,
    onChange: (e) => console.log('Input changed:', e.target.value),
  },
};

export const Required: Story = {
  args: {
    type: 'text',
    placeholder: 'This field is required',
    label: 'Required Field',
    value: '',
    required: true,
    onChange: (e) => console.log('Input changed:', e.target.value),
  },
};

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
    label: 'Search',
    value: '',
    onChange: (e) => console.log('Search changed:', e.target.value),
  },
};