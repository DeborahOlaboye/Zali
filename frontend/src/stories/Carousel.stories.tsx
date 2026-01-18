import type { Meta, StoryObj } from '@storybook/react';
import Carousel from '../components/Carousel';

const meta: Meta<typeof Carousel> = {
  title: 'Components/Carousel',
  component: Carousel,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A carousel component for displaying multiple items in a sliding interface.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Carousel>;

export const Basic: Story = {
  args: {
    items: [
      <div key="1" className="bg-blue-500 text-white p-8 rounded-lg text-center">
        <h3 className="text-xl font-bold mb-2">Slide 1</h3>
        <p>This is the first slide</p>
      </div>,
      <div key="2" className="bg-green-500 text-white p-8 rounded-lg text-center">
        <h3 className="text-xl font-bold mb-2">Slide 2</h3>
        <p>This is the second slide</p>
      </div>,
      <div key="3" className="bg-purple-500 text-white p-8 rounded-lg text-center">
        <h3 className="text-xl font-bold mb-2">Slide 3</h3>
        <p>This is the third slide</p>
      </div>,
    ],
    showDots: true,
    showArrows: true,
    autoPlay: false,
  },
};

export const AutoPlay: Story = {
  args: {
    items: [
      <div key="1" className="bg-red-500 text-white p-6 rounded-lg text-center">
        <h2 className="text-lg font-bold">Welcome</h2>
        <p>Welcome to our trivia game!</p>
      </div>,
      <div key="2" className="bg-blue-500 text-white p-6 rounded-lg text-center">
        <h2 className="text-lg font-bold">Play</h2>
        <p>Answer questions and earn points</p>
      </div>,
      <div key="3" className="bg-green-500 text-white p-6 rounded-lg text-center">
        <h2 className="text-lg font-bold">Achievements</h2>
        <p>Unlock achievements as you progress</p>
      </div>,
      <div key="4" className="bg-purple-500 text-white p-6 rounded-lg text-center">
        <h2 className="text-lg font-bold">Leaderboard</h2>
        <p>Compete with other players</p>
      </div>,
    ],
    showDots: true,
    showArrows: false,
    autoPlay: true,
    autoPlayInterval: 3000,
  },
};

export const Images: Story = {
  args: {
    items: [
      <div key="1" className="relative">
        <img src="https://via.placeholder.com/600x300/4F46E5/FFFFFF?text=Game+Screenshot+1" alt="Game Screenshot 1" className="w-full h-48 object-cover rounded-lg" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-lg font-bold">Gameplay</h3>
          <p className="text-sm">Experience the action</p>
        </div>
      </div>,
      <div key="2" className="relative">
        <img src="https://via.placeholder.com/600x300/059669/FFFFFF?text=Game+Screenshot+2" alt="Game Screenshot 2" className="w-full h-48 object-cover rounded-lg" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-lg font-bold">Achievements</h3>
          <p className="text-sm">Earn rewards</p>
        </div>
      </div>,
      <div key="3" className="relative">
        <img src="https://via.placeholder.com/600x300/7C3AED/FFFFFF?text=Game+Screenshot+3" alt="Game Screenshot 3" className="w-full h-48 object-cover rounded-lg" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-lg font-bold">Leaderboard</h3>
          <p className="text-sm">See top players</p>
        </div>
      </div>,
    ],
    showDots: true,
    showArrows: true,
    autoPlay: false,
  },
};

export const Cards: Story = {
  args: {
    items: [
      <div key="1" className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-4xl mb-4">🎯</div>
        <h3 className="text-lg font-bold mb-2">Quick Play</h3>
        <p className="text-gray-600 mb-4">Jump into a quick game with random questions</p>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Play Now
        </button>
      </div>,
      <div key="2" className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-4xl mb-4">🏆</div>
        <h3 className="text-lg font-bold mb-2">Challenge Mode</h3>
        <p className="text-gray-600 mb-4">Test your knowledge with timed challenges</p>
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Start Challenge
        </button>
      </div>,
      <div key="3" className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-4xl mb-4">📚</div>
        <h3 className="text-lg font-bold mb-2">Learn & Play</h3>
        <p className="text-gray-600 mb-4">Learn new facts while playing</p>
        <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
          Learn More
        </button>
      </div>,
    ],
    showDots: true,
    showArrows: true,
    autoPlay: false,
  },
};