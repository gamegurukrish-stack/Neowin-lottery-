// MLM (Multi-Level Marketing) Service for Referral System

// Commission Percentages for Levels 1 to 6
export const REFERRAL_RATES = [0.01, 0.005, 0.002, 0.001, 0.0005, 0.0001];

// Mock Database of users to simulate the tree
// Key: User Phone, Value: Referrer Phone
const userTree: Record<string, string | null> = {};

export const generateReferralCode = (phone: string): string => {
  return `NEO${phone.slice(-4)}${Math.floor(Math.random() * 99)}`;
};

export const registerUserInMLM = (phone: string, referralCode?: string) => {
    // If referral code provided, find the owner and link them
    // For simulation, we'll just mock it.
    // In a real app, we'd lookup the code owner.
    if (referralCode) {
        console.log(`[MLM] User ${phone} registered under code ${referralCode}`);
    }
};

// Returns the calculated commission for a specific level based on bet amount
export const calculateCommission = (amount: number, levelIdx: number): number => {
    if (levelIdx < 0 || levelIdx >= REFERRAL_RATES.length) return 0;
    return amount * REFERRAL_RATES[levelIdx];
};

/**
 * Simulates a downline user placing a winning bet.
 * Returns the commission earned by the current user (the upline).
 * 
 * In a real backend, this would recursively traverse up 6 levels updating wallets.
 * Here, we simulate "Level X" downline winning, and calculating what YOU get.
 */
export const simulateDownlineWin = (currentUserPhone: string): { level: number, commission: number, sourceUser: string, betAmount: number } => {
    // Randomly pick which level the winner is at (1-6)
    // Weighted towards Level 1 (more frequent)
    const level = Math.floor(Math.random() * 6) + 1; // 1 to 6
    
    // Random bet amount
    const betAmounts = [100, 200, 500, 1000, 5000];
    const betAmount = betAmounts[Math.floor(Math.random() * betAmounts.length)];
    
    // Calculate what the current user gets
    const commission = calculateCommission(betAmount, level - 1);
    
    return {
        level,
        commission,
        sourceUser: `User-${Math.floor(Math.random() * 10000)}`,
        betAmount
    };
};