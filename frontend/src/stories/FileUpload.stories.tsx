import type { Meta, StoryObj } from '@storybook/react';
import FileUpload from '../components/FileUpload';

const meta: Meta<typeof FileUpload> = {
  title: 'Components/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A file upload component with drag-and-drop functionality and validation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    accept: {
      control: { type: 'text' },
      description: 'Accepted file types (comma-separated)',
    },
    maxSize: {
      control: { type: 'number' },
      description: 'Maximum file size in bytes',
    },
    multiple: {
      control: { type: 'boolean' },
      description: 'Whether multiple files can be selected',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the upload is disabled',
    },
    label: {
      control: { type: 'text' },
      description: 'Upload area label',
    },
    onFileSelect: {
      action: 'fileSelected',
      description: 'Callback fired when files are selected',
    },
    onError: {
      action: 'error',
      description: 'Callback fired when an error occurs',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Basic: Story = {
  args: {
    accept: '.jpg,.jpeg,.png,.gif',
    maxSize: 5242880, // 5MB
    multiple: false,
    disabled: false,
    label: 'Choose an image file or drag it here',
    onFileSelect: (files) => console.log('Files selected:', files),
    onError: (error) => console.log('Upload error:', error),
  },
};

export const MultipleFiles: Story = {
  args: {
    accept: '.pdf,.doc,.docx,.txt',
    maxSize: 10485760, // 10MB
    multiple: true,
    disabled: false,
    label: 'Upload documents (multiple files allowed)',
    onFileSelect: (files) => console.log('Files selected:', files),
    onError: (error) => console.log('Upload error:', error),
  },
};

export const AvatarUpload: Story = {
  args: {
    accept: '.jpg,.jpeg,.png',
    maxSize: 2097152, // 2MB
    multiple: false,
    disabled: false,
    label: 'Upload profile picture',
    onFileSelect: (files) => console.log('Avatar selected:', files),
    onError: (error) => console.log('Upload error:', error),
  },
};

export const Disabled: Story = {
  args: {
    accept: '.jpg,.png',
    maxSize: 5242880,
    multiple: false,
    disabled: true,
    label: 'Upload disabled',
    onFileSelect: (files) => console.log('Files selected:', files),
    onError: (error) => console.log('Upload error:', error),
  },
};

export const CodeUpload: Story = {
  args: {
    accept: '.js,.ts,.jsx,.tsx,.py,.java,.cpp,.c',
    maxSize: 1048576, // 1MB
    multiple: true,
    disabled: false,
    label: 'Upload source code files',
    onFileSelect: (files) => console.log('Code files selected:', files),
    onError: (error) => console.log('Upload error:', error),
  },
};

export const DataUpload: Story = {
  args: {
    accept: '.csv,.json,.xml',
    maxSize: 5242880, // 5MB
    multiple: false,
    disabled: false,
    label: 'Upload data file (CSV, JSON, or XML)',
    onFileSelect: (files) => console.log('Data file selected:', files),
    onError: (error) => console.log('Upload error:', error),
  },
};