import type { Meta, StoryObj } from '@storybook/react';
import VirtualizedList from '../components/VirtualizedList';

const meta: Meta<typeof VirtualizedList> = {
  title: 'Components/VirtualizedList',
  component: VirtualizedList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A virtualized list component for rendering large datasets efficiently.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VirtualizedList<any>>;

const generateItems = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    description: `This is a description for item ${i + 1}`,
    value: Math.floor(Math.random() * 1000),
  }));
};

export const Basic: Story = {
  args: {
    items: generateItems(100),
    itemHeight: 60,
    containerHeight: 400,
    renderItem: (item) => (
      <div className="flex justify-between items-center w-full">
        <div>
          <div className="font-medium text-gray-900">{item.name}</div>
          <div className="text-sm text-gray-500">{item.description}</div>
        </div>
        <div className="text-sm font-medium text-indigo-600">{item.value}</div>
      </div>
    ),
  },
};

export const LargeDataset: Story = {
  args: {
    items: generateItems(10000),
    itemHeight: 50,
    containerHeight: 500,
    renderItem: (item, index) => (
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {index + 1}
        </div>
        <div className="flex-1">
          <div className="font-medium text-gray-900">{item.name}</div>
          <div className="text-sm text-gray-500">Index: {index}</div>
        </div>
        <div className="text-sm text-gray-500">Value: {item.value}</div>
      </div>
    ),
  },
};

export const Leaderboard: Story = {
  args: {
    items: generateItems(1000).map((item, index) => ({
      ...item,
      rank: index + 1,
      score: Math.floor(Math.random() * 10000) + 1000,
      gamesPlayed: Math.floor(Math.random() * 100) + 1,
    })),
    itemHeight: 70,
    containerHeight: 600,
    renderItem: (item) => (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold">
            {item.rank <= 3 ? '🏆' : item.rank}
          </div>
          <div>
            <div className="font-medium text-gray-900">{item.name}</div>
            <div className="text-sm text-gray-500">{item.gamesPlayed} games played</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-lg text-indigo-600">{item.score.toLocaleString()}</div>
          <div className="text-sm text-gray-500">points</div>
        </div>
      </div>
    ),
  },
};

export const QuestionsList: Story = {
  args: {
    items: generateItems(500).map((item, index) => ({
      ...item,
      question: `Question ${index + 1}: What is the capital of ${['France', 'Germany', 'Italy', 'Spain', 'Portugal'][index % 5]}?`,
      category: ['Geography', 'History', 'Science', 'Literature', 'Sports'][index % 5],
      difficulty: ['Easy', 'Medium', 'Hard'][index % 3],
      status: ['Approved', 'Pending', 'Rejected'][index % 3],
    })),
    itemHeight: 80,
    containerHeight: 500,
    renderItem: (item) => (
      <div className="space-y-2">
        <div className="font-medium text-gray-900 line-clamp-2">{item.question}</div>
        <div className="flex items-center space-x-4 text-sm">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.category === 'Geography' ? 'bg-blue-100 text-blue-800' :
            item.category === 'History' ? 'bg-green-100 text-green-800' :
            item.category === 'Science' ? 'bg-purple-100 text-purple-800' :
            item.category === 'Literature' ? 'bg-pink-100 text-pink-800' :
            'bg-orange-100 text-orange-800'
          }`}>
            {item.category}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
            item.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {item.difficulty}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.status === 'Approved' ? 'bg-green-100 text-green-800' :
            item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {item.status}
          </span>
        </div>
      </div>
    ),
  },
};

export const Compact: Story = {
  args: {
    items: generateItems(200),
    itemHeight: 40,
    containerHeight: 400,
    renderItem: (item) => (
      <div className="flex justify-between items-center w-full text-sm">
        <span className="font-medium">{item.name}</span>
        <span className="text-gray-500">{item.value}</span>
      </div>
    ),
  },
};