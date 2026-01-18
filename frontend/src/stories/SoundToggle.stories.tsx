import type { Meta, StoryObj } from '@storybook/react';
import SoundToggle from '../components/SoundToggle';

const meta: Meta<typeof SoundToggle> = {
  title: 'Components/SoundToggle',
  component: SoundToggle,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A toggle component for enabling/disabling sound effects and music.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    soundEnabled: {
      control: { type: 'boolean' },
      description: 'Whether sound is currently enabled',
    },
    onSoundToggle: {
      action: 'soundToggled',
      description: 'Callback fired when sound setting changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SoundToggle>;

export const SoundOn: Story = {
  args: {
    soundEnabled: true,
    onSoundToggle: (enabled) => console.log('Sound enabled:', enabled),
  },
};

export const SoundOff: Story = {
  args: {
    soundEnabled: false,
    onSoundToggle: (enabled) => console.log('Sound enabled:', enabled),
  },
};