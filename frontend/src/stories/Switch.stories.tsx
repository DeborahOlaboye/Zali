import type { Meta, StoryObj } from '@storybook/react';
import Switch from '../components/Switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A switch component for toggling between two states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: { type: 'boolean' },
      description: 'Whether the switch is checked',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the switch is disabled',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Switch size',
    },
    label: {
      control: { type: 'text' },
      description: 'Switch label',
    },
    onChange: {
      action: 'changed',
      description: 'Callback fired when switch state changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    checked: false,
    disabled: false,
    size: 'md',
    label: 'Enable notifications',
    onChange: (checked) => console.log('Switch changed:', checked),
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    disabled: false,
    size: 'md',
    label: 'Sound effects enabled',
    onChange: (checked) => console.log('Switch changed:', checked),
  },
};

export const Small: Story = {
  args: {
    checked: false,
    disabled: false,
    size: 'sm',
    label: 'Small switch',
    onChange: (checked) => console.log('Switch changed:', checked),
  },
};

export const Large: Story = {
  args: {
    checked: true,
    disabled: false,
    size: 'lg',
    label: 'Large switch',
    onChange: (checked) => console.log('Switch changed:', checked),
  },
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    size: 'md',
    label: 'Disabled switch',
    onChange: (checked) => console.log('Switch changed:', checked),
  },
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
    size: 'md',
    label: 'Disabled checked switch',
    onChange: (checked) => console.log('Switch changed:', checked),
  },
};

export const Settings: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Sound Effects</span>
        <Switch
          checked={true}
          onChange={(checked) => console.log('Sound effects:', checked)}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Music</span>
        <Switch
          checked={false}
          onChange={(checked) => console.log('Music:', checked)}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Notifications</span>
        <Switch
          checked={true}
          onChange={(checked) => console.log('Notifications:', checked)}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Dark Mode</span>
        <Switch
          checked={false}
          onChange={(checked) => console.log('Dark mode:', checked)}
        />
      </div>
    </div>
  ),
};