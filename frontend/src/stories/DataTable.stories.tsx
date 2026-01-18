import type { Meta, StoryObj } from '@storybook/react';
import DataTable from '../components/DataTable';

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A data table component with sorting, filtering, and pagination features.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataTable>;

export const Basic: Story = {
  args: {
    columns: [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: false },
      { key: 'role', label: 'Role', sortable: true },
      { key: 'status', label: 'Status', sortable: true },
    ],
    data: [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Moderator', status: 'Inactive' },
      { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'Active' },
      { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User', status: 'Pending' },
    ],
    pagination: true,
    pageSize: 10,
  },
};

export const QuestionsTable: Story = {
  args: {
    columns: [
      { key: 'question', label: 'Question', sortable: false },
      { key: 'category', label: 'Category', sortable: true },
      { key: 'difficulty', label: 'Difficulty', sortable: true },
      { key: 'status', label: 'Status', sortable: true },
      { key: 'submittedBy', label: 'Submitted By', sortable: true },
    ],
    data: [
      {
        id: 1,
        question: 'What is the capital of France?',
        category: 'Geography',
        difficulty: 'Easy',
        status: 'Approved',
        submittedBy: 'user123',
      },
      {
        id: 2,
        question: 'Who wrote Romeo and Juliet?',
        category: 'Literature',
        difficulty: 'Medium',
        status: 'Pending',
        submittedBy: 'quizmaster',
      },
      {
        id: 3,
        question: 'What is the speed of light?',
        category: 'Science',
        difficulty: 'Hard',
        status: 'Approved',
        submittedBy: 'sciencefan',
      },
      {
        id: 4,
        question: 'When was the Declaration of Independence signed?',
        category: 'History',
        difficulty: 'Medium',
        status: 'Rejected',
        submittedBy: 'historybuff',
      },
      {
        id: 5,
        question: 'What is the largest planet in our solar system?',
        category: 'Science',
        difficulty: 'Easy',
        status: 'Approved',
        submittedBy: 'spacegeek',
      },
    ],
    pagination: true,
    pageSize: 5,
  },
};

export const LeaderboardTable: Story = {
  args: {
    columns: [
      { key: 'rank', label: 'Rank', sortable: true },
      { key: 'player', label: 'Player', sortable: true },
      { key: 'score', label: 'Score', sortable: true },
      { key: 'gamesPlayed', label: 'Games', sortable: true },
      { key: 'winRate', label: 'Win Rate', sortable: true },
    ],
    data: [
      { id: 1, rank: 1, player: 'CryptoMaster', score: 9850, gamesPlayed: 45, winRate: '87%' },
      { id: 2, rank: 2, player: 'TriviaKing', score: 9420, gamesPlayed: 38, winRate: '92%' },
      { id: 3, rank: 3, player: 'QuizWizard', score: 9180, gamesPlayed: 52, winRate: '78%' },
      { id: 4, rank: 4, player: 'BrainBuster', score: 8750, gamesPlayed: 41, winRate: '85%' },
      { id: 5, rank: 5, player: 'KnowledgeNinja', score: 8420, gamesPlayed: 35, winRate: '91%' },
      { id: 6, rank: 6, player: 'FactFinder', score: 8230, gamesPlayed: 48, winRate: '76%' },
      { id: 7, rank: 7, player: 'MindBender', score: 7980, gamesPlayed: 33, winRate: '88%' },
      { id: 8, rank: 8, player: 'QuizMeister', score: 7650, gamesPlayed: 29, winRate: '93%' },
    ],
    pagination: true,
    pageSize: 10,
  },
};

export const NoPagination: Story = {
  args: {
    columns: [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'department', label: 'Department', sortable: true },
      { key: 'salary', label: 'Salary', sortable: true },
    ],
    data: [
      { id: 1, name: 'John Doe', department: 'Engineering', salary: '$75,000' },
      { id: 2, name: 'Jane Smith', department: 'Marketing', salary: '$65,000' },
      { id: 3, name: 'Bob Johnson', department: 'Sales', salary: '$70,000' },
    ],
    pagination: false,
  },
};