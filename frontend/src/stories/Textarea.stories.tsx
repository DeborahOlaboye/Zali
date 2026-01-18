import type { Meta, StoryObj } from '@storybook/react';
import Textarea from '../components/Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A textarea component for multi-line text input with validation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Textarea label',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text',
    },
    value: {
      control: { type: 'text' },
      description: 'Textarea value',
    },
    rows: {
      control: { type: 'number', min: 1, max: 20 },
      description: 'Number of visible rows',
    },
    maxLength: {
      control: { type: 'number' },
      description: 'Maximum character count',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the textarea is disabled',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message',
    },
    onChange: {
      action: 'changed',
      description: 'Callback fired when value changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Basic: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter your description...',
    value: '',
    rows: 4,
    onChange: (e) => console.log('Textarea changed:', e.target.value),
  },
};

export const WithValue: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
    value: 'I am a software developer passionate about creating amazing user experiences.',
    rows: 4,
    onChange: (e) => console.log('Textarea changed:', e.target.value),
  },
};

export const WithMaxLength: Story = {
  args: {
    label: 'Short Description',
    placeholder: 'Enter a brief description...',
    value: '',
    rows: 3,
    maxLength: 100,
    onChange: (e) => console.log('Textarea changed:', e.target.value),
  },
};

export const LongContent: Story = {
  args: {
    label: 'Detailed Explanation',
    placeholder: 'Provide a detailed explanation...',
    value: '',
    rows: 8,
    onChange: (e) => console.log('Textarea changed:', e.target.value),
  },
};

export const WithError: Story = {
  args: {
    label: 'Required Field',
    placeholder: 'This field is required...',
    value: '',
    rows: 4,
    error: 'Please provide a description',
    onChange: (e) => console.log('Textarea changed:', e.target.value),
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Textarea',
    placeholder: 'This textarea is disabled...',
    value: 'This content cannot be edited.',
    rows: 4,
    disabled: true,
    onChange: (e) => console.log('Textarea changed:', e.target.value),
  },
};