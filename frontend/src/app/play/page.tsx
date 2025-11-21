'use client';

import { useState, useEffect } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import { useRouter } from 'next/navigation';
import { CONTRACTS } from '@/config/contracts';
import { formatEther } from 'viem';
import { motion } from 'framer-motion';

// Mock data for active games
const mockGames = [
  {
    id: 1,
    title: 'Crypto Trivia',
    entryFee: '0.1',
    prizePool: '0.5',
    players: 3,
    maxPlayers: 5,
  },
  {
    id: 2,
    title: 'DeFi Masters',
    entryFee: '0.2',
    prizePool: '1.0',
    players: 1,
    maxPlayers: 3,
  },
];

export default function PlayPage() {
  const { address } = useAccount();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('active');
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  
  // In a real app, you would fetch this from the contract
  const [games, setGames] = useState(mockGames);
  
  const joinGame = (gameId: number) => {
    // In a real app, this would call the smart contract
    console.log(`Joining game ${gameId}`);
    setSelectedGame(gameId);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Play Trivia</h1>
          <p className="text-gray-600">Test your Celo knowledge and earn cUSD rewards!</p>
        </div>
        
        {/* Featured Game Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-12 border-2 border-green-200"
        >
          <div className="text-center">
            <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🔥 Featured Game
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🎓 Celo Basics Quiz
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Test your knowledge about Celo blockchain and earn cUSD rewards!
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <p className="text-sm text-gray-600 mb-1">💰 Prize Pool</p>
                <p className="text-2xl font-bold text-green-600">2.5 cUSD</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">🎫 Entry Fee</p>
                <p className="text-2xl font-bold text-blue-600">0.1 cUSD</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <p className="text-sm text-gray-600 mb-1">❓ Questions</p>
                <p className="text-2xl font-bold text-purple-600">5</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                <p className="text-sm text-gray-600 mb-1">⏱️ Time</p>
                <p className="text-2xl font-bold text-orange-600">2.5 min</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => router.push('/play/game?gameId=1')}
                disabled={!address}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed min-w-[250px]"
              >
                {address ? '🎮 Start Playing Now' : '🔌 Connect Wallet First'}
              </button>
              
              {!address && (
                <p className="text-sm text-gray-500">
                  Connect your wallet to start playing
                </p>
              )}
            </div>
            
            {address && (
              <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <div className="flex items-center justify-center gap-2 text-blue-800">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium">
                    💡 Pro Tip: Answer quickly to maximize your score and earnings!
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
        
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setActiveTab('active')}
              className={`px-6 py-2 text-sm font-medium rounded-l-lg ${
                activeTab === 'active'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Active Games
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('my-games')}
              className={`px-6 py-2 text-sm font-medium ${
                activeTab === 'my-games'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              My Games
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-2 text-sm font-medium rounded-r-lg ${
                activeTab === 'completed'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Completed
            </button>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <div key={game.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{game.title}</h3>
                  <span className="bg-green-900 text-green-300 text-xs font-medium px-2.5 py-0.5 rounded">
                    {game.players}/{game.maxPlayers} Players
                  </span>
                </div>
                
                <div className="space-y-3 text-sm text-gray-300 mb-6">
                  <div className="flex justify-between">
                    <span>Entry Fee:</span>
                    <span className="font-medium text-white">{game.entryFee} cUSD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prize Pool:</span>
                    <span className="font-medium text-green-400">{game.prizePool} cUSD</span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full" 
                    style={{ width: `${(game.players / game.maxPlayers) * 100}%` }}
                  ></div>
                </div>
                
                <button
                  onClick={() => joinGame(game.id)}
                  disabled={!address || game.players >= game.maxPlayers}
                  className={`w-full py-2.5 px-4 rounded-md font-medium ${
                    !address || game.players >= game.maxPlayers
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {!address 
                    ? 'Connect Wallet to Play' 
                    : game.players >= game.maxPlayers 
                      ? 'Game Full' 
                      : 'Join Game'}
                </button>
              </div>
            </div>
          ))}
          
          {games.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 mb-4">No active games found</p>
              <a 
                href="/create" 
                className="text-green-400 hover:text-green-300 font-medium"
              >
                Create a new game
              </a>
            </div>
          )}
        </div>
        
        {selectedGame && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Join Game</h3>
                <button 
                  onClick={() => setSelectedGame(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <p className="text-gray-300 mb-6">
                You're about to join a game. This will charge your wallet the entry fee.
              </p>
              
              <div className="space-y-3 text-sm text-gray-300 mb-6">
                <div className="flex justify-between">
                  <span>Game ID:</span>
                  <span className="text-white">#{selectedGame}</span>
                </div>
                <div className="flex justify-between">
                  <span>Entry Fee:</span>
                  <span className="text-white">0.1 cUSD</span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedGame(null)}
                  className="flex-1 py-2 px-4 rounded-md bg-gray-600 hover:bg-gray-500 text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // In a real app, this would call the smart contract
                    console.log('Joining game', selectedGame);
                    setSelectedGame(null);
                  }}
                  className="flex-1 py-2 px-4 rounded-md bg-green-600 hover:bg-green-500 text-white"
                >
                  Confirm Join
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
