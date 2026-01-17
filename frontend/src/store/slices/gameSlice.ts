import { StateCreator } from 'zustand';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameSession {
  id: string;
  startTime: string;
  endTime?: string;
  score: number;
  status: 'active' | 'completed' | 'abandoned';
  questions: Question[];
  currentQuestionIndex: number;
}

export interface PlayerStats {
  correctAnswers: number;
  wrongAnswers: number;
  totalQuestions: number;
  score: number;
  streak: number;
  highestStreak: number;
  categories: Record<string, { correct: number; total: number }>;
}

export interface GameState {
  currentQuestion: Question | null;
  gameSession: GameSession | null;
  playerStats: PlayerStats;
  isGameActive: boolean;
  isLoading: boolean;
  error: string | null;
  setCurrentQuestion: (question: Question | null) => void;
  startGame: () => void;
  endGame: () => void;
  submitAnswer: (answer: string) => Promise<boolean>;
  loadGameSession: (sessionId: string) => Promise<void>;
  updatePlayerStats: (stats: Partial<PlayerStats>) => void;
  resetGame: () => void;
}

export const createGameSlice: StateCreator<
  GameState,
  [['zustand/immer', never], ['zustand/devtools', never], ['zustand/persist', unknown]],
  [],
  GameState
> = (set, get) => ({
  currentQuestion: null,
  gameSession: null,
  playerStats: {
    correctAnswers: 0,
    wrongAnswers: 0,
    totalQuestions: 0,
    score: 0,
    streak: 0,
    highestStreak: 0,
    categories: {},
  },
  isGameActive: false,
  isLoading: false,
  error: null,

  setCurrentQuestion: (question) => 
    set({ currentQuestion: question }, false, 'game/setCurrentQuestion'),

  startGame: () => {
    set(
      {
        isGameActive: true,
        playerStats: {
          correctAnswers: 0,
          wrongAnswers: 0,
          totalQuestions: 0,
          score: 0,
          streak: 0,
          highestStreak: 0,
          categories: {},
        },
        error: null,
      },
      false,
      'game/startGame'
    );
  },

  endGame: () => 
    set({ isGameActive: false }, false, 'game/endGame'),

  submitAnswer: async (answer) => {
    const { currentQuestion, playerStats } = get();
    if (!currentQuestion) return false;

    const isCorrect = answer === currentQuestion.correctAnswer;
    const newStreak = isCorrect ? playerStats.streak + 1 : 0;
    const scoreIncrement = isCorrect ? 10 * (1 + Math.floor(newStreak / 3)) : 0;

    set(
      (state) => {
        if (!state.playerStats) return;
        
        state.playerStats.totalQuestions += 1;
        state.playerStats.streak = newStreak;
        
        if (isCorrect) {
          state.playerStats.correctAnswers += 1;
          state.playerStats.score += scoreIncrement;
          if (newStreak > state.playerStats.highestStreak) {
            state.playerStats.highestStreak = newStreak;
          }
        } else {
          state.playerStats.wrongAnswers += 1;
        }

        // Update category stats
        const category = currentQuestion.category;
        if (category) {
          if (!state.playerStats.categories[category]) {
            state.playerStats.categories[category] = { correct: 0, total: 0 };
          }
          state.playerStats.categories[category].total += 1;
          if (isCorrect) {
            state.playerStats.categories[category].correct += 1;
          }
        }
      },
      false,
      'game/submitAnswer'
    );

    // Check for achievements after answer
    (get() as any).checkAchievements();

    return isCorrect;
  },

  loadGameSession: async (sessionId) => {
    set({ isLoading: true, error: null }, false, 'game/loadGameSession/pending');
    try {
      // TODO: Implement actual session loading
      // const session = await api.getGameSession(sessionId);
      // set({ gameSession: session }, false, 'game/loadGameSession/fulfilled');
    } catch (error) {
      set(
        { error: 'Failed to load game session' },
        false,
        'game/loadGameSession/rejected'
      );
      throw error;
    } finally {
      set({ isLoading: false }, false, 'game/loadGameSession/finally');
    }
  },

  updatePlayerStats: (stats) =>
    set(
      (state) => {
        if (state.playerStats) {
          Object.assign(state.playerStats, stats);
        }
      },
      false,
      'game/updatePlayerStats'
    ),

  resetGame: () =>
    set(
      {
        currentQuestion: null,
        gameSession: null,
        playerStats: {
          correctAnswers: 0,
          wrongAnswers: 0,
          totalQuestions: 0,
          score: 0,
          streak: 0,
          highestStreak: 0,
          categories: {},
        },
        isGameActive: false,
        error: null,
      },
      false,
      'game/resetGame'
    ),
});