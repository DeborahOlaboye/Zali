import type { Meta, StoryObj } from '@storybook/react';
import Card from '../components/Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A card component for displaying content in a contained, styled container.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Card title',
    },
    children: {
      control: { type: 'text' },
      description: 'Card content',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'outlined'],
      description: 'Card visual variant',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: 'Card Title',
    variant: 'default',
    children: 'This is the content of the card. It can contain any React elements.',
  },
};

export const Elevated: Story = {
  args: {
    title: 'Elevated Card',
    variant: 'elevated',
    children: 'This card has a shadow to give it depth and importance.',
  },
};

export const Outlined: Story = {
  args: {
    title: 'Outlined Card',
    variant: 'outlined',
    children: 'This card has a border instead of a shadow.',
  },
};

export const NoTitle: Story = {
  args: {
    variant: 'default',
    children: 'This card has no title, just content.',
  },
};

export const RichContent: Story = {
  render: (args) => (
    <Card {...args}>
      <div className="space-y-4">
        <p className="text-gray-600">This card contains rich content including:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Multiple paragraphs</li>
          <li>Lists</li>
          <li>Different text styles</li>
        </ul>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Action Button
        </button>
      </div>
    </Card>
  ),
  args: {
    title: 'Rich Content Card',
    variant: 'elevated',
  },
};