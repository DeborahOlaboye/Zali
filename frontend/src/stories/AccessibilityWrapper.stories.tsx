import type { Meta, StoryObj } from '@storybook/react';
import AccessibilityWrapper from '../components/AccessibilityWrapper';

const meta: Meta<typeof AccessibilityWrapper> = {
  title: 'Components/AccessibilityWrapper',
  component: AccessibilityWrapper,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A wrapper component that provides accessibility enhancements and keyboard navigation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: { type: 'text' },
      description: 'Child components to wrap',
    },
    role: {
      control: { type: 'text' },
      description: 'ARIA role for the wrapper',
    },
    label: {
      control: { type: 'text' },
      description: 'Accessible label',
    },
    description: {
      control: { type: 'text' },
      description: 'Accessible description',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AccessibilityWrapper>;

export const ButtonWrapper: Story = {
  render: (args) => (
    <AccessibilityWrapper {...args}>
      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Accessible Button
      </button>
    </AccessibilityWrapper>
  ),
  args: {
    role: 'button',
    label: 'Click me to perform an action',
    description: 'This button performs an important action',
  },
};

export const FormWrapper: Story = {
  render: (args) => (
    <AccessibilityWrapper {...args}>
      <div className="p-4 border rounded">
        <label htmlFor="name" className="block text-sm font-medium mb-2">Name:</label>
        <input
          id="name"
          type="text"
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter your name"
        />
      </div>
    </AccessibilityWrapper>
  ),
  args: {
    role: 'form',
    label: 'User Information Form',
    description: 'Form for collecting user information',
  },
};

export const NavigationWrapper: Story = {
  render: (args) => (
    <AccessibilityWrapper {...args}>
      <nav className="flex space-x-4">
        <a href="#home" className="text-blue-600 hover:underline">Home</a>
        <a href="#about" className="text-blue-600 hover:underline">About</a>
        <a href="#contact" className="text-blue-600 hover:underline">Contact</a>
      </nav>
    </AccessibilityWrapper>
  ),
  args: {
    role: 'navigation',
    label: 'Main Navigation',
    description: 'Navigation menu for the application',
  },
};