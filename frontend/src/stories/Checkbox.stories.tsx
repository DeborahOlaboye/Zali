import type { Meta, StoryObj } from '@storybook/react';
import Checkbox from '../components/Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A checkbox input component with label and validation support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Checkbox label',
    },
    checked: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is checked',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is disabled',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is required',
    },
    onChange: {
      action: 'changed',
      description: 'Callback fired when checkbox state changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = {
  args: {
    label: 'I agree to the terms and conditions',
    checked: false,
    onChange: (checked) => console.log('Checkbox changed:', checked),
  },
};

export const Checked: Story = {
  args: {
    label: 'Subscribe to newsletter',
    checked: true,
    onChange: (checked) => console.log('Checkbox changed:', checked),
  },
};

export const DisabledUnchecked: Story = {
  args: {
    label: 'This option is disabled',
    checked: false,
    disabled: true,
    onChange: (checked) => console.log('Checkbox changed:', checked),
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'This option is disabled and checked',
    checked: true,
    disabled: true,
    onChange: (checked) => console.log('Checkbox changed:', checked),
  },
};

export const Required: Story = {
  args: {
    label: 'I accept the privacy policy (required)',
    checked: false,
    required: true,
    onChange: (checked) => console.log('Checkbox changed:', checked),
  },
};

export const MultipleCheckboxes: Story = {
  render: () => (
    <div className="space-y-3">
      <Checkbox
        label="Email notifications"
        checked={true}
        onChange={(checked) => console.log('Email notifications:', checked)}
      />
      <Checkbox
        label="SMS notifications"
        checked={false}
        onChange={(checked) => console.log('SMS notifications:', checked)}
      />
      <Checkbox
        label="Push notifications"
        checked={true}
        onChange={(checked) => console.log('Push notifications:', checked)}
      />
    </div>
  ),
};