import type { Meta, StoryObj } from '@storybook/react';
import DatePicker from '../components/DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A date picker component for selecting dates with calendar interface.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'date' },
      description: 'Selected date',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the date picker is disabled',
    },
    minDate: {
      control: { type: 'date' },
      description: 'Minimum selectable date',
    },
    maxDate: {
      control: { type: 'date' },
      description: 'Maximum selectable date',
    },
    label: {
      control: { type: 'text' },
      description: 'Date picker label',
    },
    onChange: {
      action: 'dateChanged',
      description: 'Callback fired when date changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Basic: Story = {
  args: {
    value: null,
    placeholder: 'Select a date',
    disabled: false,
    label: 'Birth Date',
    onChange: (date) => console.log('Date selected:', date),
  },
};

export const WithValue: Story = {
  args: {
    value: new Date(),
    placeholder: 'Select a date',
    disabled: false,
    label: 'Current Date',
    onChange: (date) => console.log('Date selected:', date),
  },
};

export const DateRange: Story = {
  args: {
    value: null,
    placeholder: 'Select event date',
    disabled: false,
    minDate: new Date(),
    maxDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    label: 'Event Date',
    onChange: (date) => console.log('Event date selected:', date),
  },
};

export const Disabled: Story = {
  args: {
    value: new Date('2023-06-15'),
    placeholder: 'Cannot select date',
    disabled: true,
    label: 'Disabled Date Picker',
    onChange: (date) => console.log('Date selected:', date),
  },
};

export const PastDatesOnly: Story = {
  args: {
    value: null,
    placeholder: 'Select birth date',
    disabled: false,
    maxDate: new Date(),
    label: 'Birth Date',
    onChange: (date) => console.log('Birth date selected:', date),
  },
};

export const FutureDatesOnly: Story = {
  args: {
    value: null,
    placeholder: 'Select appointment date',
    disabled: false,
    minDate: new Date(),
    label: 'Appointment Date',
    onChange: (date) => console.log('Appointment date selected:', date),
  },
};

export const RegistrationDate: Story = {
  args: {
    value: null,
    placeholder: 'When did you join?',
    disabled: false,
    minDate: new Date('2020-01-01'),
    maxDate: new Date(),
    label: 'Registration Date',
    onChange: (date) => console.log('Registration date selected:', date),
  },
};