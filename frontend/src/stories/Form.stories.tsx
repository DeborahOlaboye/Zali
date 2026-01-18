import type { Meta, StoryObj } from '@storybook/react';
import Form from '../components/Form';

const meta: Meta<typeof Form> = {
  title: 'Components/Form',
  component: Form,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A form component with validation and submission handling.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const LoginForm: Story = {
  render: () => (
    <Form onSubmit={(data) => console.log('Form submitted:', data)}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Sign In
        </button>
      </div>
    </Form>
  ),
};

export const QuestionSubmissionForm: Story = {
  render: () => (
    <Form onSubmit={(data) => console.log('Question submitted:', data)}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Question</label>
          <textarea
            name="question"
            rows={3}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter your trivia question..."
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Correct Answer</label>
          <input
            type="text"
            name="correctAnswer"
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Incorrect Answers</label>
          <input
            type="text"
            name="wrongAnswer1"
            className="w-full px-3 py-2 border rounded mb-2"
            placeholder="Wrong answer 1"
            required
          />
          <input
            type="text"
            name="wrongAnswer2"
            className="w-full px-3 py-2 border rounded mb-2"
            placeholder="Wrong answer 2"
            required
          />
          <input
            type="text"
            name="wrongAnswer3"
            className="w-full px-3 py-2 border rounded"
            placeholder="Wrong answer 3"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select name="category" className="w-full px-3 py-2 border rounded" required>
              <option value="">Select category</option>
              <option value="geography">Geography</option>
              <option value="history">History</option>
              <option value="science">Science</option>
              <option value="sports">Sports</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Difficulty</label>
            <select name="difficulty" className="w-full px-3 py-2 border rounded" required>
              <option value="">Select difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Submit Question
        </button>
      </div>
    </Form>
  ),
};

export const SettingsForm: Story = {
  render: () => (
    <Form onSubmit={(data) => console.log('Settings saved:', data)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Sound Effects</label>
          <input type="checkbox" name="soundEnabled" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Notifications</label>
          <input type="checkbox" name="notificationsEnabled" defaultChecked />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Default Difficulty</label>
          <select name="defaultDifficulty" className="w-full px-3 py-2 border rounded">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Question Timer (seconds)</label>
          <input
            type="number"
            name="questionTimer"
            defaultValue={30}
            min={10}
            max={120}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Settings
        </button>
      </div>
    </Form>
  ),
};