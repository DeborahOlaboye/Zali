'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppKit } from '@reown/appkit/react';
import { useAccount, useDisconnect } from 'wagmi';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Play', href: '/play' },
    { name: 'Rewards', href: '/rewards' },
  ];

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent cursor-pointer">
                🎓 Celo Quest
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <>
                  <button
                    onClick={() => open()}
                    className="px-3 py-2 text-sm bg-green-100 text-green-700 hover:bg-green-200 rounded-md transition-colors"
                  >
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </button>
                  <button
                    onClick={() => disconnect()}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-md transition-colors"
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <button
                  onClick={() => open()}
                  className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md transition-colors"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {isConnected ? (
                <>
                  <button
                    onClick={() => open()}
                    className="px-2 py-1 text-xs bg-green-100 text-green-700 hover:bg-green-200 rounded transition-colors"
                  >
                    {address?.slice(0, 4)}...{address?.slice(-2)}
                  </button>
                  <button
                    onClick={() => disconnect()}
                    className="px-2 py-1 text-xs bg-red-100 text-red-700 hover:bg-red-200 rounded transition-colors"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <button
                  onClick={() => open()}
                  className="px-3 py-1 text-xs bg-green-600 text-white hover:bg-green-700 rounded transition-colors"
                >
                  Connect
                </button>
              )}
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
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
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
