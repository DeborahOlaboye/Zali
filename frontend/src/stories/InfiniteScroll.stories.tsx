import type { Meta, StoryObj } from '@storybook/react';
import { useState, useCallback } from 'react';
import InfiniteScroll from '../components/InfiniteScroll';

const meta: Meta<typeof InfiniteScroll> = {
  title: 'Components/InfiniteScroll',
  component: InfiniteScroll,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'An infinite scroll component that loads more content as the user scrolls.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InfiniteScroll<any>>;

interface MockItem {
  id: number;
  title: string;
  description: string;
  timestamp: string;
}

const generateMockItems = (startId: number, count: number): MockItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    title: `Item ${startId + i}`,
    description: `This is the description for item ${startId + i}. It contains some sample text to demonstrate how the content might look.`,
    timestamp: new Date(Date.now() - Math.random() * 86400000 * 30).toLocaleDateString(),
  }));
};

export const Basic: Story = {
  args: {
    renderItem: (item: MockItem) => (
      <div className="p-4 border-b border-gray-200 hover:bg-gray-50">
        <h3 className="font-medium text-gray-900">{item.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
        <span className="text-xs text-gray-500 mt-2 block">{item.timestamp}</span>
      </div>
    ),
    loadingComponent: (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Loading more items...</span>
      </div>
    ),
    endMessage: (
      <div className="text-center py-8 text-gray-500">
        🎉 You've seen all items!
      </div>
    ),
    threshold: 100,
  },
  decorators: [
    (Story) => {
      const [items, setItems] = useState<MockItem[]>(() => generateMockItems(1, 20));
      const [hasMore, setHasMore] = useState(true);

      const loadMore = useCallback(async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newItems = generateMockItems(items.length + 1, 20);
        setItems(prev => [...prev, ...newItems]);

        // Stop loading after 100 items
        if (items.length + newItems.length >= 100) {
          setHasMore(false);
        }
      }, [items.length]);

      return (
        <div className="h-96 border border-gray-200 rounded-md">
          <Story
            args={{
              items,
              hasMore,
              loadMore,
            }}
          />
        </div>
      );
    },
  ],
};

export const Leaderboard: Story = {
  args: {
    renderItem: (item: MockItem & { score: number; rank: number }) => (
      <div className="p-4 border-b border-gray-200 hover:bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {item.rank}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg text-indigo-600">{item.score.toLocaleString()}</div>
            <div className="text-xs text-gray-500">points</div>
          </div>
        </div>
      </div>
    ),
    loadingComponent: (
      <div className="flex justify-center items-center py-6">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-300 h-8 w-8"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
          <div className="h-6 bg-gray-300 rounded w-16"></div>
        </div>
      </div>
    ),
    endMessage: (
      <div className="text-center py-8">
        <div className="text-4xl mb-2">🏆</div>
        <div className="text-gray-500">End of leaderboard</div>
      </div>
    ),
  },
  decorators: [
    (Story) => {
      const [items, setItems] = useState(() =>
        generateMockItems(1, 20).map((item, index) => ({
          ...item,
          score: Math.floor(Math.random() * 10000) + 1000,
          rank: index + 1,
        }))
      );
      const [hasMore, setHasMore] = useState(true);

      const loadMore = useCallback(async () => {
        await new Promise(resolve => setTimeout(resolve, 800));

        const newItems = generateMockItems(items.length + 1, 20).map((item, index) => ({
          ...item,
          score: Math.floor(Math.random() * 10000) + 1000,
          rank: items.length + index + 1,
        }));

        setItems(prev => [...prev, ...newItems]);

        if (items.length + newItems.length >= 200) {
          setHasMore(false);
        }
      }, [items.length]);

      return (
        <div className="h-96 border border-gray-200 rounded-md">
          <Story
            args={{
              items,
              hasMore,
              loadMore,
            }}
          />
        </div>
      );
    },
  ],
};

export const NewsFeed: Story = {
  args: {
    renderItem: (item: MockItem) => (
      <div className="p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {item.title.charAt(5)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
            <p className="text-gray-700 mb-2">{item.description}</p>
            <div className="flex items-center text-sm text-gray-500">
              <span>{item.timestamp}</span>
              <span className="mx-2">•</span>
              <span>2 min read</span>
            </div>
          </div>
        </div>
      </div>
    ),
    loadingComponent: (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading more stories...</span>
      </div>
    ),
    endMessage: (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📖</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">You've caught up!</h3>
        <p className="text-gray-500">No more stories to load at this time.</p>
      </div>
    ),
  },
  decorators: [
    (Story) => {
      const [items, setItems] = useState<MockItem[]>(() => generateMockItems(1, 15));
      const [hasMore, setHasMore] = useState(true);

      const loadMore = useCallback(async () => {
        await new Promise(resolve => setTimeout(resolve, 1200));

        const newItems = generateMockItems(items.length + 1, 15);
        setItems(prev => [...prev, ...newItems]);

        if (items.length + newItems.length >= 150) {
          setHasMore(false);
        }
      }, [items.length]);

      return (
        <div className="h-96 border border-gray-200 rounded-md bg-white">
          <Story
            args={{
              items,
              hasMore,
              loadMore,
            }}
          />
        </div>
      );
    },
  ],
};