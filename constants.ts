
import { Color, GameMode } from './types';

export const BETTING_CLOSE_SECONDS = 5;

export const MODE_CONFIG: Record<GameMode, { duration: number, label: string }> = {
  '30s': { duration: 30, label: 'WinGo 30s' },
  '1m': { duration: 60, label: 'WinGo 1Min' },
  '3m': { duration: 180, label: 'WinGo 3Min' },
  '5m': { duration: 300, label: 'WinGo 5Min' },
};

// Fees and Multipliers
export const SERVICE_FEE_PERCENT = 0.02; // 2%
export const PAYOUT_NUMBER = 9;
export const PAYOUT_COLOR = 2; // Usually 1:2
export const PAYOUT_VIOLET = 4.5;
export const PAYOUT_BIG_SMALL = 2; 

export const NUMBER_TO_COLOR_MAP: Record<number, Color[]> = {
  0: [Color.RED, Color.VIOLET],
  1: [Color.GREEN],
  2: [Color.RED],
  3: [Color.GREEN],
  4: [Color.RED],
  5: [Color.GREEN, Color.VIOLET],
  6: [Color.RED],
  7: [Color.GREEN],
  8: [Color.RED],
  9: [Color.GREEN],
};

export const INITIAL_BALANCE = 0;

export const VIP_TIERS = [
  { level: 0, exp: 0, levelReward: 0, monthlyReward: 0, rebate: 0 },
  { level: 1, exp: 3000, levelReward: 30, monthlyReward: 15, rebate: 0.05 }, // Start 30
  { level: 2, exp: 10000, levelReward: 80, monthlyReward: 40, rebate: 0.10 }, // +50
  { level: 3, exp: 50000, levelReward: 130, monthlyReward: 65, rebate: 0.15 }, // +50
  { level: 4, exp: 200000, levelReward: 180, monthlyReward: 90, rebate: 0.20 }, // +50
  { level: 5, exp: 1000000, levelReward: 230, monthlyReward: 115, rebate: 0.25 }, // +50
  { level: 6, exp: 5000000, levelReward: 280, monthlyReward: 140, rebate: 0.30 }, // +50
  { level: 7, exp: 10000000, levelReward: 330, monthlyReward: 165, rebate: 0.35 }, // +50
];
