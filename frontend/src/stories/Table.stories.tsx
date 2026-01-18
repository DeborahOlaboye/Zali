import type { Meta, StoryObj } from '@storybook/react';
import Table from '../components/Table';

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A table component for displaying tabular data with sorting and pagination.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Basic: Story = {
  args: {
    columns: [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: false },
      { key: 'role', label: 'Role', sortable: true },
    ],
    data: [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Moderator' },
    ],
  },
};

export const Leaderboard: Story = {
  args: {
    columns: [
      { key: 'rank', label: 'Rank', sortable: true },
      { key: 'name', label: 'Player', sortable: true },
      { key: 'score', label: 'Score', sortable: true },
      { key: 'games', label: 'Games', sortable: true },
    ],
    data: [
      { id: 1, rank: 1, name: 'CryptoMaster', score: 9850, games: 45 },
      { id: 2, rank: 2, name: 'TriviaKing', score: 9420, games: 38 },
      { id: 3, rank: 3, name: 'QuizWizard', score: 9180, games: 52 },
      { id: 4, rank: 4, name: 'BrainBuster', score: 8750, games: 41 },
      { id: 5, rank: 5, name: 'KnowledgeNinja', score: 8420, games: 35 },
    ],
  },
};

export const QuestionsTable: Story = {
  args: {
    columns: [
      { key: 'question', label: 'Question', sortable: false },
      { key: 'category', label: 'Category', sortable: true },
      { key: 'difficulty', label: 'Difficulty', sortable: true },
      { key: 'status', label: 'Status', sortable: true },
    ],
    data: [
      { id: 1, question: 'What is the capital of France?', category: 'Geography', difficulty: 'Easy', status: 'Approved' },
      { id: 2, question: 'Who wrote Romeo and Juliet?', category: 'Literature', difficulty: 'Medium', status: 'Pending' },
      { id: 3, question: 'What is the speed of light?', category: 'Science', difficulty: 'Hard', status: 'Approved' },
      { id: 4, question: 'When was the Declaration of Independence signed?', category: 'History', difficulty: 'Medium', status: 'Rejected' },
    ],
  },
};

export const Empty: Story = {
  args: {
    columns: [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: false },
    ],
    data: [],
  },
};