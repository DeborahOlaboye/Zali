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

## Mobile Responsiveness

The application features a comprehensive mobile responsiveness system for building adaptive UIs. See [MOBILE_RESPONSIVENESS.md](./MOBILE_RESPONSIVENESS.md) for detailed documentation.

### Features

- **Media Query Hooks** - Custom and predefined breakpoint detection
- **Responsive Containers** - Adaptive layouts and grids
- **Mobile Menu** - Slide-in navigation with animations
- **Responsive Forms** - Mobile-optimized input components
- **Responsive Typography** - Adaptive font sizes
- **Responsive Tables** - Card view on mobile devices
- **Touch-Friendly Buttons** - Optimized for mobile interaction

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

## Deployment

For comprehensive deployment instructions, including environment setup, platform-specific guides, monitoring, and troubleshooting, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Deploy to Vercel

The easiest way to deploy is to use Vercel:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod
```

For other deployment options (Netlify, Docker, custom server) and detailed configuration, refer to the [complete deployment guide](./DEPLOYMENT.md).
