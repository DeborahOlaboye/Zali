import type { Meta, StoryObj } from '@storybook/react';
import SearchBar from '../components/SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'Components/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A search input component with filtering and autocomplete capabilities.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text for the search input',
    },
    value: {
      control: { type: 'text' },
      description: 'Current search value',
    },
    onChange: {
      action: 'searchChanged',
      description: 'Callback fired when search value changes',
    },
    onSearch: {
      action: 'searchSubmitted',
      description: 'Callback fired when search is submitted',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Empty: Story = {
  args: {
    placeholder: 'Search questions...',
    value: '',
    onChange: (value) => console.log('Search value:', value),
    onSearch: (value) => console.log('Search submitted:', value),
  },
};

export const WithValue: Story = {
  args: {
    placeholder: 'Search questions...',
    value: 'capital of France',
    onChange: (value) => console.log('Search value:', value),
    onSearch: (value) => console.log('Search submitted:', value),
  },
};

export const LongPlaceholder: Story = {
  args: {
    placeholder: 'Search for trivia questions by keyword, category, or difficulty...',
    value: '',
    onChange: (value) => console.log('Search value:', value),
    onSearch: (value) => console.log('Search submitted:', value),
  },
};