import { ReactNode, HTMLAttributes, ButtonHTMLAttributes, FormHTMLAttributes } from 'react';

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  'data-testid'?: string;
}

// Layout component types
export interface LayoutProps extends BaseComponentProps {
  title?: string;
  description?: string;
}

// Navigation component types
export interface NavbarProps extends BaseComponentProps {
  isFixed?: boolean;
  variant?: 'default' | 'transparent';
}

export interface NavLinkProps extends BaseComponentProps {
  href: string;
  isActive?: boolean;
  external?: boolean;
}

// Button component types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, BaseComponentProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

// Form component types
export interface FormProps extends FormHTMLAttributes<HTMLFormElement>, BaseComponentProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
}

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

// Card component types
export interface CardProps extends HTMLAttributes<HTMLDivElement>, BaseComponentProps {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  header?: ReactNode;
  footer?: ReactNode;
}

// Modal component types
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

// Loading component types
export type LoadingSize = 'sm' | 'md' | 'lg' | 'xl';
export type LoadingColor = 'primary' | 'secondary' | 'white' | 'gray';

export interface LoadingSpinnerProps extends BaseComponentProps {
  size?: LoadingSize;
  color?: LoadingColor;
  message?: string;
  progress?: number;
}

export interface LoadingOverlayProps extends BaseComponentProps {
  isVisible: boolean;
  message?: string;
  progress?: number;
  backdrop?: boolean;
  size?: LoadingSize;
}

// Game component types
export interface QuestionProps extends BaseComponentProps {
  id: number;
  question: string;
  options: readonly string[];
  correctAnswer: number;
  explanation?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface QuestionCardProps extends BaseComponentProps {
  question: QuestionProps;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answerIndex: number) => void;
  timeRemaining?: number;
}

export interface TimerProps extends BaseComponentProps {
  duration: number;
  onTimeUp: () => void;
  isRunning?: boolean;
  showProgress?: boolean;
}

export interface ProgressBarProps extends BaseComponentProps {
  current: number;
  total: number;
  showPercentage?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

// Leaderboard component types
export interface PlayerData {
  readonly address: string;
  readonly username: string;
  readonly totalScore: number;
  readonly gamesPlayed: number;
  readonly rank: number;
  readonly accuracy?: number;
  readonly bestScore?: number;
}

export interface LeaderboardProps extends BaseComponentProps {
  players: readonly PlayerData[];
  currentPlayer?: string;
  isLoading?: boolean;
  error?: string;
  onRefresh?: () => void;
}

// Skeleton component types
export interface SkeletonProps extends BaseComponentProps {
  width?: string | number;
  height?: string | number;
  shape?: 'rectangle' | 'circle' | 'text';
  animate?: boolean;
}

// Error boundary types
export interface ErrorBoundaryProps extends BaseComponentProps {
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

// Toast/Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationProps extends BaseComponentProps {
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeProviderProps extends BaseComponentProps {
  defaultTheme?: Theme;
  storageKey?: string;
}

// Utility types for component variants
export type ComponentVariant<T extends string> = T;
export type ComponentSize<T extends string> = T;

// Generic component props with strict typing
export interface StrictComponentProps<T = HTMLElement> extends BaseComponentProps {
  as?: keyof JSX.IntrinsicElements;
  ref?: React.Ref<T>;
}

// Event handler types
export type ClickHandler = (event: React.MouseEvent<HTMLElement>) => void;
export type ChangeHandler<T = HTMLInputElement> = (event: React.ChangeEvent<T>) => void;
export type SubmitHandler = (event: React.FormEvent<HTMLFormElement>) => void;
export type KeyboardHandler = (event: React.KeyboardEvent<HTMLElement>) => void;

// Animation types
export interface AnimationProps {
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
  exit?: Record<string, unknown>;
  transition?: Record<string, unknown>;
}

// Responsive types
export type ResponsiveValue<T> = T | { sm?: T; md?: T; lg?: T; xl?: T };

// Component state types
export interface ComponentState {
  isLoading: boolean;
  error: string | null;
  data: unknown;
}

// Accessibility types
export interface AccessibilityProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-hidden'?: boolean;
  role?: string;
  tabIndex?: number;
}