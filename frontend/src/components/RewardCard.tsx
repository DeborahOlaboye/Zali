import { motion } from 'framer-motion';

interface RewardCardProps {
  icon: string;
  title: string;
  amount: string;
  description: string;
  color: string;
}

export function RewardCard({ icon, title, amount, description, color }: RewardCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col"
    >
      <div className={`text-4xl mb-4 ${color}`}>{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <div className="text-3xl font-bold mb-3">{amount}</div>
      <p className="text-gray-600 text-sm mt-auto">{description}</p>
    </motion.div>
  );
}
