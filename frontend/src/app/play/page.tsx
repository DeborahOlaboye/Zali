'use client';

import { useState, useEffect } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import { Navbar } from '@/components/Navbar';
import { CONTRACTS } from '@/config/contracts';
import { formatEther } from 'viem';

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
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Play Trivia</h1>
          <p className="text-gray-400">Join an existing game or create your own</p>
        </div>
        
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
