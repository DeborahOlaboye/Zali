import { motion, AnimatePresence } from 'framer-motion';

interface FaucetPromptProps {
  isVisible: boolean;
  isClaiming: boolean;
  hasClaimed: boolean;
  onCancel: () => void;
}

export function FaucetPrompt({ isVisible, isClaiming, hasClaimed, onCancel }: FaucetPromptProps) {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 right-6 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-w-sm p-4"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-white">
              {hasClaimed ? 'Success!' : 'Low Balance Detected'}
            </h3>
            <div className="mt-1 text-sm text-gray-300">
              {hasClaimed ? (
                'cUSD has been added to your wallet!'
              ) : isClaiming ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Adding cUSD to your wallet...
                </div>
              ) : (
                'You have a low balance. Would you like to claim some test cUSD?'
              )}
            </div>
            {!isClaiming && !hasClaimed && (
              <div className="mt-4 flex space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={onCancel}
                >
                  No, thanks
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
