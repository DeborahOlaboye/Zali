import { z } from 'zod';
import { FieldError, FieldErrors, UseFormReturn } from 'react-hook-form';

// Base form types
export interface FormFieldProps<T = string> {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  error?: FieldError;
  value?: T;
  onChange?: (value: T) => void;
  onBlur?: () => void;
}

export interface FormState<T extends Record<string, unknown> = Record<string, unknown>> {
  values: T;
  errors: FieldErrors<T>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitCount: number;
}

export interface FormMethods<T extends Record<string, unknown> = Record<string, unknown>> 
  extends UseFormReturn<T> {
  handleSubmit: (onSubmit: (data: T) => void | Promise<void>) => (e?: React.BaseSyntheticEvent) => Promise<void>;
}

// Validation schemas
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be at most 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
  .transform(val => val.trim());

export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number');

export const addressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Please enter a valid Ethereum address');

export const amountSchema = z
  .string()
  .regex(/^\d+(\.\d+)?$/, 'Please enter a valid amount')
  .transform(val => parseFloat(val))
  .refine(val => val > 0, 'Amount must be greater than 0');

// Form data types
export interface RegistrationFormData {
  username: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ProfileFormData {
  username: string;
  email: string;
  bio?: string;
  avatar?: File;
}

export interface GameSettingsFormData {
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  questionCount: number;
  categories: readonly string[];
}

export interface TransferFormData {
  to: string;
  amount: string;
  token: string;
  memo?: string;
}

export interface FeedbackFormData {
  rating: number;
  comment: string;
  category: 'bug' | 'feature' | 'general';
  email?: string;
}

// Validation result types
export interface ValidationResult<T = unknown> {
  isValid: boolean;
  data?: T;
  errors: Record<string, string[]>;
}

export interface FieldValidationResult {
  isValid: boolean;
  error?: string;
}

// Form field component types
export interface TextFieldProps extends FormFieldProps<string> {
  type?: 'text' | 'email' | 'password' | 'url' | 'tel';
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  autoComplete?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface NumberFieldProps extends FormFieldProps<number> {
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  format?: 'decimal' | 'currency' | 'percentage';
}

export interface SelectFieldProps<T = string> extends FormFieldProps<T> {
  options: readonly SelectOption<T>[];
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  loading?: boolean;
}

export interface SelectOption<T = string> {
  readonly value: T;
  readonly label: string;
  readonly disabled?: boolean;
  readonly icon?: React.ReactNode;
}

export interface CheckboxFieldProps extends FormFieldProps<boolean> {
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export interface RadioFieldProps<T = string> extends FormFieldProps<T> {
  options: readonly RadioOption<T>[];
  direction?: 'horizontal' | 'vertical';
}

export interface RadioOption<T = string> {
  readonly value: T;
  readonly label: string;
  readonly disabled?: boolean;
  readonly description?: string;
}

export interface FileFieldProps extends FormFieldProps<File | File[]> {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  preview?: boolean;
}

export interface DateFieldProps extends FormFieldProps<Date> {
  format?: string;
  minDate?: Date;
  maxDate?: Date;
  showTime?: boolean;
  timeFormat?: '12h' | '24h';
}

// Form validation hooks
export interface UseFormValidationOptions<T extends Record<string, unknown>> {
  schema: z.ZodSchema<T>;
  mode?: 'onChange' | 'onBlur' | 'onSubmit';
  reValidateMode?: 'onChange' | 'onBlur' | 'onSubmit';
  defaultValues?: Partial<T>;
}

export interface UseFormValidationReturn<T extends Record<string, unknown>> {
  values: T;
  errors: FieldErrors<T>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  register: (name: keyof T) => {
    name: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
    ref: React.Ref<HTMLInputElement>;
  };
  setValue: (name: keyof T, value: T[keyof T]) => void;
  getValues: () => T;
  reset: (values?: Partial<T>) => void;
  handleSubmit: (onSubmit: (data: T) => void | Promise<void>) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  watch: (name?: keyof T) => T[keyof T] | T;
  trigger: (name?: keyof T) => Promise<boolean>;
}

// Form context types
export interface FormContextValue<T extends Record<string, unknown> = Record<string, unknown>> {
  formState: FormState<T>;
  methods: FormMethods<T>;
  schema?: z.ZodSchema<T>;
}

// Form builder types
export interface FormFieldConfig<T = unknown> {
  name: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'radio' | 'file' | 'date';
  label?: string;
  placeholder?: string;
  required?: boolean;
  validation?: z.ZodSchema<T>;
  options?: readonly SelectOption<T>[] | readonly RadioOption<T>[];
  props?: Record<string, unknown>;
}

export interface FormConfig<T extends Record<string, unknown> = Record<string, unknown>> {
  fields: readonly FormFieldConfig[];
  schema: z.ZodSchema<T>;
  defaultValues?: Partial<T>;
  onSubmit: (data: T) => void | Promise<void>;
}

// Error handling types
export interface FormError {
  field?: string;
  message: string;
  code?: string;
}

export interface FormErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

// Utility types
export type FormDataExtractor<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] extends File ? File : T[K] extends File[] ? File[] : string;
};

export type FormValidator<T> = (value: T) => string | undefined;

export type FormFieldValidator<T extends Record<string, unknown>> = {
  [K in keyof T]?: FormValidator<T[K]>;
};

// Type inference helpers
export type InferFormData<T extends z.ZodSchema> = z.infer<T>;
export type InferFormErrors<T extends Record<string, unknown>> = FieldErrors<T>;

// Form submission types
export interface FormSubmissionResult<T = unknown> {
  success: boolean;
  data?: T;
  errors?: FormError[];
  message?: string;
}

export interface AsyncFormSubmission<T extends Record<string, unknown>, R = unknown> {
  (data: T): Promise<FormSubmissionResult<R>>;
}

// Form step types for multi-step forms
export interface FormStep<T extends Record<string, unknown> = Record<string, unknown>> {
  id: string;
  title: string;
  description?: string;
  fields: readonly (keyof T)[];
  validation?: z.ZodSchema<Partial<T>>;
  optional?: boolean;
}

export interface MultiStepFormState<T extends Record<string, unknown> = Record<string, unknown>> {
  currentStep: number;
  steps: readonly FormStep<T>[];
  data: Partial<T>;
  completedSteps: readonly number[];
  isValid: boolean;
  canProceed: boolean;
  canGoBack: boolean;
}

export interface MultiStepFormMethods<T extends Record<string, unknown> = Record<string, unknown>> {
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  updateData: (data: Partial<T>) => void;
  reset: () => void;
  submit: () => Promise<void>;
}