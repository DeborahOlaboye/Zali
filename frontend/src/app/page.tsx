'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32" aria-label="Hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent mb-6">
                Zali: Learn, Play, Earn
              </h1>
              <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-4 max-w-3xl mx-auto">
                Learn about Celo & DeFi while earning real cUSD rewards via MiniPay
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Mobile-first trivia game optimized for MiniPay with seamless cUSD rewards
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="/faucet"
                className="px-8 py-4 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-800 focus:ring-offset-2"
              >
                🪙 Claim Free cUSD
              </Link>
              <Link
                href="/play"
                className="px-8 py-4 bg-yellow-500 text-gray-900 rounded-lg font-semibold text-lg hover:bg-yellow-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:ring-offset-2"
              >
                🎮 Play Now
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto"
              role="region"
              aria-label="Key game statistics"
            >
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-3xl font-bold text-green-600 mb-2" aria-label="Entry Fee amount">0.05 cUSD</div>
                <div className="text-gray-600">Entry Fee</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-3xl font-bold text-yellow-600 mb-2" aria-label="Maximum rewards amount">0.17 cUSD</div>
                <div className="text-gray-600">Max Rewards</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-3xl font-bold text-blue-600 mb-2" aria-label="Optimized for MiniPay wallet">MiniPay</div>
                <div className="text-gray-600">Optimized</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-3xl font-bold text-purple-600 mb-2" aria-label="Number of questions">80+</div>
                <div className="text-gray-600">Questions</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white" aria-label="How it works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🪙',
                title: 'Claim Tokens',
                description: 'Get free cUSD from our faucet via MiniPay',
              },
              {
                icon: '🎮',
                title: 'Play Trivia',
                description: 'Answer 10 questions about Celo & DeFi for 0.05 cUSD',
              },
              {
                icon: '💰',
                title: 'Win cUSD',
                description: 'Earn up to 0.17 cUSD per game with instant payouts',
              },
              {
                icon: '📱',
                title: 'MiniPay Ready',
                description: 'Seamless experience with cUSD gas payments',
              },
            ].map((feature, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-4"
              >
                <div className="text-6xl mb-4" aria-hidden="true">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-yellow-50" aria-label="What makes us different">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            What Makes Us Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '📚',
                title: 'Educational',
                description: 'Learn about Celo, DeFi, and MiniPay while earning cUSD rewards',
              },
              {
                icon: '💰',
                title: 'cUSD Rewards',
                description: 'Earn real cUSD stablecoin rewards with instant MiniPay payouts',
              },
              {
                icon: '📱',
                title: 'MiniPay Optimized',
                description: 'Built specifically for Celo MiniPay with seamless mobile experience',
              },
            ].map((item, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-8 shadow-lg"
              >
                <div className="text-4xl mb-3" aria-hidden="true">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 text-lg">{item.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-yellow-500" aria-label="Call to action">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Learning and Earning?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join via MiniPay and start earning cUSD while learning about Celo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/faucet"
              className="px-8 py-4 bg-white text-green-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-yellow-500"
            >
              Claim Your Free Tokens
            </Link>
            <Link
              href="/create"
              className="px-8 py-4 bg-gray-900 text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-600"
            >
              Create a Game
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
