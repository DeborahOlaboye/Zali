import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import ContextMenu, { ContextMenuItem } from '../components/ContextMenu';

const meta: Meta<typeof ContextMenu> = {
  title: 'Components/ContextMenu',
  component: ContextMenu,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A context menu component that appears on right-click with nested submenu support.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

const fileMenuItems: ContextMenuItem[] = [
  {
    id: 'new',
    label: 'New',
    icon: '📄',
    children: [
      { id: 'new-file', label: 'File', icon: '📄' },
      { id: 'new-folder', label: 'Folder', icon: '📁' },
      { id: 'new-project', label: 'Project', icon: '📦' },
    ],
  },
  { id: 'divider1', label: '', divider: true },
  { id: 'open', label: 'Open', icon: '📂' },
  { id: 'open-recent', label: 'Open Recent', icon: '🕒' },
  { id: 'divider2', label: '', divider: true },
  { id: 'save', label: 'Save', icon: '💾' },
  { id: 'save-as', label: 'Save As...', icon: '💾' },
  { id: 'divider3', label: '', divider: true },
  { id: 'export', label: 'Export', icon: '📤' },
  { id: 'print', label: 'Print', icon: '🖨️' },
];

const tableMenuItems: ContextMenuItem[] = [
  { id: 'view', label: 'View Details', icon: '👁️' },
  { id: 'edit', label: 'Edit', icon: '✏️' },
  { id: 'duplicate', label: 'Duplicate', icon: '📋' },
  { id: 'divider1', label: '', divider: true },
  {
    id: 'move',
    label: 'Move to',
    icon: '📦',
    children: [
      { id: 'move-inbox', label: 'Inbox', icon: '📥' },
      { id: 'move-archive', label: 'Archive', icon: '📦' },
      { id: 'move-trash', label: 'Trash', icon: '🗑️' },
    ],
  },
  { id: 'divider2', label: '', divider: true },
  { id: 'delete', label: 'Delete', icon: '🗑️' },
];

const imageMenuItems: ContextMenuItem[] = [
  { id: 'view', label: 'View Image', icon: '🖼️' },
  { id: 'download', label: 'Download', icon: '⬇️' },
  { id: 'copy', label: 'Copy Image', icon: '📋' },
  { id: 'divider1', label: '', divider: true },
  {
    id: 'edit',
    label: 'Edit',
    icon: '✏️',
    children: [
      { id: 'edit-crop', label: 'Crop', icon: '✂️' },
      { id: 'edit-resize', label: 'Resize', icon: '📐' },
      { id: 'edit-filter', label: 'Apply Filter', icon: '🎨' },
    ],
  },
  { id: 'divider2', label: '', divider: true },
  { id: 'share', label: 'Share', icon: '📤' },
  { id: 'delete', label: 'Delete', icon: '🗑️' },
];

export const FileExplorer: Story = {
  args: {
    items: fileMenuItems,
    onItemClick: (item) => console.log('Clicked:', item.label),
  },
  render: (args) => (
    <ContextMenu {...args}>
      <div className="w-64 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-context-menu">
        <div className="text-center">
          <div className="text-2xl mb-2">📁</div>
          <div className="text-gray-600">Right-click here</div>
          <div className="text-sm text-gray-500">File Explorer</div>
        </div>
      </div>
    </ContextMenu>
  ),
};

export const DataTable: Story = {
  args: {
    items: tableMenuItems,
    onItemClick: (item) => console.log('Clicked:', item.label),
  },
  render: (args) => (
    <ContextMenu {...args}>
      <div className="w-80 bg-white border border-gray-200 rounded-lg overflow-hidden cursor-context-menu">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">User Management</h3>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="px-4 py-3 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">John Doe</div>
                <div className="text-sm text-gray-500">john@example.com</div>
              </div>
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
            </div>
          </div>
          <div className="px-4 py-3 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Jane Smith</div>
                <div className="text-sm text-gray-500">jane@example.com</div>
              </div>
              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
            </div>
          </div>
        </div>
        <div className="px-4 py-2 bg-gray-50 text-center text-sm text-gray-500">
          Right-click on a row
        </div>
      </div>
    </ContextMenu>
  ),
};

export const ImageGallery: Story = {
  args: {
    items: imageMenuItems,
    onItemClick: (item) => console.log('Clicked:', item.label),
  },
  render: (args) => (
    <ContextMenu {...args}>
      <div className="grid grid-cols-3 gap-4 cursor-context-menu">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl mb-1">🖼️</div>
              <div className="text-xs text-gray-600">Image {i + 1}</div>
            </div>
          </div>
        ))}
        <div className="col-span-3 text-center text-sm text-gray-500 mt-2">
          Right-click on any image
        </div>
      </div>
    </ContextMenu>
  ),
};

export const WithDisabledItems: Story = {
  args: {
    items: [
      { id: 'view', label: 'View', icon: '👁️' },
      { id: 'edit', label: 'Edit', icon: '✏️', disabled: true },
      { id: 'delete', label: 'Delete', icon: '🗑️', disabled: true },
      { id: 'divider', label: '', divider: true },
      { id: 'export', label: 'Export', icon: '📤' },
    ],
    onItemClick: (item) => console.log('Clicked:', item.label),
  },
  render: (args) => (
    <ContextMenu {...args}>
      <div className="w-48 h-24 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center cursor-context-menu">
        <div className="text-center">
          <div className="text-xl mb-1">🚫</div>
          <div className="text-red-700 text-sm">Restricted Area</div>
          <div className="text-xs text-red-600">Some actions disabled</div>
        </div>
      </div>
    </ContextMenu>
  ),
};

export const QuizContextMenu: Story = {
  args: {
    items: [
      { id: 'start', label: 'Start Quiz', icon: '▶️' },
      { id: 'preview', label: 'Preview Questions', icon: '👁️' },
      { id: 'edit', label: 'Edit Quiz', icon: '✏️' },
      { id: 'divider1', label: '', divider: true },
      {
        id: 'share',
        label: 'Share',
        icon: '📤',
        children: [
          { id: 'share-link', label: 'Copy Link', icon: '🔗' },
          { id: 'share-embed', label: 'Embed Code', icon: '💻' },
          { id: 'share-social', label: 'Social Media', icon: '📱' },
        ],
      },
      { id: 'duplicate', label: 'Duplicate', icon: '📋' },
      { id: 'divider2', label: '', divider: true },
      { id: 'analytics', label: 'View Analytics', icon: '📊' },
      { id: 'export', label: 'Export Results', icon: '📄' },
      { id: 'divider3', label: '', divider: true },
      { id: 'delete', label: 'Delete Quiz', icon: '🗑️' },
    ],
    onItemClick: (item) => console.log('Clicked:', item.label),
  },
  render: (args) => (
    <ContextMenu {...args}>
      <div className="w-72 bg-white border border-gray-200 rounded-lg p-4 cursor-context-menu hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
            Q
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Geography Quiz</h3>
            <p className="text-sm text-gray-500">15 questions • Medium</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Created 2 days ago</span>
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Published</span>
        </div>
        <div className="mt-3 text-center text-sm text-gray-500">
          Right-click for options
        </div>
      </div>
    </ContextMenu>
  ),
};