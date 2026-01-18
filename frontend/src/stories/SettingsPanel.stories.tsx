import type { Meta, StoryObj } from '@storybook/react';
import SettingsPanel from '../components/SettingsPanel';

// Mock settings and handlers
const mockSettings = {
  soundEnabled: true,
  musicEnabled: false,
  notificationsEnabled: true,
  theme: 'dark',
  language: 'en',
  difficulty: 'medium',
  questionTimer: 30,
  showExplanations: true,
};

const mockOnSettingChange = (key: string, value: any) => {
  console.log(`Setting changed: ${key} = ${value}`);
};

const meta: Meta<typeof SettingsPanel> = {
  title: 'Components/SettingsPanel',
  component: SettingsPanel,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A settings panel component for configuring game preferences and options.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SettingsPanel>;

export const Default: Story = {
  parameters: {
    mockData: {
      settings: mockSettings,
      onSettingChange: mockOnSettingChange,
    },
  },
};

export const AllDisabled: Story = {
  parameters: {
    mockData: {
      settings: {
        ...mockSettings,
        soundEnabled: false,
        musicEnabled: false,
        notificationsEnabled: false,
        showExplanations: false,
      },
      onSettingChange: mockOnSettingChange,
    },
  },
};

export const LightTheme: Story = {
  parameters: {
    mockData: {
      settings: {
        ...mockSettings,
        theme: 'light',
      },
      onSettingChange: mockOnSettingChange,
    },
  },
};

export const ExpertSettings: Story = {
  parameters: {
    mockData: {
      settings: {
        ...mockSettings,
        difficulty: 'hard',
        questionTimer: 15,
      },
      onSettingChange: mockOnSettingChange,
    },
  },
};