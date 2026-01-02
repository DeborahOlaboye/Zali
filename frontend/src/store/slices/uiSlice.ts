import { StateCreator } from 'zustand';

export type Theme = 'light' | 'dark' | 'system';
export type Notification = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
};

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

export interface UISlice {
  theme: Theme;
  notifications: Notification[];
  globalLoading: LoadingState;
  componentLoading: Record<string, LoadingState>;
  setTheme: (theme: Theme) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setGlobalLoading: (loading: LoadingState) => void;
  setComponentLoading: (component: string, loading: LoadingState) => void;
  clearComponentLoading: (component: string) => void;
  clearAllLoading: () => void;
}

export const createUISlice: StateCreator<
  UISlice,
  [['zustand/immer', never], ['zustand/devtools', never], ['zustand/persist', unknown]],
  [],
  UISlice
> = (set, get) => ({
  theme: 'system',
  notifications: [],
  globalLoading: { isLoading: false },
  componentLoading: {},

  setTheme: (theme) => {
    set({ theme }, false, 'ui/setTheme');
    // Update the theme class on the document element
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  },

  addNotification: (notification) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification = { ...notification, id };
    set(
      (state) => {
        state.notifications.push(newNotification);
      },
      false,
      'ui/addNotification'
    );

    // Auto-remove notification after duration
    if (notification.duration !== 0) {
      const duration = notification.duration || 5000; // Default 5 seconds
      setTimeout(() => {
        get().removeNotification(id);
      }, duration);
    }
  },

  removeNotification: (id) => {
    set(
      (state) => {
        state.notifications = state.notifications.filter((n) => n.id !== id);
      },
      false,
      'ui/removeNotification'
    );
  },

  clearNotifications: () => {
    set({ notifications: [] }, false, 'ui/clearNotifications');
  },

  setGlobalLoading: (loading) => {
    set({ globalLoading: loading }, false, 'ui/setGlobalLoading');
  },

  setComponentLoading: (component, loading) => {
    set(
      (state) => {
        state.componentLoading[component] = loading;
      },
      false,
      'ui/setComponentLoading'
    );
  },

  clearComponentLoading: (component) => {
    set(
      (state) => {
        delete state.componentLoading[component];
      },
      false,
      'ui/clearComponentLoading'
    );
  },

  clearAllLoading: () => {
    set(
      {
        globalLoading: { isLoading: false },
        componentLoading: {},
      },
      false,
      'ui/clearAllLoading'
    );
  },
});