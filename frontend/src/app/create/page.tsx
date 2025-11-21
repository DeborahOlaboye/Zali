'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';

export default function CreateGamePage() {
  const { address } = useAccount();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    entryFee: '0.1',
    maxPlayers: '5',
    questions: [
      { question: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleQuestionChange = (index: number, field: string, value: string) => {
    const updatedQuestions = [...formData.questions];
    // @ts-ignore
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: field === 'correctAnswer' ? parseInt(value) : value
    };
    
    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };
  
  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    
    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };
  
  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { question: '', options: ['', '', '', ''], correctAnswer: 0 }
      ]
    }));
  };
  
  const removeQuestion = (index: number) => {
    if (formData.questions.length <= 1) return;
    
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      setError('Please connect your wallet first');
      return;
    }
    
    // Basic validation
    if (!formData.title.trim()) {
      setError('Please enter a title for your game');
      return;
    }
    
    if (formData.questions.some(q => !q.question.trim() || q.options.some(opt => !opt.trim()))) {
      setError('Please fill in all questions and options');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // In a real app, this would call the smart contract
      console.log('Creating game with data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to game page or show success message
      router.push('/play');
      
    } catch (err) {
      console.error('Error creating game:', err);
      setError('Failed to create game. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Create a Trivia Game</h1>
          <p className="text-gray-400">Set up your own trivia game and challenge others</p>
        </div>
        
        {!address ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-300 mb-6">Please connect your wallet to create a new game.</p>
            <button 
              className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-md font-medium"
              onClick={() => {}}
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Game Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                    Game Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="E.g., Crypto Trivia Challenge"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe your trivia game..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="entryFee" className="block text-sm font-medium text-gray-300 mb-1">
                      Entry Fee (cUSD) *
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="number"
                        id="entryFee"
                        name="entryFee"
                        min="0.01"
                        step="0.01"
                        value={formData.entryFee}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-400">cUSD</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="maxPlayers" className="block text-sm font-medium text-gray-300 mb-1">
                      Max Players *
                    </label>
                    <input
                      type="number"
                      id="maxPlayers"
                      name="maxPlayers"
                      min="2"
                      max="10"
                      value={formData.maxPlayers}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Questions</h2>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium"
                >
                  Add Question
                </button>
              </div>
              
              <div className="space-y-8">
                {formData.questions.map((q, qIndex) => (
                  <div key={qIndex} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-medium">Question #{qIndex + 1}</h3>
                      {formData.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(qIndex)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white mb-4"
                        placeholder="Enter your question"
                        required
                      />
                      
                      <div className="space-y-2">
                        {q.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={q.correctAnswer === oIndex}
                              onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex.toString())}
                              className="h-4 w-4 text-green-500 border-gray-600 focus:ring-green-500"
                              required
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                              className="ml-2 flex-1 px-3 py-1.5 bg-gray-600 border border-gray-500 rounded-md text-white"
                              placeholder={`Option ${oIndex + 1}`}
                              required
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {error && (
              <div className="p-4 bg-red-900/30 border border-red-700 rounded-md text-red-300">
                {error}
              </div>
            )}
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/play')}
                className="px-6 py-2.5 border border-gray-600 rounded-md font-medium text-white hover:bg-gray-700"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 rounded-md font-medium text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Game'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
