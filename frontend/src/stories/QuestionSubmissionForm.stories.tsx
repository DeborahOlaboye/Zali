import type { Meta, StoryObj } from '@storybook/react';
import QuestionSubmissionForm from '../components/QuestionSubmissionForm';
import { Category, Difficulty } from '../types/question';

// Mock form submission handler
const mockOnSubmit = (data: any) => {
  console.log('Form submitted:', data);
  alert('Question submitted successfully!');
};

const meta: Meta<typeof QuestionSubmissionForm> = {
  title: 'Components/QuestionSubmissionForm',
  component: QuestionSubmissionForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A form component for submitting new trivia questions with validation and category selection.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onSubmit: {
      action: 'submitted',
      description: 'Callback fired when form is submitted',
    },
  },
};

export default meta;
type Story = StoryObj<typeof QuestionSubmissionForm>;

export const Default: Story = {
  args: {
    onSubmit: mockOnSubmit,
  },
};

export const WithPreFilledData: Story = {
  args: {
    onSubmit: mockOnSubmit,
  },
  parameters: {
    mockData: {
      initialValues: {
        question: 'What is the capital of France?',
        options: ['Paris', 'London', 'Berlin', 'Madrid'],
        correctAnswer: 0,
        category: Category.GEOGRAPHY,
        difficulty: Difficulty.EASY,
        explanation: 'Paris is the capital and most populous city of France.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    onSubmit: mockOnSubmit,
  },
  parameters: {
    mockData: {
      isSubmitting: true,
    },
  },
};