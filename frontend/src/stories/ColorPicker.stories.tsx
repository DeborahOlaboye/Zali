import type { Meta, StoryObj } from '@storybook/react';
import ColorPicker from '../components/ColorPicker';

const meta: Meta<typeof ColorPicker> = {
  title: 'Components/ColorPicker',
  component: ColorPicker,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A color picker component for selecting colors with palette or custom input.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'color' },
      description: 'Selected color',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the color picker is disabled',
    },
    showPalette: {
      control: { type: 'boolean' },
      description: 'Whether to show color palette',
    },
    label: {
      control: { type: 'text' },
      description: 'Color picker label',
    },
    onChange: {
      action: 'colorChanged',
      description: 'Callback fired when color changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const Basic: Story = {
  args: {
    value: '#3B82F6',
    placeholder: 'Select a color',
    disabled: false,
    showPalette: true,
    label: 'Theme Color',
    onChange: (color) => console.log('Color selected:', color),
  },
};

export const NoPalette: Story = {
  args: {
    value: '#10B981',
    placeholder: 'Choose color',
    disabled: false,
    showPalette: false,
    label: 'Accent Color',
    onChange: (color) => console.log('Color selected:', color),
  },
};

export const Disabled: Story = {
  args: {
    value: '#EF4444',
    placeholder: 'Color selection disabled',
    disabled: true,
    showPalette: true,
    label: 'Disabled Color Picker',
    onChange: (color) => console.log('Color selected:', color),
  },
};

export const AvatarColor: Story = {
  args: {
    value: '#8B5CF6',
    placeholder: 'Pick avatar color',
    disabled: false,
    showPalette: true,
    label: 'Avatar Background',
    onChange: (color) => console.log('Avatar color:', color),
  },
};

export const ThemeColors: Story = {
  args: {
    value: '#1F2937',
    placeholder: 'Select theme color',
    disabled: false,
    showPalette: true,
    label: 'Primary Theme Color',
    onChange: (color) => console.log('Theme color:', color),
  },
};

export const BrandColor: Story = {
  args: {
    value: '#F59E0B',
    placeholder: 'Choose brand color',
    disabled: false,
    showPalette: true,
    label: 'Brand Color',
    onChange: (color) => console.log('Brand color:', color),
  },
};