/**
 * Notification Service
 *
 * Provides real-time notifications for game events including
 * toast notifications, sound alerts, and browser notifications.
 */

import type {
  ContractEvent,
  QuestionAddedEvent,
  AnswerSubmittedEvent,
  RewardDistributedEvent,
  ScoreUpdatedEvent,
} from '@/types/events';
import type { EventNotifier, LeaderboardEntry } from './EventHandlers';

// Notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

// Notification data
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  data?: Record<string, unknown>;
  read: boolean;
  dismissed: boolean;
}

// Notification preferences
export interface NotificationPreferences {
  enableToast: boolean;
  enableSound: boolean;
  enableBrowser: boolean;
  showNewQuestions: boolean;
  showAnswerResults: boolean;
  showRewards: boolean;
  showLeaderboardUpdates: boolean;
  soundVolume: number;
}

// Default preferences
const DEFAULT_PREFERENCES: NotificationPreferences = {
  enableToast: true,
  enableSound: false,
  enableBrowser: false,
  showNewQuestions: true,
  showAnswerResults: true,
  showRewards: true,
  showLeaderboardUpdates: true,
  soundVolume: 0.5,
};

// Notification listener callback
export type NotificationListener = (notification: Notification) => void;

/**
 * Notification Service implementation
 */
export class NotificationService implements EventNotifier {
  private notifications: Notification[] = [];
  private listeners: Set<NotificationListener> = new Set();
  private preferences: NotificationPreferences;
  private maxNotifications: number = 100;

  constructor(preferences?: Partial<NotificationPreferences>) {
    this.preferences = { ...DEFAULT_PREFERENCES, ...preferences };
    this.loadPreferences();
  }

  /**
   * Load preferences from localStorage
   */
  private loadPreferences(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('notification-preferences');
      if (stored) {
        this.preferences = { ...this.preferences, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn('[NotificationService] Failed to load preferences:', error);
    }
  }

  /**
   * Save preferences to localStorage
   */
  savePreferences(preferences: Partial<NotificationPreferences>): void {
    this.preferences = { ...this.preferences, ...preferences };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('notification-preferences', JSON.stringify(this.preferences));
      } catch (error) {
        console.warn('[NotificationService] Failed to save preferences:', error);
      }
    }
  }

  /**
   * Get current preferences
   */
  getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  /**
   * Add a notification listener
   */
  addListener(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Get all notifications
   */
  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  /**
   * Get unread notification count
   */
  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read && !n.dismissed).length;
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    this.notifications.forEach((n) => {
      n.read = true;
    });
  }

  /**
   * Dismiss a notification
   */
  dismiss(notificationId: string): void {
    const notification = this.notifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.dismissed = true;
    }
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.notifications = [];
  }

  /**
   * Create and dispatch a notification
   */
  private notify(
    type: NotificationType,
    title: string,
    message: string,
    data?: Record<string, unknown>
  ): void {
    const notification: Notification = {
      id: crypto.randomUUID(),
      type,
      title,
      message,
      timestamp: Date.now(),
      data,
      read: false,
      dismissed: false,
    };

    // Add to list
    this.notifications.unshift(notification);

    // Trim old notifications
    if (this.notifications.length > this.maxNotifications) {
      this.notifications = this.notifications.slice(0, this.maxNotifications);
    }

    // Notify listeners
    this.listeners.forEach((listener) => {
      try {
        listener(notification);
      } catch (error) {
        console.error('[NotificationService] Listener error:', error);
      }
    });

    // Show toast notification
    if (this.preferences.enableToast) {
      this.showToast(notification);
    }

    // Play sound
    if (this.preferences.enableSound) {
      this.playSound(type);
    }

    // Show browser notification
    if (this.preferences.enableBrowser) {
      this.showBrowserNotification(notification);
    }
  }

  /**
   * Show toast notification (to be integrated with UI library)
   */
  private showToast(notification: Notification): void {
    // This will be picked up by the UI component
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('zali-toast', {
          detail: notification,
        })
      );
    }
  }

  /**
   * Play notification sound
   */
  private playSound(type: NotificationType): void {
    if (typeof window === 'undefined') return;

    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;

      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Set frequency based on notification type
      const frequencies: Record<NotificationType, number> = {
        success: 880,
        info: 660,
        warning: 440,
        error: 330,
      };

      oscillator.frequency.value = frequencies[type];
      oscillator.type = 'sine';

      gainNode.gain.value = this.preferences.soundVolume * 0.1;
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.warn('[NotificationService] Failed to play sound:', error);
    }
  }

  /**
   * Show browser notification
   */
  private async showBrowserNotification(notification: Notification): Promise<void> {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    try {
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          tag: notification.id,
        });
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico',
            tag: notification.id,
          });
        }
      }
    } catch (error) {
      console.warn('[NotificationService] Failed to show browser notification:', error);
    }
  }

  /**
   * Request browser notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }

    return Notification.requestPermission();
  }

  // EventNotifier interface implementation

  /**
   * Notify about new question
   */
  notifyNewQuestion(event: QuestionAddedEvent): void {
    if (!this.preferences.showNewQuestions) return;

    this.notify(
      'info',
      'New Question Added',
      `Question #${event.args.questionId}: "${event.args.questionText.substring(0, 50)}${
        event.args.questionText.length > 50 ? '...' : ''
      }"`,
      {
        eventType: 'QuestionAdded',
        questionId: event.args.questionId.toString(),
        reward: event.args.reward.toString(),
      }
    );
  }

  /**
   * Notify about answer submission
   */
  notifyAnswer(event: AnswerSubmittedEvent): void {
    if (!this.preferences.showAnswerResults) return;

    const title = event.args.isCorrect ? 'Correct Answer!' : 'Wrong Answer';
    const type: NotificationType = event.args.isCorrect ? 'success' : 'warning';
    const message = event.args.isCorrect
      ? `${shortenAddress(event.args.user)} answered correctly!`
      : `${shortenAddress(event.args.user)} answered incorrectly`;

    this.notify(type, title, message, {
      eventType: 'AnswerSubmitted',
      user: event.args.user,
      questionId: event.args.questionId.toString(),
      isCorrect: event.args.isCorrect,
    });
  }

  /**
   * Notify about reward distribution
   */
  notifyReward(event: RewardDistributedEvent): void {
    if (!this.preferences.showRewards) return;

    const amount = formatUSDC(event.args.amount);
    this.notify(
      'success',
      'Reward Distributed',
      `${shortenAddress(event.args.user)} earned ${amount} USDC!`,
      {
        eventType: 'RewardDistributed',
        user: event.args.user,
        amount: event.args.amount.toString(),
      }
    );
  }

  /**
   * Notify about score update
   */
  notifyScoreUpdate(event: ScoreUpdatedEvent): void {
    // Score updates are typically shown through answer notifications
    // This can be used for special milestone notifications
    const newScore = Number(event.args.newScore);

    // Notify on milestone scores
    if (newScore === 10 || newScore === 25 || newScore === 50 || newScore === 100) {
      this.notify(
        'success',
        'Milestone Reached!',
        `${shortenAddress(event.args.user)} reached ${newScore} points!`,
        {
          eventType: 'ScoreUpdated',
          user: event.args.user,
          score: newScore,
        }
      );
    }
  }

  /**
   * Notify about leaderboard update
   */
  notifyLeaderboardUpdate(topPlayers: LeaderboardEntry[]): void {
    if (!this.preferences.showLeaderboardUpdates) return;

    if (topPlayers.length > 0) {
      const leader = topPlayers[0];
      this.notify(
        'info',
        'Leaderboard Updated',
        `${shortenAddress(leader.address)} leads with ${leader.score.toString()} points!`,
        {
          eventType: 'LeaderboardUpdate',
          topPlayer: leader.address,
          topScore: leader.score.toString(),
        }
      );
    }
  }
}

/**
 * Shorten Ethereum address for display
 */
function shortenAddress(address: string): string {
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Format USDC amount (6 decimals)
 */
function formatUSDC(amount: bigint): string {
  const value = Number(amount) / 1e6;
  return value.toFixed(2);
}

// Singleton instance
let notificationServiceInstance: NotificationService | null = null;

/**
 * Get or create the notification service instance
 */
export function getNotificationService(): NotificationService {
  if (!notificationServiceInstance) {
    notificationServiceInstance = new NotificationService();
  }
  return notificationServiceInstance;
}

/**
 * Reset the notification service instance (for testing)
 */
export function resetNotificationService(): void {
  notificationServiceInstance = null;
}
