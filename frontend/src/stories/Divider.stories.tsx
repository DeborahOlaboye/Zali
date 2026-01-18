import type { Meta, StoryObj } from '@storybook/react';
import Divider from '../components/Divider';

const meta: Meta<typeof Divider> = {
  title: 'Components/Divider',
  component: Divider,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A divider component for separating content sections.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Divider orientation',
    },
    variant: {
      control: { type: 'select' },
      options: ['solid', 'dashed', 'dotted'],
      description: 'Divider line style',
    },
    thickness: {
      control: { type: 'select' },
      options: ['thin', 'medium', 'thick'],
      description: 'Divider thickness',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    variant: 'solid',
    thickness: 'medium',
  },
};

export const Dashed: Story = {
  args: {
    orientation: 'horizontal',
    variant: 'dashed',
    thickness: 'medium',
  },
};

export const Dotted: Story = {
  args: {
    orientation: 'horizontal',
    variant: 'dotted',
    thickness: 'medium',
  },
};

export const Thin: Story = {
  args: {
    orientation: 'horizontal',
    variant: 'solid',
    thickness: 'thin',
  },
};

export const Thick: Story = {
  args: {
    orientation: 'horizontal',
    variant: 'solid',
    thickness: 'thick',
  },
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    variant: 'solid',
    thickness: 'medium',
  },
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => (
    <div className="flex h-32">
      <div className="flex-1 p-4 bg-blue-50">
        <p>Left content</p>
      </div>
      <Divider {...args} />
      <div className="flex-1 p-4 bg-green-50">
        <p>Right content</p>
      </div>
    </div>
  ),
};

export const WithText: Story = {
  render: () => (
    <div className="space-y-4">
      <p>This is some content above the divider.</p>
      <Divider orientation="horizontal" variant="solid" thickness="medium" />
      <p>This is some content below the divider.</p>
    </div>
  ),
};

export const SectionSeparator: Story = {
  render: () => (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-bold mb-2">Section 1</h2>
        <p>This is the first section with some content.</p>
      </section>
      <Divider orientation="horizontal" variant="dashed" thickness="thin" />
      <section>
        <h2 className="text-xl font-bold mb-2">Section 2</h2>
        <p>This is the second section with different content.</p>
      </section>
      <Divider orientation="horizontal" variant="solid" thickness="medium" />
      <section>
        <h2 className="text-xl font-bold mb-2">Section 3</h2>
        <p>This is the third section.</p>
      </section>
    </div>
  ),
};