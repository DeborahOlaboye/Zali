import {
  ApiSuccessResponse,
  ApiErrorResponse,
  ApiResponse,
  ApiException,
} from './api';
import { PlayerInfo, GameSession, LeaderboardEntry } from './contract';
import { User, UserProfile, UserStatistics } from './user';
import { Reward, GameReward, RewardBalance } from './reward';
import { ErrorCode } from './errors';

export function isApiSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.success === true;
}

export function isApiErrorResponse(
  response: ApiResponse<any>
): response is ApiErrorResponse {
  return response.success === false;
}

export function isApiException(error: any): error is ApiException {
  return error instanceof ApiException;
}

export function isPlayerInfo(data: any): data is PlayerInfo {
  return (
    typeof data === 'object' &&
    typeof data.username === 'string' &&
    typeof data.totalScore === 'bigint' &&
    typeof data.gamesPlayed === 'bigint' &&
    typeof data.rank === 'bigint'
  );
}

export function isGameSession(data: any): data is GameSession {
  return (
    typeof data === 'object' &&
    typeof data.sessionId === 'bigint' &&
    typeof data.playerAddress === 'string' &&
    typeof data.score === 'bigint' &&
    typeof data.isCompleted === 'boolean'
  );
}

export function isLeaderboardEntry(data: any): data is LeaderboardEntry {
  return (
    typeof data === 'object' &&
    typeof data.address === 'string' &&
    typeof data.username === 'string' &&
    typeof data.rank === 'number' &&
    typeof data.totalScore === 'number'
  );
}

export function isUser(data: any): data is User {
  return (
    typeof data === 'object' &&
    typeof data.address === 'string' &&
    typeof data.username === 'string' &&
    typeof data.isActive === 'boolean'
  );
}

export function isUserProfile(data: any): data is UserProfile {
  return (
    isUser(data) &&
    typeof data.totalScore === 'number' &&
    typeof data.gamesPlayed === 'number' &&
    Array.isArray(data.badges) &&
    Array.isArray(data.achievements)
  );
}

export function isUserStatistics(data: any): data is UserStatistics {
  return (
    typeof data === 'object' &&
    typeof data.address === 'string' &&
    typeof data.totalScore === 'number' &&
    typeof data.accuracy === 'number' &&
    typeof data.rank === 'number'
  );
}

export function isReward(data: any): data is Reward {
  return (
    typeof data === 'object' &&
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    typeof data.pointsRequired === 'number' &&
    typeof data.claimable === 'boolean'
  );
}

export function isGameReward(data: any): data is GameReward {
  return (
    typeof data === 'object' &&
    typeof data.id === 'string' &&
    typeof data.gameId === 'string' &&
    typeof data.totalReward === 'number' &&
    typeof data.timestamp === 'string'
  );
}

export function isRewardBalance(data: any): data is RewardBalance {
  return (
    typeof data === 'object' &&
    typeof data.totalEarned === 'number' &&
    typeof data.totalClaimed === 'number' &&
    typeof data.pendingRewards === 'number' &&
    typeof data.availableToClaim === 'number'
  );
}

export function isErrorCode(code: any): code is ErrorCode {
  return Object.values(ErrorCode).includes(code);
}

export function isValidBigInt(value: any): value is bigint {
  return typeof value === 'bigint';
}

export function isValidAddress(address: any): boolean {
  if (typeof address !== 'string') return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function isValidUsername(username: any): boolean {
  if (typeof username !== 'string') return false;
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

export function isValidEmail(email: any): boolean {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
