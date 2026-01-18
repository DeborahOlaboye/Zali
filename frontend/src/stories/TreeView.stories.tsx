import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import TreeView, { TreeNode } from '../components/TreeView';

const meta: Meta<typeof TreeView> = {
  title: 'Components/TreeView',
  component: TreeView,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A tree view component for hierarchical data display.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TreeView>;

const fileSystemData: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    type: 'folder',
    children: [
      {
        id: 'components',
        label: 'components',
        type: 'folder',
        children: [
          { id: 'Button.tsx', label: 'Button.tsx', type: 'file' },
          { id: 'Input.tsx', label: 'Input.tsx', type: 'file' },
          { id: 'Modal.tsx', label: 'Modal.tsx', type: 'file' },
        ],
      },
      {
        id: 'pages',
        label: 'pages',
        type: 'folder',
        children: [
          { id: 'Home.tsx', label: 'Home.tsx', type: 'file' },
          { id: 'About.tsx', label: 'About.tsx', type: 'file' },
        ],
      },
      { id: 'App.tsx', label: 'App.tsx', type: 'file' },
      { id: 'index.tsx', label: 'index.tsx', type: 'file' },
    ],
  },
  {
    id: 'public',
    label: 'public',
    type: 'folder',
    children: [
      { id: 'index.html', label: 'index.html', type: 'file' },
      { id: 'favicon.ico', label: 'favicon.ico', type: 'file' },
    ],
  },
  { id: 'package.json', label: 'package.json', type: 'file' },
  { id: 'README.md', label: 'README.md', type: 'file' },
];

const categoryData: TreeNode[] = [
  {
    id: 'geography',
    label: 'Geography',
    type: 'folder',
    children: [
      { id: 'capitals', label: 'Capitals', type: 'file' },
      { id: 'countries', label: 'Countries', type: 'file' },
      { id: 'continents', label: 'Continents', type: 'file' },
    ],
  },
  {
    id: 'history',
    label: 'History',
    type: 'folder',
    children: [
      { id: 'ancient', label: 'Ancient History', type: 'file' },
      { id: 'medieval', label: 'Medieval History', type: 'file' },
      { id: 'modern', label: 'Modern History', type: 'file' },
    ],
  },
  {
    id: 'science',
    label: 'Science',
    type: 'folder',
    children: [
      {
        id: 'physics',
        label: 'Physics',
        type: 'folder',
        children: [
          { id: 'mechanics', label: 'Mechanics', type: 'file' },
          { id: 'thermodynamics', label: 'Thermodynamics', type: 'file' },
        ],
      },
      { id: 'chemistry', label: 'Chemistry', type: 'file' },
      { id: 'biology', label: 'Biology', type: 'file' },
    ],
  },
];

export const FileSystem: Story = {
  args: {
    nodes: fileSystemData,
  },
};

export const Categories: Story = {
  args: {
    nodes: categoryData,
  },
};

export const WithSelection: Story = {
  args: {
    nodes: fileSystemData,
    selectedNodeId: 'Button.tsx',
  },
  decorators: [
    (Story) => {
      const [selectedNodeId, setSelectedNodeId] = useState<string>('Button.tsx');
      return (
        <Story
          args={{
            selectedNodeId,
            onNodeSelect: (node) => setSelectedNodeId(node.id),
          }}
        />
      );
    },
  ],
};

export const SimpleList: Story = {
  args: {
    nodes: [
      { id: 'item1', label: 'Item 1', type: 'file' },
      { id: 'item2', label: 'Item 2', type: 'file' },
      { id: 'item3', label: 'Item 3', type: 'file' },
      { id: 'item4', label: 'Item 4', type: 'file' },
      { id: 'item5', label: 'Item 5', type: 'file' },
    ],
  },
};

export const DeepNesting: Story = {
  args: {
    nodes: [
      {
        id: 'level1',
        label: 'Level 1',
        type: 'folder',
        children: [
          {
            id: 'level2',
            label: 'Level 2',
            type: 'folder',
            children: [
              {
                id: 'level3',
                label: 'Level 3',
                type: 'folder',
                children: [
                  {
                    id: 'level4',
                    label: 'Level 4',
                    type: 'folder',
                    children: [
                      { id: 'file1', label: 'Deep File 1', type: 'file' },
                      { id: 'file2', label: 'Deep File 2', type: 'file' },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};