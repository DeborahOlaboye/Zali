import { z } from 'zod';
import { GameFormErrors } from '@/validations/game.schema';

type QuestionError = {
  question?: string;
  options?: (string | { text: string })[];
  correctAnswer?: string;
  [key: string]: any; // Allow any additional properties for flexibility
};

type FormErrors = {
  [key: string]: string | QuestionError[] | undefined;
};

export const formatValidationError = (error: z.ZodError): GameFormErrors => {
  const errors: FormErrors = {};
  
  error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    
    if (path.includes('questions') && path.includes('options')) {
      // Handle nested options errors
      const parts = path.split('.');
      const questionIndex = parseInt(parts[1]);
      const optionIndex = parseInt(parts[3]);
      
      if (!Array.isArray(errors.questions)) {
        errors.questions = [];
      }
      
      if (!errors.questions[questionIndex]) {
        errors.questions[questionIndex] = { options: [] };
      }
      
      const questionError = errors.questions[questionIndex];
      if (questionError && Array.isArray(questionError.options)) {
        questionError.options[optionIndex] = issue.message;
      }
    } else if (path.includes('questions')) {
      // Handle questions array errors
      const parts = path.split('.');
      const questionIndex = parseInt(parts[1]);
      
      if (!Array.isArray(errors.questions)) {
        errors.questions = [];
      }
      
      if (!isNaN(questionIndex)) {
        const field = parts[2];
        if (field) {
          const questionError = errors.questions[questionIndex] || {};
          questionError[field] = issue.message;
          errors.questions[questionIndex] = questionError;
        }
      } else if (issue.code === 'too_small' || issue.code === 'too_big') {
        // Handle array length validations
        errors.questions = [{ _error: issue.message }];
      }
    } else {
      // Handle top-level errors
      errors[path] = issue.message;
    }
  });
  
  return errors as GameFormErrors;
};

export const getFieldError = (
  errors: GameFormErrors | undefined, 
  path: string,
  index?: number,
  subField?: string
): string | undefined => {
  if (!errors) return undefined;
  
  if (path.startsWith('questions')) {
    if (index !== undefined && Array.isArray(errors.questions)) {
      const questionError = errors.questions[index];
      if (!questionError) return undefined;
      
      // Handle string error or error object with _error property
      if (typeof questionError === 'string' || (questionError as any)._error) {
        return typeof questionError === 'string' ? questionError : (questionError as any)._error;
      }
      
      if (subField && typeof questionError === 'object') {
        const error = (questionError as any)[subField];
        if (Array.isArray(error)) {
          return error[0];
        }
        return error as string | undefined;
      }
      return undefined;
    }
    
    if (Array.isArray(errors.questions) && errors.questions.length > 0) {
      const firstError = errors.questions[0];
      return typeof firstError === 'string' ? firstError : undefined;
    }
    
    return undefined;
  }
  
  return errors[path] as string | undefined;
};
