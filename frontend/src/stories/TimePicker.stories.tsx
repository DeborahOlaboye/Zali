import type { Meta, StoryObj } from '@storybook/react';
import TimePicker from '../components/TimePicker';

const meta: Meta<typeof TimePicker> = {
  title: 'Components/TimePicker',
  component: TimePicker,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A time picker component for selecting time values.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'text' },
      description: 'Selected time (HH:MM format)',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the time picker is disabled',
    },
    format: {
      control: { type: 'select' },
      options: ['12', '24'],
      description: 'Time format (12-hour or 24-hour)',
    },
    label: {
      control: { type: 'text' },
      description: 'Time picker label',
    },
    onChange: {
      action: 'timeChanged',
      description: 'Callback fired when time changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

export const Basic: Story = {
  args: {
    value: '',
    placeholder: 'Select time',
    disabled: false,
    format: '12',
    label: 'Appointment Time',
    onChange: (time) => console.log('Time selected:', time),
  },
};

export const WithValue: Story = {
  args: {
    value: '14:30',
    placeholder: 'Select time',
    disabled: false,
    format: '24',
    label: 'Meeting Time',
    onChange: (time) => console.log('Time selected:', time),
  },
};

export const TwelveHour: Story = {
  args: {
    value: '02:30',
    placeholder: 'Select time',
    disabled: false,
    format: '12',
    label: 'Wake Up Time',
    onChange: (time) => console.log('Time selected:', time),
  },
};

export const TwentyFourHour: Story = {
  args: {
    value: '15:45',
    placeholder: 'Select time',
    disabled: false,
    format: '24',
    label: 'Event Time',
    onChange: (time) => console.log('Time selected:', time),
  },
};

export const Disabled: Story = {
  args: {
    value: '09:00',
    placeholder: 'Time selection disabled',
    disabled: true,
    format: '12',
    label: 'Disabled Time Picker',
    onChange: (time) => console.log('Time selected:', time),
  },
};

export const GameStartTime: Story = {
  args: {
    value: '',
    placeholder: 'Select game start time',
    disabled: false,
    format: '24',
    label: 'Game Start Time',
    onChange: (time) => console.log('Game start time:', time),
  },
};

export const ReminderTime: Story = {
  args: {
    value: '08:00',
    placeholder: 'Set reminder time',
    disabled: false,
    format: '12',
    label: 'Daily Reminder',
    onChange: (time) => console.log('Reminder time:', time),
  },
};