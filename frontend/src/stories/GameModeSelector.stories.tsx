import type { Meta, StoryObj } from '@storybook/react';
import GameModeSelector from '../components/GameModeSelector';
import { GameMode } from '../types/game';

const meta: Meta<typeof GameModeSelector> = {
  title: 'Components/GameModeSelector',
  component: GameModeSelector,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A component for selecting different game modes and configurations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    selectedMode: {
      control: { type: 'select' },
      options: Object.values(GameMode),
      description: 'Currently selected game mode',
    },
    onModeSelect: {
      action: 'modeSelected',
      description: 'Callback fired when a game mode is selected',
    },
  },
};

export default meta;
type Story = StoryObj<typeof GameModeSelector>;

export const Default: Story = {
  args: {
    selectedMode: GameMode.CLASSIC,
    onModeSelect: (mode) => console.log('Selected mode:', mode),
  },
};

export const BlitzMode: Story = {
  args: {
    selectedMode: GameMode.BLITZ,
    onModeSelect: (mode) => console.log('Selected mode:', mode),
  },
};

export const TimeAttack: Story = {
  args: {
    selectedMode: GameMode.TIME_ATTACK,
    onModeSelect: (mode) => console.log('Selected mode:', mode),
  },
};

export const CategoryChallenge: Story = {
  args: {
    selectedMode: GameMode.CATEGORY_CHALLENGE,
    onModeSelect: (mode) => console.log('Selected mode:', mode),
  },
};