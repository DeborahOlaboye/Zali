import type { Meta, StoryObj } from '@storybook/react';
import Masonry from '../components/Masonry';

const meta: Meta<typeof Masonry> = {
  title: 'Components/Masonry',
  component: Masonry,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A masonry layout component that arranges items in columns with varying heights.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Masonry<any>>;

interface CardItem {
  id: number;
  title: string;
  content: string;
  height: number;
  color: string;
}

const generateCards = (count: number): CardItem[] => {
  const colors = ['bg-red-100', 'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-purple-100', 'bg-pink-100'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Card ${i + 1}`,
    content: `This is the content for card ${i + 1}. `.repeat(Math.floor(Math.random() * 5) + 1),
    height: Math.floor(Math.random() * 200) + 100,
    color: colors[i % colors.length],
  }));
};

export const Basic: Story = {
  args: {
    items: generateCards(12),
    columns: 3,
    gap: 16,
    renderItem: (item: CardItem) => (
      <div
        className={`${item.color} p-4 rounded-lg shadow-sm border border-gray-200`}
        style={{ minHeight: `${item.height}px` }}
      >
        <h3 className="font-medium text-gray-900 mb-2">{item.title}</h3>
        <p className="text-sm text-gray-700">{item.content}</p>
      </div>
    ),
  },
};

export const TwoColumns: Story = {
  args: {
    items: generateCards(8),
    columns: 2,
    gap: 20,
    renderItem: (item: CardItem) => (
      <div
        className={`${item.color} p-6 rounded-xl shadow-md border border-gray-200`}
        style={{ minHeight: `${item.height}px` }}
      >
        <h3 className="font-semibold text-gray-900 mb-3">{item.title}</h3>
        <p className="text-gray-700 leading-relaxed">{item.content}</p>
        <div className="mt-4 text-xs text-gray-500">
          Height: {item.height}px
        </div>
      </div>
    ),
  },
};

export const FourColumns: Story = {
  args: {
    items: generateCards(16),
    columns: 4,
    gap: 12,
    renderItem: (item: CardItem) => (
      <div
        className={`${item.color} p-3 rounded-md shadow-sm border border-gray-200`}
        style={{ minHeight: `${item.height}px` }}
      >
        <h4 className="font-medium text-gray-900 mb-1 text-sm">{item.title}</h4>
        <p className="text-xs text-gray-700 line-clamp-3">{item.content}</p>
      </div>
    ),
  },
};

export const ImageGallery: Story = {
  args: {
    items: Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      title: `Image ${i + 1}`,
      src: `https://picsum.photos/300/${Math.floor(Math.random() * 200) + 200}?random=${i}`,
      description: `Beautiful landscape image ${i + 1}`,
    })),
    columns: 3,
    gap: 16,
    renderItem: (item: any) => (
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <img
          src={item.src}
          alt={item.title}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
          <p className="text-sm text-gray-600">{item.description}</p>
        </div>
      </div>
    ),
  },
};

export const AchievementGallery: Story = {
  args: {
    items: [
      {
        id: 1,
        title: 'First Victory',
        description: 'Win your first game',
        icon: '🏆',
        rarity: 'Common',
        unlocked: true,
      },
      {
        id: 2,
        title: 'Speed Demon',
        description: 'Answer 10 questions in under 30 seconds',
        icon: '⚡',
        rarity: 'Rare',
        unlocked: true,
      },
      {
        id: 3,
        title: 'Perfect Score',
        description: 'Get 100% on any quiz',
        icon: '💯',
        rarity: 'Epic',
        unlocked: false,
      },
      {
        id: 4,
        title: 'Streak Master',
        description: 'Win 5 games in a row',
        icon: '🔥',
        rarity: 'Rare',
        unlocked: true,
      },
      {
        id: 5,
        title: 'Knowledge Seeker',
        description: 'Play 100 games total',
        icon: '🧠',
        rarity: 'Epic',
        unlocked: false,
      },
      {
        id: 6,
        title: 'Category Expert',
        description: 'Master all questions in one category',
        icon: '👑',
        rarity: 'Legendary',
        unlocked: false,
      },
    ],
    columns: 2,
    gap: 20,
    renderItem: (item: any) => (
      <div className={`p-6 rounded-xl shadow-lg border-2 ${
        item.unlocked
          ? item.rarity === 'Legendary' ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-300' :
            item.rarity === 'Epic' ? 'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300' :
            item.rarity === 'Rare' ? 'bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-300' :
            'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300'
          : 'bg-gray-50 border-gray-200 opacity-60'
      }`}>
        <div className="text-center">
          <div className="text-4xl mb-3">{item.icon}</div>
          <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
          <p className="text-sm text-gray-700 mb-3">{item.description}</p>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            item.rarity === 'Legendary' ? 'bg-yellow-200 text-yellow-800' :
            item.rarity === 'Epic' ? 'bg-purple-200 text-purple-800' :
            item.rarity === 'Rare' ? 'bg-blue-200 text-blue-800' :
            'bg-gray-200 text-gray-800'
          }`}>
            {item.rarity}
          </span>
          {!item.unlocked && (
            <div className="mt-2 text-xs text-gray-500">🔒 Locked</div>
          )}
        </div>
      </div>
    ),
  },
};