/**
 * Farcaster Frame Configuration
 */

export const FRAME_CONFIG = {
  // Application URLs
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  frameUrl: process.env.NEXT_PUBLIC_FRAME_URL || 'http://localhost:3000/frame',

  // Frame metadata
  title: 'Zali Trivia',
  description: 'Answer trivia questions and earn USDC rewards on Base',
  version: 'vNext',

  // Image dimensions (Farcaster specification)
  image: {
    width: 1200,
    height: 630,
    aspectRatio: '1.91:1',
  },

  // Reward configuration
  rewards: {
    correctAnswer: '0.1', // USDC per correct answer
    currency: 'USDC',
    decimals: 6,
  },

  // Game configuration
  game: {
    questionsPerSession: 10,
    timePerQuestion: 30, // seconds
    maxOptions: 4,
  },

  // Analytics
  analytics: {
    enabled: process.env.NODE_ENV === 'production',
    trackViews: true,
    trackClicks: true,
    trackAnswers: true,
    trackShares: true,
  },

  // Farcaster Hub configuration
  hub: {
    url: process.env.FARCASTER_HUB_URL || 'https://hub.farcaster.xyz',
    validateSignatures: process.env.NODE_ENV === 'production',
  },

  // Rate limiting
  rateLimit: {
    answersPerDay: 50,
    viewsPerHour: 100,
  },

  // Share configuration
  share: {
    text: 'I just answered a trivia question on Zali and earned USDC! 🎮💰',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000/frame',
  },
};

// Button labels
export const BUTTON_LABELS = {
  startGame: 'Play Trivia',
  viewLeaderboard: 'Leaderboard',
  viewProfile: 'My Profile',
  submitAnswer: 'Submit',
  nextQuestion: 'Next Question',
  tryAgain: 'Try Again',
  share: 'Share',
  backHome: 'Back to Home',
  playAgain: 'Play Again',
};

// Frame routes
export const FRAME_ROUTES = {
  home: '/api/frame',
  game: '/api/frame?action=game',
  submit: '/api/frame/submit',
  leaderboard: '/api/frame?action=leaderboard',
  profile: '/api/frame?action=profile',
};

// Image routes
export const IMAGE_ROUTES = {
  home: '/api/frame/image/home',
  game: '/api/frame/image/game',
  correct: '/api/frame/image/correct',
  incorrect: '/api/frame/image/incorrect',
  leaderboard: '/api/frame/image/leaderboard',
  profile: '/api/frame/image/profile',
};
