import { motion } from 'framer-motion';
import { GiftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

type RewardItemProps = {
  id: number;
  name: string;
  description: string;
  pointsRequired: number;
  isClaimed: boolean;
  onRedeem: (id: number) => void;
  isRedeeming?: boolean;
};

export function RewardItem({
  id,
  name,
  description,
  pointsRequired,
  isClaimed,
  onRedeem,
  isRedeeming = false,
}: RewardItemProps) {
  return (
    <motion.div 
      className={`relative p-6 rounded-xl border-2 ${
        isClaimed 
          ? 'border-green-200 bg-green-50' 
          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200'
      }`}
      whileHover={{ scale: isClaimed ? 1 : 1.02 }}
      whileTap={{ scale: isClaimed ? 1 : 0.98 }}
    >
      <div className="flex items-start">
        <div className={`p-3 rounded-lg ${
          isClaimed ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
        }`}>
          <GiftIcon className="h-6 w-6" />
        </div>
        
        <div className="ml-4 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">{name}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {pointsRequired} pts
            </span>
          </div>
          
          <p className="mt-1 text-sm text-gray-600">{description}</p>
          
          <div className="mt-4">
            {isClaimed ? (
              <div className="inline-flex items-center text-sm font-medium text-green-600">
                <CheckCircleIcon className="h-5 w-5 mr-1.5" />
                Claimed
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onRedeem(id)}
                disabled={isRedeeming}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  isRedeeming 
                    ? 'bg-blue-400' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isRedeeming ? 'Processing...' : 'Redeem'}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {isClaimed && (
        <div className="absolute top-3 right-3">
          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100">
            <CheckCircleIcon className="h-4 w-4 text-green-600" />
          </div>
        </div>
      )}
    </motion.div>
  );
}
