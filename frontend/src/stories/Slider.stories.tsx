import type { Meta, StoryObj } from '@storybook/react';
import Slider from '../components/Slider';

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A slider component for selecting a value from a range.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Current slider value',
    },
    min: {
      control: { type: 'number' },
      description: 'Minimum value',
    },
    max: {
      control: { type: 'number' },
      description: 'Maximum value',
    },
    step: {
      control: { type: 'number' },
      description: 'Step increment',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the slider is disabled',
    },
    showValue: {
      control: { type: 'boolean' },
      description: 'Whether to show the current value',
    },
    label: {
      control: { type: 'text' },
      description: 'Slider label',
    },
    onChange: {
      action: 'changed',
      description: 'Callback fired when value changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Basic: Story = {
  args: {
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    showValue: true,
    label: 'Volume',
    onChange: (value) => console.log('Slider value:', value),
  },
};

export const VolumeControl: Story = {
  args: {
    value: 75,
    min: 0,
    max: 100,
    step: 5,
    disabled: false,
    showValue: true,
    label: 'Master Volume',
    onChange: (value) => console.log('Volume:', value),
  },
};

export const QuestionTimer: Story = {
  args: {
    value: 30,
    min: 10,
    max: 120,
    step: 5,
    disabled: false,
    showValue: true,
    label: 'Question Timer (seconds)',
    onChange: (value) => console.log('Timer:', value),
  },
};

export const DifficultyLevel: Story = {
  args: {
    value: 2,
    min: 1,
    max: 5,
    step: 1,
    disabled: false,
    showValue: false,
    label: 'Difficulty Level',
    onChange: (value) => console.log('Difficulty:', value),
  },
};

export const Disabled: Story = {
  args: {
    value: 25,
    min: 0,
    max: 100,
    step: 1,
    disabled: true,
    showValue: true,
    label: 'Disabled Slider',
    onChange: (value) => console.log('Slider value:', value),
  },
};

export const NoLabel: Story = {
  args: {
    value: 40,
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    showValue: true,
    onChange: (value) => console.log('Slider value:', value),
  },
};

export const Brightness: Story = {
  args: {
    value: 80,
    min: 0,
    max: 100,
    step: 10,
    disabled: false,
    showValue: true,
    label: 'Screen Brightness',
    onChange: (value) => console.log('Brightness:', value),
  },
};