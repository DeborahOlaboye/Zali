import type { Meta, StoryObj } from '@storybook/react';
import Accordion from '../components/Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'An accordion component for displaying collapsible content sections.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Basic: Story = {
  args: {
    items: [
      {
        id: 'item1',
        title: 'Getting Started',
        content: 'Welcome to our trivia game! Here\'s how to get started with your first game.',
      },
      {
        id: 'item2',
        title: 'Game Rules',
        content: 'Each question has multiple choices. Select the correct answer within the time limit to earn points.',
      },
      {
        id: 'item3',
        title: 'Scoring System',
        content: 'Earn points based on difficulty and speed. Harder questions give more points, and faster answers give bonuses.',
      },
    ],
  },
};

export const FAQ: Story = {
  args: {
    items: [
      {
        id: 'faq1',
        title: 'How do I submit a question?',
        content: 'Click on the "Submit Question" button in the navigation menu. Fill out the form with your question, options, and correct answer.',
      },
      {
        id: 'faq2',
        title: 'Can I play without a wallet?',
        content: 'Yes! You can play in guest mode, but connecting a wallet allows you to save your progress and earn rewards.',
      },
      {
        id: 'faq3',
        title: 'What are achievements?',
        content: 'Achievements are special rewards you unlock by completing various challenges and milestones in the game.',
      },
      {
        id: 'faq4',
        title: 'How do I change my settings?',
        content: 'Go to the Settings page from the main menu. You can adjust sound, notifications, difficulty, and other preferences.',
      },
    ],
  },
};

export const SingleItem: Story = {
  args: {
    items: [
      {
        id: 'single',
        title: 'Single Accordion Item',
        content: 'This accordion has only one item. It can still be expanded and collapsed.',
      },
    ],
  },
};

export const RichContent: Story = {
  args: {
    items: [
      {
        id: 'rich1',
        title: 'Rich Content Example',
        content: (
          <div>
            <p>This accordion item contains rich content:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Multiple paragraphs</li>
              <li>Lists and formatting</li>
              <li>Even other React components</li>
            </ul>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Click me!
            </button>
          </div>
        ),
      },
    ],
  },
};