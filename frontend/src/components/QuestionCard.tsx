'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { QuestionCardProps } from '@/types/components';
import type { Question } from '@/data/questions';
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics';

type OptionLabel = 'A' | 'B' | 'C' | 'D';

interface ExtendedQuestionCardProps extends QuestionCardProps {
  disabled?: boolean;
}

const optionLabels: readonly OptionLabel[] = ['A', 'B', 'C', 'D'] as const;

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  disabled = false,
  className = '',
  'data-testid': testId
}: ExtendedQuestionCardProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Safety check for undefined question
  if (!question) {
    return (
      <div className="w-full max-w-3xl mx-auto p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading question...</p>
      </div>
    );
  }

  const handleSelect = (index: number): void => {
    if (disabled || selectedIndex !== null) return;
    
    setSelectedIndex(index);
    
    // Track the answer distribution
    trackEvent(ANALYTICS_EVENTS.QUESTION_ANSWERED, {
      questionId: question.id,
      category: question.category,
      difficulty: question.difficulty,
      answerIndex: index,
      isCorrect: index === question.correctAnswer,
    });
    
    // Add slight delay for visual feedback before calling onAnswer
    setTimeout(() => {
      onAnswer(index);
    }, 300);
  };

  return (
    <motion.fieldset
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`w-full max-w-3xl mx-auto ${className}`}
      disabled={disabled}
      data-testid={testId}
    >
      {/* Question Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600" aria-label={`Question ${questionNumber} of ${totalQuestions}`}>
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium" aria-label={`Category: ${question.category}`}>
            {question.category}
          </span>
        </div>
        
        <legend className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-6">
          {question.question}
        </legend>
      </div>

      {/* Options */}
      <div className="space-y-3" role="group" aria-label="Answer options">
        {question.options.map((option: string, index: number) => {
          const isSelected: boolean = selectedIndex === index;
          const optionLabel: OptionLabel = optionLabels[index] as OptionLabel;
          
          return (
            <motion.button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={disabled || selectedIndex !== null}
              whileHover={selectedIndex === null ? { scale: 1.02 } : {}}
              whileTap={selectedIndex === null ? { scale: 0.98 } : {}}
              className={`
                w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                ${isSelected
                  ? 'bg-green-600 text-white border-green-600 shadow-lg focus:ring-green-800'
                  : selectedIndex !== null
                  ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
                  : 'bg-white border-gray-200 hover:border-green-400 hover:shadow-md cursor-pointer focus:ring-green-500'
                }
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
              `}
              aria-label={`Option ${optionLabel}: ${option}${isSelected ? ' (selected)' : ''}`}
              aria-pressed={isSelected}
              type="button"
            >
              <div className="flex items-center gap-4">
                {/* Option Label */}
                <div
                  className={`
                    flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg
                    ${isSelected
                      ? 'bg-white text-green-600'
                      : 'bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  {optionLabel}
                </div>
                
                {/* Option Text */}
                <span className="text-base md:text-lg font-medium flex-1">
                  {option}
                </span>
                
                {/* Selected Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex-shrink-0"
                    aria-hidden="true"
                  >
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Difficulty Badge */}
      <div className="mt-6 flex justify-center">
        <span
          className={`
            text-xs px-3 py-1 rounded-full font-medium
            ${question.difficulty === 'easy' ? 'bg-blue-100 text-blue-700' : ''}
            ${question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : ''}
            ${question.difficulty === 'hard' ? 'bg-red-100 text-red-700' : ''}
          `}
          aria-label={`Difficulty: ${question.difficulty}`}
        >
          {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
        </span>
      </div>
    </motion.fieldset>
  );
}
