


export enum Color {
  GREEN = 'GREEN',
  RED = 'RED',
  VIOLET = 'VIOLET'
}

export type GameMode = '30s' | '1m' | '3m' | '5m';
export type Tab = 'HOME' | 'ACTIVITY' | 'PROMOTION' | 'WALLET' | 'ACCOUNT';

export interface GameResult {
  periodId: string;
  number: number;
  colors: Color[];
  price: number;
  mode: GameMode;
}

export type BetSelection = Color | number | 'BIG' | 'SMALL';

export interface Bet {
  id: string;
  periodId: string;
  selection: BetSelection;
  amount: number;
  contractMoney: number;
  status: 'PENDING' | 'WIN' | 'LOSS';
  winAmount: number;
  mode: GameMode;
  resultNumber?: number; // Stores the winning number for history display
}

export interface UserState {
  balance: number;
  commissionBalance: number; // New: For referral earnings
  referralCode: string;      // New: Unique code
  isLoggedIn: boolean;
  phoneNumber?: string;
  isAdmin: boolean;
  vipLevel: number;
  experience: number;          // New: Total bet amount for VIP progress
  claimedLevelRewards: number[]; // New: List of VIP levels where one-time reward is claimed
  monthlyRewardLastClaimed: number; // New: Timestamp of last monthly claim
  uid: string;
  dailyDepositAmount: number; // New: Track daily deposits
  claimedDailyRewards: number[]; // New: Track claimed task IDs (indexes)
  hasDeposited: boolean; // New: Restriction for withdrawal
}

export interface PredictionResponse {
  prediction: string;
  analysis: string;
  confidence: number;
}

export interface UpiId {
  id: string;
  address: string;
  label: string; // e.g., "Google Pay", "PhonePe"
  isActive: boolean;
}

export interface GiftCode {
  code: string;
  amount: number;
  isUsed: boolean; // Simple implementation: One-time use global or per user. We will remove it once used for simplicity.
}

export interface Feedback {
  id: string;
  userId: string;
  message: string;
  image?: string; // Base64 image string
  date: number;
  status: 'PENDING' | 'RESOLVED';
  reply?: string; // Admin reply message
  replyDate?: number;
}

export interface AdminState {
  riggedResults: Record<GameMode, number | 'BIG' | 'SMALL' | null>;
  upiIds: UpiId[];
  allowedAdmins: string[]; // List of authorized admin phone numbers
  giftCodes: GiftCode[];
}

export interface WithdrawalRequest {
  id: string;
  userId: string; // Phone number as ID for now
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: number;
  bankDetails: string;
}

export interface DepositRequest {
  id: string;
  userId: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: number;
  utr: string; // Transaction Reference Number
  screenshot?: string; // Base64 string of the image
}

// For Admin Panel
export interface UserProfile {
  phone: string;
  balance: number;
  status: 'ACTIVE' | 'BANNED';
  joinedDate: number;
}