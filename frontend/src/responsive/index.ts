/**
 * Responsive Components - Centralized exports
 *
 * This module provides comprehensive responsive components and hooks including:
 * - Media query hooks for breakpoint detection
 * - Container and layout components
 * - Form components with mobile optimization
 * - Card, button, and table components
 * - Mobile menu and navigation components
 * - Typography components
 */

// Hooks
export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsSmallMobile,
  useIsLargeMobile,
  useBreakpoint,
  useViewport,
  useOrientation,
} from '../hooks/useMediaQuery';
export type { Breakpoint, Orientation } from '../hooks/useMediaQuery';

// Container Components
export {
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveStack,
  MobileOnly,
  DesktopOnly,
  ResponsiveRender,
} from '../components/ResponsiveContainer';
export type {
  ResponsiveContainerProps,
  ResponsiveGridProps,
  ResponsiveStackProps,
  ResponsiveRenderProps,
} from '../components/ResponsiveContainer';

// Mobile Menu
export {
  MobileMenu,
  MobileMenuButton,
  MobileMenuItem,
  MobileBottomSheet,
} from '../components/MobileMenu';
export type {
  MobileMenuProps,
  MobileMenuButtonProps,
  MobileMenuItemProps,
  MobileBottomSheetProps,
} from '../components/MobileMenu';

// Typography
export {
  ResponsiveText,
  ResponsiveHeading,
  TruncatedText,
} from '../components/ResponsiveText';
export type {
  ResponsiveTextProps,
  ResponsiveHeadingProps,
  TruncatedTextProps,
} from '../components/ResponsiveText';

// Form Components
export {
  ResponsiveFormField,
  ResponsiveInput,
  ResponsiveTextarea,
  ResponsiveSelect,
  ResponsiveFormGroup,
  ResponsiveFormActions,
} from '../components/ResponsiveForm';
export type {
  ResponsiveFormFieldProps,
  ResponsiveInputProps,
  ResponsiveTextareaProps,
  ResponsiveSelectProps,
  ResponsiveFormGroupProps,
  ResponsiveFormActionsProps,
} from '../components/ResponsiveForm';

// Card Components
export {
  ResponsiveCard,
  ResponsiveCardHeader,
  ResponsiveCardBody,
  ResponsiveCardFooter,
  ResponsiveCardGrid,
  ResponsiveImageCard,
} from '../components/ResponsiveCard';
export type {
  ResponsiveCardProps,
  ResponsiveCardHeaderProps,
  ResponsiveCardBodyProps,
  ResponsiveCardFooterProps,
  ResponsiveCardGridProps,
  ResponsiveImageCardProps,
} from '../components/ResponsiveCard';

// Button Components
export {
  ResponsiveButton,
  ResponsiveIconButton,
  ResponsiveButtonGroup,
  ResponsiveFAB,
} from '../components/ResponsiveButton';
export type {
  ResponsiveButtonProps,
  ResponsiveIconButtonProps,
  ResponsiveButtonGroupProps,
  ResponsiveFABProps,
} from '../components/ResponsiveButton';

// Table Components
export {
  ResponsiveTable,
  ResponsiveTableHeader,
  ResponsiveTablePagination,
} from '../components/ResponsiveTable';
export type {
  ResponsiveTableProps,
  TableColumn,
  ResponsiveTableHeaderProps,
  ResponsiveTablePaginationProps,
} from '../components/ResponsiveTable';
