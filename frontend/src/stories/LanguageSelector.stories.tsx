import type { Meta, StoryObj } from '@storybook/react';
import LanguageSelector from '../components/LanguageSelector';

const meta: Meta<typeof LanguageSelector> = {
  title: 'Components/LanguageSelector',
  component: LanguageSelector,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A selector component for choosing the application language.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    currentLanguage: {
      control: { type: 'select' },
      options: ['en', 'es', 'fr', 'de', 'it', 'pt'],
      description: 'Currently selected language',
    },
    onLanguageChange: {
      action: 'languageChanged',
      description: 'Callback fired when language changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof LanguageSelector>;

export const English: Story = {
  args: {
    currentLanguage: 'en',
    onLanguageChange: (lang) => console.log('Language changed to:', lang),
  },
};

export const Spanish: Story = {
  args: {
    currentLanguage: 'es',
    onLanguageChange: (lang) => console.log('Language changed to:', lang),
  },
};

export const French: Story = {
  args: {
    currentLanguage: 'fr',
    onLanguageChange: (lang) => console.log('Language changed to:', lang),
  },
};