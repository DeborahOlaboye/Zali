import type { Meta, StoryObj } from '@storybook/react';
import Timer from '../components/Timer';
import { useState } from 'react';

const meta: Meta<typeof Timer> = {
  title: 'Components/Timer',
  component: Timer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A countdown timer component with visual progress indicator and color-coded urgency.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    duration: {
      control: { type: 'number', min: 5, max: 300 },
      description: 'Duration of the timer in seconds',
    },
    isPaused: {
      control: 'boolean',
      description: 'Whether the timer is paused',
    },
    autoStart: {
      control: 'boolean',
      description: 'Whether the timer starts automatically',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Timer>;

const TimerWithState = (args: any) => {
  const [timeUpMessage, setTimeUpMessage] = useState('');

  const handleTimeUp = () => {
    setTimeUpMessage('Time is up!');
    setTimeout(() => setTimeUpMessage(''), 3000);
  };

  return (
    <div>
      <Timer {...args} onTimeUp={handleTimeUp} />
      {timeUpMessage && (
        <div className="mt-4 p-2 bg-red-100 text-red-800 rounded">
          {timeUpMessage}
        </div>
      )}
    </div>
  );
};

export const Default: Story = {
  render: TimerWithState,
  args: {
    duration: 30,
    isPaused: false,
    autoStart: true,
  },
};

export const ShortTimer: Story = {
  render: TimerWithState,
  args: {
    duration: 10,
    isPaused: false,
    autoStart: true,
  },
};

export const LongTimer: Story = {
  render: TimerWithState,
  args: {
    duration: 120,
    isPaused: false,
    autoStart: true,
  },
};

export const Paused: Story = {
  render: TimerWithState,
  args: {
    duration: 30,
    isPaused: true,
    autoStart: true,
  },
};

export const ManualStart: Story = {
  render: TimerWithState,
  args: {
    duration: 30,
    isPaused: false,
    autoStart: false,
  },
};