import type { Meta, StoryObj } from '@storybook/react';
import Icon from '../components/Icon';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'An icon component that displays various icons with customizable size and color.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: { type: 'select' },
      options: ['home', 'user', 'settings', 'search', 'heart', 'star', 'check', 'close', 'arrow-left', 'arrow-right', 'menu', 'bell', 'trophy', 'clock', 'play', 'pause'],
      description: 'Icon name',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Icon size',
    },
    color: {
      control: { type: 'select' },
      options: ['current', 'gray', 'blue', 'green', 'red', 'yellow', 'purple'],
      description: 'Icon color',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Home: Story = {
  args: {
    name: 'home',
    size: 'md',
    color: 'current',
  },
};

export const User: Story = {
  args: {
    name: 'user',
    size: 'md',
    color: 'blue',
  },
};

export const Settings: Story = {
  args: {
    name: 'settings',
    size: 'md',
    color: 'gray',
  },
};

export const Heart: Story = {
  args: {
    name: 'heart',
    size: 'md',
    color: 'red',
  },
};

export const Star: Story = {
  args: {
    name: 'star',
    size: 'md',
    color: 'yellow',
  },
};

export const Check: Story = {
  args: {
    name: 'check',
    size: 'md',
    color: 'green',
  },
};

export const Close: Story = {
  args: {
    name: 'close',
    size: 'md',
    color: 'red',
  },
};

export const Small: Story = {
  args: {
    name: 'bell',
    size: 'sm',
    color: 'current',
  },
};

export const Large: Story = {
  args: {
    name: 'trophy',
    size: 'lg',
    color: 'current',
  },
};

export const ExtraLarge: Story = {
  args: {
    name: 'play',
    size: 'xl',
    color: 'current',
  },
};

export const IconGrid: Story = {
  render: () => (
    <div className="grid grid-cols-6 gap-4 p-4">
      <div className="flex flex-col items-center space-y-2">
        <Icon name="home" size="lg" />
        <span className="text-xs">home</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <Icon name="user" size="lg" />
        <span className="text-xs">user</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <Icon name="settings" size="lg" />
        <span className="text-xs">settings</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <Icon name="search" size="lg" />
        <span className="text-xs">search</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <Icon name="heart" size="lg" />
        <span className="text-xs">heart</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <Icon name="star" size="lg" />
        <span className="text-xs">star</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <Icon name="check" size="lg" />
        <span className="text-xs">check</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <Icon name="close" size="lg" />
        <span className="text-xs">close</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <Icon name="bell" size="lg" />
        <span className="text-xs">bell</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <Icon name="trophy" size="lg" />
        <span className="text-xs">trophy</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <Icon name="clock" size="lg" />
        <span className="text-xs">clock</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <Icon name="play" size="lg" />
        <span className="text-xs">play</span>
      </div>
    </div>
  ),
};