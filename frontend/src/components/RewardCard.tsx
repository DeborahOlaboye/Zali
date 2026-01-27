import { motion } from 'framer-motion';
import { ReactNode } from 'react';

/**
 * RewardCard displays a reward or achievement card with icon and details
 * 
 * Used to showcase rewards, achievements, or stats with optional action button.
 * Features hover animations and color customization.
 * 
 * @component
 * @example
 * <RewardCard 
 *   icon={<StarIcon />}
 *   title="Perfect Score"
 *   amount="+100 pts"
 *   description="Answered all questions correctly"
 *   color="text-yellow-500"
 * />
 */
interface RewardCardProps {
  /** Icon or element to display (usually an emoji or icon component) */
  icon: ReactNode;
  
  /** Card title */
  title: string;
  
  /** Amount or value to display (e.g., '+100 pts', '10 USDC') */
  amount: string;
  
  /** Description text for the card */
  description: string;
  
  /** CSS color class for the icon (e.g., 'text-yellow-500', 'text-blue-600') */
  color: string;
  
  /** Optional action element (button, link, etc.) */
  action?: ReactNode;
}

export function RewardCard({ icon, title, amount, description, color, action }: RewardCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col"
    >
      <div className={`mb-4 ${color}`}>{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
      <div className="text-2xl font-bold mb-2">{amount}</div>
      <p className="text-gray-600 text-sm mb-3">{description}</p>
      {action && <div className="mt-auto pt-2">{action}</div>}
    </motion.div>
  );
}
