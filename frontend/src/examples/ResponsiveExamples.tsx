'use client';

/**
 * Comprehensive examples for responsive components
 */

import {
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveStack,
  ResponsiveCard,
  ResponsiveCardHeader,
  ResponsiveCardBody,
  ResponsiveButton,
  ResponsiveFormField,
  ResponsiveInput,
  ResponsiveTable,
  ResponsiveHeading,
  MobileMenu,
  MobileMenuButton,
  MobileMenuItem,
  useIsMobile,
} from '@/responsive';
import { useState } from 'react';

/**
 * Example 1: Responsive Grid Layout
 */
export function ResponsiveGridExample() {
  const items = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    title: `Item ${i + 1}`,
    description: 'Lorem ipsum dolor sit amet',
  }));

  return (
    <ResponsiveContainer maxWidth="xl" padding="md">
      <ResponsiveHeading level={2} align="center">
        Responsive Grid
      </ResponsiveHeading>

      <ResponsiveGrid
        cols={{ sm: 1, md: 2, lg: 3, xl: 4 }}
        gap="md"
        className="mt-8"
      >
        {items.map((item) => (
          <ResponsiveCard key={item.id} padding="md" hover>
            <ResponsiveCardHeader title={item.title} />
            <ResponsiveCardBody>{item.description}</ResponsiveCardBody>
          </ResponsiveCard>
        ))}
      </ResponsiveGrid>
    </ResponsiveContainer>
  );
}

/**
 * Example 2: Responsive Stack
 */
export function ResponsiveStackExample() {
  return (
    <ResponsiveContainer maxWidth="lg" padding="md">
      <ResponsiveHeading level={2}>Responsive Stack</ResponsiveHeading>

      <ResponsiveStack
        direction="responsive"
        gap="md"
        align="center"
        justify="between"
        className="mt-8"
      >
        <div className="bg-blue-100 p-6 rounded-lg">Item 1</div>
        <div className="bg-green-100 p-6 rounded-lg">Item 2</div>
        <div className="bg-purple-100 p-6 rounded-lg">Item 3</div>
      </ResponsiveStack>
    </ResponsiveContainer>
  );
}

/**
 * Example 3: Responsive Form
 */
export function ResponsiveFormExample() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <ResponsiveContainer maxWidth="md" padding="md">
      <ResponsiveHeading level={2} align="center">
        Contact Form
      </ResponsiveHeading>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <ResponsiveFormField label="Name" required>
          <ResponsiveInput
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </ResponsiveFormField>

        <ResponsiveFormField label="Email" required>
          <ResponsiveInput
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </ResponsiveFormField>

        <ResponsiveFormField label="Message" required>
          <ResponsiveInput
            placeholder="Your message..."
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
          />
        </ResponsiveFormField>

        <ResponsiveButton type="submit" variant="primary" fullWidth>
          Submit
        </ResponsiveButton>
      </form>
    </ResponsiveContainer>
  );
}

/**
 * Example 4: Responsive Table
 */
export function ResponsiveTableExample() {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email', hideOnMobile: true },
    { key: 'role', label: 'Role' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded text-sm ${
            value === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  const data = [
    { name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'inactive' },
    { name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'active' },
  ];

  return (
    <ResponsiveContainer maxWidth="xl" padding="md">
      <ResponsiveHeading level={2}>Users Table</ResponsiveHeading>

      <ResponsiveTable
        columns={columns}
        data={data}
        mobileCardView
        striped
        hover
        className="mt-8"
      />
    </ResponsiveContainer>
  );
}

/**
 * Example 5: Mobile Menu
 */
export function MobileMenuExample() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="bg-white p-4 border-b">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">My App</h1>

        {isMobile ? (
          <>
            <MobileMenuButton onClick={() => setIsMenuOpen(true)} />

            <MobileMenu
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
            >
              <div className="space-y-2">
                <MobileMenuItem label="Home" href="/" />
                <MobileMenuItem label="About" href="/about" />
                <MobileMenuItem label="Services" href="/services" />
                <MobileMenuItem label="Contact" href="/contact" />
              </div>
            </MobileMenu>
          </>
        ) : (
          <nav className="flex items-center space-x-6">
            <a href="/" className="hover:text-blue-600">Home</a>
            <a href="/about" className="hover:text-blue-600">About</a>
            <a href="/services" className="hover:text-blue-600">Services</a>
            <a href="/contact" className="hover:text-blue-600">Contact</a>
          </nav>
        )}
      </div>
    </div>
  );
}

/**
 * Main Examples Component
 */
export default function ResponsiveExamples() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="space-y-16">
        <div className="text-center">
          <ResponsiveHeading level={1} align="center" gradient>
            Responsive Components Examples
          </ResponsiveHeading>
          <p className="text-gray-600 mt-4 text-lg">
            Comprehensive examples of responsive components
          </p>
        </div>

        <ResponsiveGridExample />
        <ResponsiveStackExample />
        <ResponsiveFormExample />
        <ResponsiveTableExample />
        <MobileMenuExample />
      </div>
    </div>
  );
}
