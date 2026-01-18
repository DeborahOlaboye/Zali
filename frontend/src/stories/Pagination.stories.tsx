import type { Meta, StoryObj } from '@storybook/react';
import Pagination from '../components/Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A pagination component for navigating through multiple pages of content.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
      description: 'Current active page',
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: 'Total number of pages',
    },
    onPageChange: {
      action: 'pageChanged',
      description: 'Callback fired when page changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const BasicPagination: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page) => console.log('Page changed to:', page),
  },
};

export const MiddlePage: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    onPageChange: (page) => console.log('Page changed to:', page),
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
    onPageChange: (page) => console.log('Page changed to:', page),
  },
};

export const FewPages: Story = {
  args: {
    currentPage: 2,
    totalPages: 4,
    onPageChange: (page) => console.log('Page changed to:', page),
  },
};

export const ManyPages: Story = {
  args: {
    currentPage: 25,
    totalPages: 100,
    onPageChange: (page) => console.log('Page changed to:', page),
  },
};