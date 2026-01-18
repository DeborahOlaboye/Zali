import type { Meta, StoryObj } from '@storybook/react';
import QuestionCard from '../components/QuestionCard';
import type { Question } from '../data/questions';

const meta: Meta<typeof QuestionCard> = {
  title: 'Components/QuestionCard',
  component: QuestionCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A question card component for displaying trivia questions with multiple choice options.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    questionNumber: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Current question number in the quiz',
    },
    totalQuestions: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Total number of questions in the quiz',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the question card is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof QuestionCard>;

const mockQuestion: Question = {
  id: 1,
  question: "What is Celo's native stablecoin pegged to the US Dollar?",
  options: ["cUSD", "USDC", "DAI", "USDT"],
  correctAnswer: 0,
  explanation: "cUSD (Celo Dollar) is Celo's native stablecoin pegged to the US Dollar, enabling stable-value transactions on the network.",
  category: "Celo",
  difficulty: "Easy"
};

const QuestionCardWithState = (args: any) => {
  const handleAnswer = (answerIndex: number) => {
    console.log('Selected answer:', answerIndex);
  };

  return (
    <QuestionCard
      {...args}
      question={mockQuestion}
      onAnswer={handleAnswer}
    />
  );
};

export const Default: Story = {
  render: QuestionCardWithState,
  args: {
    questionNumber: 1,
    totalQuestions: 10,
    disabled: false,
  },
};

export const MiddleQuestion: Story = {
  render: QuestionCardWithState,
  args: {
    questionNumber: 5,
    totalQuestions: 10,
    disabled: false,
  },
};

export const LastQuestion: Story = {
  render: QuestionCardWithState,
  args: {
    questionNumber: 10,
    totalQuestions: 10,
    disabled: false,
  },
};

export const Disabled: Story = {
  render: QuestionCardWithState,
  args: {
    questionNumber: 3,
    totalQuestions: 10,
    disabled: true,
  },
};

const hardQuestion: Question = {
  id: 2,
  question: "What is the primary mechanism Celo uses to maintain cUSD's peg to the US Dollar?",
  options: ["Algorithmic stabilization", "Collateralized reserves", "Seigniorage shares", "Proof of stake rewards"],
  correctAnswer: 1,
  explanation: "Celo maintains cUSD's peg through collateralized reserves that hold assets backing the stablecoin's value.",
  category: "Celo",
  difficulty: "Hard"
};

export const HardQuestion: Story = {
  render: (args) => {
    const handleAnswer = (answerIndex: number) => {
      console.log('Selected answer:', answerIndex);
    };

    return (
      <QuestionCard
        {...args}
        question={hardQuestion}
        onAnswer={handleAnswer}
      />
    );
  },
  args: {
    questionNumber: 7,
    totalQuestions: 10,
    disabled: false,
  },
};