# Zali Frontend

This is the frontend application for Zali, a Web3 trivia game built on Base network.

## Features

- **Modern React/Next.js** with TypeScript
- **Web3 Integration** with Wagmi and Viem
- **Comprehensive Loading System** with progress indicators
- **Responsive Design** with TailwindCSS
- **Smooth Animations** with Framer Motion
- **State Management** with Zustand
- **Form Handling** with React Hook Form
- **Testing** with Jest and React Testing Library

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Loading System

The application features a comprehensive loading indicators system. See [LOADING_SYSTEM.md](./LOADING_SYSTEM.md) for detailed documentation.

## Async Loading States

The application includes a powerful async loading states system for managing asynchronous operations. See [ASYNC_LOADING_STATES.md](./ASYNC_LOADING_STATES.md) for comprehensive documentation.

### Features

- **useAsyncOperation** - Async operations with retry, timeout, and progress
- **useAsyncBatch** - Batch operations with concurrency control
- **useAsyncData** - Data fetching with caching and auto-refetch
- **useAsyncMutation** - Mutations with optimistic updates
- **Skeleton Loaders** - For table, list, and form loading states
- **Progress Tracking** - Multi-step operation visualization

### Quick Example

```tsx
import { LoadingButton, useLoading } from '@/components/loading';

function MyComponent() {
  const { setLoading, clearLoading } = useLoading({ component: 'my-component' });

  const handleAction = async () => {
    setLoading(true, 'Processing...', 0);
    try {
      await someAsyncOperation();
      clearLoading();
    } catch (error) {
      clearLoading();
    }
  };

  return (
    <LoadingButton onClick={handleAction}>
      Click Me
    </LoadingButton>
  );
}
```

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── loading.ts      # Loading system exports
│   ├── LoadingSpinner.tsx
│   ├── LoadingButton.tsx
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useLoading.ts   # Loading state management
│   └── ...
├── store/              # Zustand store
│   └── slices/
│       └── uiSlice.ts  # UI state including loading
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
