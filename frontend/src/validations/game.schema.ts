import { z } from 'zod';

// Validation schema for a single option
export const optionSchema = z.object({
  text: z.string().min(1, 'Option cannot be empty'),
});

// Validation schema for a question
export const questionSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters'),
  options: z.array(optionSchema).min(2, 'At least 2 options are required').max(4, 'Maximum 4 options allowed'),
  correctAnswer: z.number().min(0, 'Invalid answer').max(3, 'Invalid answer'),
});

// Main game creation schema
export const gameCreateSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z.string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  entryFee: z.string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Entry fee must be a positive number',
    })
    .refine((val) => parseFloat(val) <= 1000, {
      message: 'Maximum entry fee is 1000 cUSD',
    }),
  maxPlayers: z.string()
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 1, {
      message: 'Must have at least 2 players',
    })
    .refine((val) => parseInt(val) <= 100, {
      message: 'Maximum 100 players allowed',
    }),
  questions: z.array(questionSchema)
    .min(1, 'At least one question is required')
    .max(20, 'Maximum 20 questions allowed'),
});

// Type for form data
export type GameFormData = z.infer<typeof gameCreateSchema>;

// Type for form errors
export type GameFormErrors = {
  [key: string]: string | string[] | { [key: string]: string }[];
};
