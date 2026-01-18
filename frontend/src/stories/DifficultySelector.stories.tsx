import type { Meta, StoryObj } from '@storybook/react';
import DifficultySelector from '../components/DifficultySelector';
import { Difficulty } from '../types/question';

const meta: Meta<typeof DifficultySelector> = {
  title: 'Components/DifficultySelector',
  component: DifficultySelector,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A selector component for choosing trivia question difficulty levels.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    selectedDifficulty: {
      control: { type: 'select' },
      options: Object.values(Difficulty),
      description: 'Currently selected difficulty',
    },
    onDifficultyChange: {
      action: 'difficultyChanged',
      description: 'Callback fired when difficulty changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DifficultySelector>;

export const Default: Story = {
  args: {
    selectedDifficulty: Difficulty.EASY,
    onDifficultyChange: (difficulty) => console.log('Selected difficulty:', difficulty),
  },
};

export const Medium: Story = {
  args: {
    selectedDifficulty: Difficulty.MEDIUM,
    onDifficultyChange: (difficulty) => console.log('Selected difficulty:', difficulty),
  },
};

export const Hard: Story = {
  args: {
    selectedDifficulty: Difficulty.HARD,
    onDifficultyChange: (difficulty) => console.log('Selected difficulty:', difficulty),
  },
};