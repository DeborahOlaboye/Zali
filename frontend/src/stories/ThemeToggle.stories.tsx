import type { Meta, StoryObj } from '@storybook/react';
import ThemeToggle from '../components/ThemeToggle';

const meta: Meta<typeof ThemeToggle> = {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A toggle component for switching between light and dark themes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    currentTheme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Current theme',
    },
    onThemeChange: {
      action: 'themeChanged',
      description: 'Callback fired when theme changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const LightTheme: Story = {
  args: {
    currentTheme: 'light',
    onThemeChange: (theme) => console.log('Theme changed to:', theme),
  },
};

export const DarkTheme: Story = {
  args: {
    currentTheme: 'dark',
    onThemeChange: (theme) => console.log('Theme changed to:', theme),
  },
};