'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAccount, useDisconnect } from 'wagmi';
import { AnimatePresence, motion } from 'framer-motion';
import { NavbarProps, NavLinkProps } from '@/types/components';
import { Address } from '@/types/web3';

interface AppKitInstance {
  open: () => void;
}

interface UseClientAppKitReturn {
  open: () => void;
  isReady: boolean;
}

interface NavLink {
  readonly name: string;
  readonly href: string;
}

// Client-side AppKit hook
function useClientAppKit(): UseClientAppKitReturn {
  const [appKit, setAppKit] = useState<AppKitInstance | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const { useAppKit } = require('@reown/appkit/react');
        const kit: AppKitInstance = useAppKit();
        setAppKit(kit);
        setIsReady(true);
      } catch (error: unknown) {
        console.warn('AppKit not available:', error);
        setIsReady(true); // Still set ready to avoid infinite loading
      }
    }
  }, []);

  return {
    open: () => {
      if (appKit?.open) {
        appKit.open();
      } else {
        console.warn('AppKit not ready');
      }
    },
    isReady
  };
}

export default function Navbar({ className = '', 'data-testid': testId }: NavbarProps = {}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { open, isReady } = useClientAppKit();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // Type-safe address handling
  const formattedAddress = address as Address | undefined;

  // Close mobile menu when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setMobileMenuOpen(false);
    };
    
    // Close menu when pathname changes
    handleRouteChange();
    
    // Cleanup function
    return () => {};
  }, [pathname]); // Re-run when pathname changes

  // Close mobile menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [mobileMenuOpen]);

  const navLinks: readonly NavLink[] = [
    { name: 'Home', href: '/' },
    { name: 'Play', href: '/play' },
    { name: 'Rewards', href: '/rewards' },
    { name: 'Leaderboard', href: '/leaderboard' },
  ] as const;

  return (
    <nav className={`border-b border-gray-200 bg-white shadow-sm ${className}`} data-testid={testId}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" aria-label="Zali Home">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent cursor-pointer">
                🎓 Zali
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 ${
                  pathname === link.href
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center space-x-2">
              {!isReady ? (
                <div className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md">
                  Loading...
                </div>
              ) : isConnected ? (
                <>
                  <button
                    onClick={() => open()}
                    className="px-3 py-2 text-sm bg-green-100 text-green-700 hover:bg-green-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                    aria-label={`Connected wallet: ${formattedAddress?.slice(0, 6)}...${formattedAddress?.slice(-4)}`}
                  >
                    {formattedAddress?.slice(0, 6)}...{formattedAddress?.slice(-4)}
                  </button>
                  <button
                    onClick={() => disconnect()}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                    aria-label="Disconnect wallet"
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <button
                  onClick={() => open()}
                  className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-800 focus:ring-offset-2"
                  aria-label="Connect wallet"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {!isReady ? (
                <div className="px-2 py-1 text-xs bg-gray-300 text-gray-600 rounded">
                  ...
                </div>
              ) : isConnected ? (
                <>
                  <button
                    onClick={() => open()}
                    className="px-2 py-1 text-xs bg-green-100 text-green-700 hover:bg-green-200 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-green-600"
                    aria-label={`Connected wallet: ${formattedAddress?.slice(0, 4)}...${formattedAddress?.slice(-2)}`}
                  >
                    {formattedAddress?.slice(0, 4)}...{formattedAddress?.slice(-2)}
                  </button>
                  <button
                    onClick={() => disconnect()}
                    className="px-2 py-1 text-xs bg-red-100 text-red-700 hover:bg-red-200 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-600"
                    aria-label="Disconnect wallet"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <button
                  onClick={() => open()}
                  className="px-3 py-1 text-xs bg-green-600 text-white hover:bg-green-700 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-green-800"
                  aria-label="Connect wallet"
                >
                  Connect
                </button>
              )}
            </div>
            <button
              ref={menuButtonRef}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-haspopup="true"
            >
              <span className="sr-only">
                {mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
              </span>
              {!mobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed top-0 right-0 bottom-0 w-64 bg-white shadow-lg z-30 md:hidden overflow-y-auto"
            >
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label="Close menu"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <nav className="px-4 pt-2 pb-4">
                <div className="space-y-1">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Link
                        href={link.href}
                        className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-inset ${
                          pathname === link.href
                            ? 'bg-green-100 text-green-700'
                            : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  {!isReady ? (
                    <div className="px-4 py-2 text-sm text-gray-500">Loading wallet...</div>
                  ) : isConnected ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          open();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-inset"
                        aria-label={`Connected wallet: ${formattedAddress?.slice(0, 6)}...${formattedAddress?.slice(-4)}`}
                      >
                        Wallet: {formattedAddress?.slice(0, 6)}...{formattedAddress?.slice(-4)}
                      </button>
                      <button
                        onClick={() => {
                          disconnect();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-inset"
                        aria-label="Disconnect wallet"
                      >
                        Disconnect Wallet
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        open();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Connect Wallet
                    </button>
                  )}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
