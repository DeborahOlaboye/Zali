/**
 * Farcaster Frame types
 */

export interface FrameRequest {
  untrustedData: {
    fid: number;
    url: string;
    messageHash: string;
    timestamp: number;
    network: number;
    buttonIndex: number;
    inputText?: string;
    state?: string;
    castId: {
      fid: number;
      hash: string;
    };
  };
  trustedData: {
    messageBytes: string;
  };
}

export interface FrameResponse {
  version: string;
  image: string;
  buttons?: FrameButton[];
  input?: FrameInput;
  post_url?: string;
  state?: string;
}

export interface FrameButton {
  label: string;
  action?: 'post' | 'post_redirect' | 'link' | 'mint';
  target?: string;
}

export interface FrameInput {
  text: string;
}

export interface FrameMetadata {
  'fc:frame': string;
  'fc:frame:image': string;
  'fc:frame:post_url'?: string;
  'fc:frame:button:1'?: string;
  'fc:frame:button:2'?: string;
  'fc:frame:button:3'?: string;
  'fc:frame:button:4'?: string;
  'fc:frame:button:1:action'?: string;
  'fc:frame:button:2:action'?: string;
  'fc:frame:button:3:action'?: string;
  'fc:frame:button:4:action'?: string;
  'fc:frame:button:1:target'?: string;
  'fc:frame:button:2:target'?: string;
  'fc:frame:button:3:target'?: string;
  'fc:frame:button:4:target'?: string;
  'fc:frame:input:text'?: string;
  'fc:frame:state'?: string;
}

export interface GameState {
  questionId: number;
  questionText: string;
  options: string[];
  correctOption: number;
  reward: string;
  answered: boolean;
  userAnswer?: number;
  isCorrect?: boolean;
}

export interface PlayerFrameData {
  fid: number;
  address?: string;
  totalScore: number;
  correctAnswers: number;
  totalAnswers: number;
  totalRewards: string;
  rank: number;
  currentStreak: number;
}

export interface LeaderboardFrameData {
  players: Array<{
    rank: number;
    fid?: number;
    address: string;
    score: number;
    rewards: string;
  }>;
  totalPlayers: number;
  lastUpdated: string;
}

export interface FrameAnalytics {
  eventType: 'view' | 'click' | 'submit' | 'share';
  fid?: number;
  castId?: string;
  buttonIndex?: number;
  timestamp: number;
  metadata?: Record<string, any>;
}
