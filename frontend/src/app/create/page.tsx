'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { gameCreateSchema, GameFormData } from '@/validations/game.schema';
import { formatValidationError, getFieldError } from '@/utils/validation';
import { ZodError } from 'zod';

export default function CreateGamePage() {
  const { address } = useAccount();
  const router = useRouter();
  
  const [formData, setFormData] = useState<GameFormData>({
    title: '',
    description: '',
    entryFee: '0.1',
    maxPlayers: '5',
    questions: [
      { 
        question: '', 
        options: ['', '', '', ''].map(text => ({ text })), 
        correctAnswer: 0 
      }
    ]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const handleQuestionChange = (index: number, field: string, value: string | number) => {
    const updatedQuestions = [...formData.questions];
    
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: field === 'correctAnswer' ? Number(value) : value
    };
    
    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
    
    // Clear question error when user starts typing
    if (formErrors.questions?.[index]?.[field]) {
      const updatedErrors = { ...formErrors };
      if (updatedErrors.questions?.[index]) {
        delete updatedErrors.questions[index][field];
        setFormErrors(updatedErrors);
      }
    }
  };
  
  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = { text: value };
    
    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
    
    // Clear option error when user starts typing
    if (formErrors.questions?.[questionIndex]?.options?.[optionIndex]) {
      const updatedErrors = { ...formErrors };
      if (updatedErrors.questions?.[questionIndex]?.options) {
        updatedErrors.questions[questionIndex].options[optionIndex] = '';
        setFormErrors(updatedErrors);
      }
    }
  };
  
  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { 
          question: '', 
          options: ['', '', '', ''].map(text => ({ text })), 
          correctAnswer: 0 
        }
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
  
  const validateForm = (): boolean => {
    try {
      gameCreateSchema.parse(formData);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        setFormErrors(formatValidationError(error));
      } else if (error instanceof Error) {
        setFormErrors({ _form: error.message });
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      setFormErrors({ _form: 'Please connect your wallet first' });
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // In a real app, this would call the smart contract
      console.log('Creating game with data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to game page or show success message
      router.push('/play');
      
    } catch (err) {
      console.error('Error creating game:', err);
      setFormErrors({ _form: 'Failed to create game. Please try again.' });
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
          
          {formErrors._form && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
              {formErrors._form}
            </div>
          )}
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
                    className={`w-full px-4 py-2 bg-gray-700 border ${
                      getFieldError(formErrors, 'title') ? 'border-red-500' : 'border-gray-600'
                    } rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    placeholder="E.g., Crypto Trivia Challenge"
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
                    className={`w-full px-4 py-2 bg-gray-700 border ${
                      getFieldError(formErrors, 'description') ? 'border-red-500' : 'border-gray-600'
                    } rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    placeholder="Describe your trivia game..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="entryFee" className="block text-sm font-medium text-gray-300 mb-1">
                      Entry Fee (cUSD) *
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="relative">
                      <input
                        type="number"
                        id="entryFee"
                        name="entryFee"
                        min="0.01"
                        step="0.01"
                        value={formData.entryFee}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-2 bg-gray-700 border ${
                          getFieldError(formErrors, 'entryFee') ? 'border-red-500' : 'border-gray-600'
                        } rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400">$</span>
                      </div>
                      {getFieldError(formErrors, 'entryFee') && (
                        <p className="mt-1 text-sm text-red-500">
                          {getFieldError(formErrors, 'entryFee')}
                        </p>
                      )}
                    </div>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-400">cUSD</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="maxPlayers" className="block text-sm font-medium text-gray-300 mb-1">
                      Max Players *
                    </label>
                    <div>
                      <input
                        type="number"
                        id="maxPlayers"
                        name="maxPlayers"
                        min="2"
                        max="100"
                        value={formData.maxPlayers}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 bg-gray-700 border ${
                          getFieldError(formErrors, 'maxPlayers') ? 'border-red-500' : 'border-gray-600'
                        } rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      />
                      {getFieldError(formErrors, 'maxPlayers') && (
                        <p className="mt-1 text-sm text-red-500">
                          {getFieldError(formErrors, 'maxPlayers')}
                        </p>
                      )}
                    </div>
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
                {formData.questions.map((q, qIndex) => {
                  const questionError = formErrors.questions?.[qIndex];
                  const questionErrorText = typeof questionError === 'string' ? questionError : undefined;
                  
                  return (
                    <div key={qIndex} className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Question {qIndex + 1}</h3>
                        {formData.questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(qIndex)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      {questionErrorText && (
                        <div className="mb-3 p-2 bg-red-900/50 border border-red-700 rounded text-sm text-red-200">
                          {questionErrorText}
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <label htmlFor={`question-${qIndex}`} className="block text-sm font-medium text-gray-300 mb-1">
                          Question *
                        </label>
                        <input
                          type="text"
                          id={`question-${qIndex}`}
                          value={q.question}
                          onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                          className={`w-full px-4 py-2 bg-gray-700 border ${
                            getFieldError(formErrors, 'questions', qIndex, 'question') ? 'border-red-500' : 'border-gray-600'
                          } rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                          placeholder="Enter your question"
                        />
                        {getFieldError(formErrors, 'questions', qIndex, 'question') && (
                          <p className="mt-1 text-sm text-red-500">
                            {getFieldError(formErrors, 'questions', qIndex, 'question')}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-300">
                          Options *
                          {getFieldError(formErrors, 'questions', qIndex, 'options') && (
                            <span className="ml-2 text-red-500 text-xs font-normal">
                              {getFieldError(formErrors, 'questions', qIndex, 'options')}
                            </span>
                          )}
                        </label>
                        {q.options.map((option, oIndex) => {
                          const optionError = questionError?.options?.[oIndex];
                          return (
                            <div key={oIndex} className="flex items-start">
                              <input
                                type="radio"
                                name={`correct-${qIndex}`}
                                checked={q.correctAnswer === oIndex}
                                onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)}
                                className="mt-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-600"
                              />
                              <div className="ml-2 flex-1">
                                <input
                                  type="text"
                                  value={option.text}
                                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                  className={`w-full px-3 py-1.5 bg-gray-700 border ${
                                    optionError ? 'border-red-500' : 'border-gray-600'
                                  } rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                                  placeholder={`Option ${oIndex + 1}`}
                                />
                                {optionError && (
                                  <p className="mt-1 text-sm text-red-500">
                                    {optionError}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Correct Answer
                        </label>
                        <select
                          value={q.correctAnswer}
                          onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          {q.options.map((_, idx) => (
                            <option key={idx} value={idx}>
                              Option {idx + 1}
                            </option>
                          ))}
                        </select>
                        {getFieldError(formErrors, 'questions', qIndex, 'correctAnswer') && (
                          <p className="mt-1 text-sm text-red-500">
                            {getFieldError(formErrors, 'questions', qIndex, 'correctAnswer')}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            
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
