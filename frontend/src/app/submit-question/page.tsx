'use client';

import { motion } from 'framer-motion';
import QuestionSubmissionForm from '@/components/QuestionSubmissionForm';

export default function SubmitQuestionPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4"
    >
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Submit a Question
          </h1>
          <p className="text-gray-600 text-lg">
            Help expand our trivia database by submitting your own questions!
          </p>
        </div>

        <QuestionSubmissionForm />
      </div>
    </motion.div>
  );
}