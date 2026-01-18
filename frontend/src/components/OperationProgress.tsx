'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ProgressBar } from './ProgressBar';
import { LoadingDots } from './LoadingDots';

/**
 * OperationProgress Props
 */
export interface OperationProgressProps {
  steps: ProgressStep[];
  currentStep: number;
  progress?: number;
  isLoading?: boolean;
  className?: string;
}

/**
 * Progress step
 */
export interface ProgressStep {
  label: string;
  description?: string;
  icon?: ReactNode;
  status?: 'pending' | 'in-progress' | 'completed' | 'error';
}

/**
 * OperationProgress component for multi-step async operations
 */
export function OperationProgress({
  steps,
  currentStep,
  progress,
  isLoading = true,
  className = '',
}: OperationProgressProps) {
  const overallProgress = progress ?? (currentStep / steps.length) * 100;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overall Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Overall Progress</span>
          <span className="font-semibold text-gray-900">{Math.round(overallProgress)}%</span>
        </div>
        <ProgressBar progress={overallProgress} size="md" color="primary" />
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const stepStatus = step.status ?? getStepStatus(index, currentStep);
          const isActive = index === currentStep;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-start space-x-4 p-4 rounded-lg border ${
                isActive
                  ? 'border-blue-500 bg-blue-50'
                  : stepStatus === 'completed'
                  ? 'border-green-500 bg-green-50'
                  : stepStatus === 'error'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              {/* Step Icon/Number */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  isActive
                    ? 'bg-blue-500 text-white'
                    : stepStatus === 'completed'
                    ? 'bg-green-500 text-white'
                    : stepStatus === 'error'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {step.icon ? (
                  step.icon
                ) : stepStatus === 'completed' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : stepStatus === 'error' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4
                    className={`text-sm font-semibold ${
                      isActive
                        ? 'text-blue-900'
                        : stepStatus === 'completed'
                        ? 'text-green-900'
                        : stepStatus === 'error'
                        ? 'text-red-900'
                        : 'text-gray-700'
                    }`}
                  >
                    {step.label}
                  </h4>
                  {isActive && isLoading && <LoadingDots size="sm" color="primary" />}
                </div>
                {step.description && (
                  <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Get step status based on current step
 */
function getStepStatus(stepIndex: number, currentStep: number): ProgressStep['status'] {
  if (stepIndex < currentStep) return 'completed';
  if (stepIndex === currentStep) return 'in-progress';
  return 'pending';
}

/**
 * Compact operation progress indicator
 */
export function CompactOperationProgress({
  label,
  progress,
  isLoading = true,
  className = '',
}: {
  label: string;
  progress: number;
  isLoading?: boolean;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {isLoading && <LoadingDots size="sm" color="primary" />}
        </div>
        <span className="text-sm font-semibold text-gray-900">{Math.round(progress)}%</span>
      </div>
      <ProgressBar progress={progress} size="sm" color="primary" showPercentage={false} />
    </div>
  );
}
