import { Metadata } from 'next';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Zali Trivia - Farcaster Frame',
  description: 'Answer trivia questions and earn USDC rewards on Base',
  openGraph: {
    title: 'Zali Trivia',
    description: 'Answer trivia questions and earn USDC rewards on Base',
    images: [`${APP_URL}/api/frame/image/home`],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${APP_URL}/api/frame/image/home`,
    'fc:frame:button:1': 'Play Trivia',
    'fc:frame:button:2': 'Leaderboard',
    'fc:frame:button:3': 'My Profile',
    'fc:frame:post_url': `${APP_URL}/api/frame`,
  },
};

export default function FramePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          🎮 Zali Trivia
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          This is a Farcaster Frame! View it in Warpcast or any Farcaster client to play.
        </p>
        <div className="space-y-4 text-left bg-gray-50 p-6 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <h3 className="font-bold text-lg">Free to Play</h3>
              <p className="text-gray-600">No entry fees, just answer and earn</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">💰</span>
            <div>
              <h3 className="font-bold text-lg">Real Rewards</h3>
              <p className="text-gray-600">Earn USDC for correct answers</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <h3 className="font-bold text-lg">On Base</h3>
              <p className="text-gray-600">Fast and cheap transactions</p>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Play on Web App
          </a>
        </div>
      </div>
    </div>
  );
}
