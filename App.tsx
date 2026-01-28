import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import GameTimer from './components/GameTimer';
import BettingBoard from './components/BettingBoard';
import ResultToast from './components/ResultToast';
import PredictionBot from './components/PredictionBot';
import GameModeSelector from './components/GameModeSelector';
import AuthForm from './components/AuthForm';
import AdminDashboard from './components/AdminDashboard';
import WalletModal from './components/WalletModal';
import PromotionPanel from './components/PromotionPanel';
import BottomNav from './components/BottomNav';
import Account from './components/Account';
import BonusModal from './components/BonusModal';
import GiftRedeemModal from './components/GiftRedeemModal';
import DailyTaskModal from './components/DailyTaskModal';
import FeedbackModal from './components/FeedbackModal';
import GameTabs from './components/GameTabs';
import VipPanel from './components/VipPanel';

import { generatePeriodId, generateRandomResult, calculateWinnings } from './services/gameLogic';
import { playWin, playLoss, playSuccess } from './services/soundService';
import { generateReferralCode } from './services/mlmService';

import { 
  UserState, GameResult, Bet, BetSelection, GameMode, Tab, 
  AdminState, WithdrawalRequest, DepositRequest, Feedback 
} from './types';
import { MODE_CONFIG, BETTING_CLOSE_SECONDS, VIP_TIERS } from './constants';

const App: React.FC = () => {
  // --- State ---
  const [userState, setUserState] = useState<UserState>({
    balance: 0,
    commissionBalance: 0,
    referralCode: '',
    isLoggedIn: false,
    isAdmin: false,
    vipLevel: 0,
    experience: 0,
    claimedLevelRewards: [],
    monthlyRewardLastClaimed: 0,
    uid: '',
    dailyDepositAmount: 0,
    claimedDailyRewards: [],
    hasDeposited: false,
    phoneNumber: ''
  });

  const [activeTab, setActiveTab] = useState<Tab>('HOME');
  const [currentMode, setCurrentMode] = useState<GameMode>('30s');
  
  // Game State
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [periodId, setPeriodId] = useState<string>('');
  const [history, setHistory] = useState<Record<GameMode, GameResult[]>>({
    '30s': [], '1m': [], '3m': [], '5m': []
  });
  const [bets, setBets] = useState<Bet[]>([]);
  const [lastResultToast, setLastResultToast] = useState<{ winAmount: number, selection: BetSelection } | null>(null);

  // Modals
  const [walletTab, setWalletTab] = useState<'recharge' | 'withdraw' | null>(null); // Triggers WalletModal
  const [showAdmin, setShowAdmin] = useState(false);
  const [showPromotion, setShowPromotion] = useState(false);
  const [showGiftRedeem, setShowGiftRedeem] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showDailyTask, setShowDailyTask] = useState(false);
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [showVipPanel, setShowVipPanel] = useState(false);
  
  // Ref to trigger prediction bot externally if needed
  const predictionBotRef = useRef<{ open: () => void } | null>(null);

  // Admin Data
  const [adminState, setAdminState] = useState<AdminState>({
    riggedResults: { '30s': null, '1m': null, '3m': null, '5m': null },
    upiIds: [],
    allowedAdmins: ['8477088145'], // Default admin
    giftCodes: []
  });
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  // --- Game Loop ---
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    const duration = MODE_CONFIG[currentMode].duration;
    const totalSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const remaining = duration - (totalSeconds % duration);
    return remaining;
  }, [currentMode]);

  const handleTimerTick = useCallback(() => {
    const remaining = calculateTimeLeft();
    setTimeLeft(remaining);
    const pid = generatePeriodId(Date.now(), currentMode);
    setPeriodId(pid);
  }, [currentMode, calculateTimeLeft]);

  // Handle period transition
  useEffect(() => {
    timerRef.current = setInterval(() => {
        handleTimerTick();
    }, 1000);

    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [handleTimerTick]);

  // Check for game resolution
  useEffect(() => {
    if (timeLeft === 1) {
        setTimeout(() => {
            resolveGame(periodId);
        }, 1000);
    }
  }, [timeLeft, periodId]);

  const resolveGame = (endingPeriodId: string) => {
      // 1. Generate Result
      const result = generateRandomResult(endingPeriodId, currentMode, adminState.riggedResults[currentMode]);
      
      // 2. Update History
      setHistory(prev => {
          const newModeHistory = [result, ...prev[currentMode]].slice(0, 50);
          return { ...prev, [currentMode]: newModeHistory };
      });

      // 3. Process Bets
      const pendingBets = bets.filter(b => b.periodId === endingPeriodId && b.mode === currentMode && b.status === 'PENDING');
      
      let totalWin = 0;
      const processedBets = pendingBets.map(bet => {
          const winAmount = calculateWinnings(bet.selection, result.number, bet.amount);
          if (winAmount > 0) {
              totalWin += winAmount;
              // SAVE RESULT NUMBER TO BET
              return { ...bet, status: 'WIN' as const, winAmount, resultNumber: result.number };
          }
          // SAVE RESULT NUMBER TO BET
          return { ...bet, status: 'LOSS' as const, winAmount: 0, resultNumber: result.number };
      });

      // Update Bets State (replace pending with processed)
      setBets(prev => prev.map(b => {
          const processed = processedBets.find(pb => pb.id === b.id);
          return processed || b;
      }));

      // 4. Update Balance & Toast
      if (totalWin > 0) {
          setUserState(prev => ({ ...prev, balance: prev.balance + totalWin }));
          playWin();
          setLastResultToast({ winAmount: totalWin, selection: processedBets.find(b => b.winAmount > 0)?.selection || 'BIG' });
      } else if (pendingBets.length > 0) {
          playLoss();
          setLastResultToast({ winAmount: 0, selection: pendingBets[0].selection });
      }

      // 5. Reset Rigged Result
      if (adminState.riggedResults[currentMode]) {
          setAdminState(prev => ({
              ...prev,
              riggedResults: { ...prev.riggedResults, [currentMode]: null }
          }));
      }
  };

  // --- Handlers ---

  const handleLogin = (identifier: string, referralCode?: string) => {
      const isMasterAdmin = identifier === '8477088145';
      const isAdmin = isMasterAdmin || adminState.allowedAdmins.includes(identifier);
      
      setUserState({
          balance: 0,
          commissionBalance: 0,
          referralCode: generateReferralCode(identifier),
          isLoggedIn: true,
          phoneNumber: identifier,
          isAdmin,
          vipLevel: 0,
          experience: 0,
          claimedLevelRewards: [],
          monthlyRewardLastClaimed: 0,
          uid: Math.floor(100000 + Math.random() * 900000).toString(),
          dailyDepositAmount: 0,
          claimedDailyRewards: [],
          hasDeposited: false
      });
      setShowBonusModal(true);
  };

  const handleLogout = () => {
      setUserState(prev => ({ ...prev, isLoggedIn: false }));
      setActiveTab('HOME');
  };

  const handlePlaceBet = (selection: BetSelection, amount: number) => {
      if (amount > userState.balance) return;

      const newBet: Bet = {
          id: Date.now().toString(),
          periodId: periodId,
          selection: selection,
          amount,
          contractMoney: amount * 0.98,
          status: 'PENDING',
          winAmount: 0,
          mode: currentMode
      };

      setBets(prev => [newBet, ...prev]);
      
      // Update State: Deduct balance AND Add Experience
      setUserState(prev => {
          const newExp = prev.experience + amount;
          // Calculate new VIP Level
          let newLevel = prev.vipLevel;
          // Find the highest tier reached
          for (let i = VIP_TIERS.length - 1; i >= 0; i--) {
              if (newExp >= VIP_TIERS[i].exp) {
                  newLevel = Math.max(newLevel, VIP_TIERS[i].level);
                  break;
              }
          }
          
          return { 
              ...prev, 
              balance: prev.balance - amount,
              experience: newExp,
              vipLevel: newLevel
          };
      });
      playSuccess();
  };

  // --- VIP Handlers ---
  const handleClaimLevelReward = (level: number, amount: number) => {
      setUserState(prev => ({
          ...prev,
          balance: prev.balance + amount,
          claimedLevelRewards: [...prev.claimedLevelRewards, level]
      }));
  };

  const handleClaimMonthlyReward = (amount: number) => {
      setUserState(prev => ({
          ...prev,
          balance: prev.balance + amount,
          monthlyRewardLastClaimed: Date.now()
      }));
  };

  // --- Admin Handlers ---
  const handleAddFunds = (amount: number) => {
      setUserState(prev => ({ ...prev, balance: prev.balance + amount }));
      playSuccess();
  };

  const handleProcessWithdrawal = (id: string, approved: boolean) => {
      setWithdrawalRequests(prev => {
          const req = prev.find(r => r.id === id);
          if (req && !approved) {
              // Refund if rejected
              setUserState(u => u.phoneNumber === req.userId ? { ...u, balance: u.balance + req.amount } : u);
          }
          return prev.map(r => r.id === id ? { ...r, status: approved ? 'APPROVED' : 'REJECTED' } : r);
      });
  };

  const handleProcessDeposit = (id: string, approved: boolean) => {
       setDepositRequests(prev => prev.map(r => {
           if (r.id === id) {
               if (approved && r.status === 'PENDING') {
                    if (userState.phoneNumber === r.userId) {
                        setUserState(u => ({ 
                            ...u, 
                            balance: u.balance + r.amount,
                            dailyDepositAmount: u.dailyDepositAmount + r.amount,
                            hasDeposited: true
                        }));
                        playSuccess();
                    }
               }
               return { ...r, status: approved ? 'APPROVED' : 'REJECTED' };
           }
           return r;
       }));
  };

  const handleRedeemGift = async (code: string) => {
      const gift = adminState.giftCodes.find(g => g.code === code && !g.isUsed);
      if (gift) {
          setUserState(prev => ({ ...prev, balance: prev.balance + gift.amount }));
          // Mark used
          setAdminState(prev => ({
              ...prev,
              giftCodes: prev.giftCodes.map(g => g.code === code ? { ...g, isUsed: true } : g)
          }));
          return { success: true, amount: gift.amount };
      }
      return { success: false, message: 'Invalid or Used Code' };
  };

  // --- Main Render ---

  if (!userState.isLoggedIn) {
      return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-dark-bg font-sans text-white pb-16">
        <Header 
            userState={userState} 
            onRefresh={() => {}} 
            onOpenAdmin={() => setShowAdmin(true)}
            onOpenWallet={(type) => setWalletTab(type)}
            onOpenPromotion={() => setShowPromotion(true)}
            showBalance={activeTab === 'HOME'}
        />
        
        <div className="relative">
            {activeTab === 'HOME' && (
                <>
                    <GameModeSelector currentMode={currentMode} onSelectMode={setCurrentMode} />
                    <GameTimer timeLeft={timeLeft} periodId={periodId} />
                    <BettingBoard 
                        disabled={timeLeft <= BETTING_CLOSE_SECONDS} 
                        balance={userState.balance}
                        onPlaceBet={handlePlaceBet} 
                    />
                    
                    {/* Replaced direct HistoryTable with GameTabs */}
                    <GameTabs 
                        gameHistory={history[currentMode]}
                        userBets={bets.filter(b => b.mode === currentMode)}
                        onOpenPrediction={() => predictionBotRef.current?.open()}
                    />
                    
                    <PredictionBot 
                        history={history[currentMode]} 
                        // @ts-ignore: Adding a simple ref handler to PredictionBot to allow external open
                        ref={predictionBotRef}
                    />
                </>
            )}

            {activeTab === 'ACTIVITY' && (
               <div className="p-4 flex flex-col gap-4">
                   <button onClick={() => setShowDailyTask(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl font-bold text-xl shadow-lg">
                        Daily Tasks & Rewards
                   </button>
                   <button onClick={() => setShowBonusModal(true)} className="bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-xl font-bold text-xl shadow-lg">
                        Welcome Bonus
                   </button>
               </div>
            )}

            {activeTab === 'PROMOTION' && (
                <div className="p-4 text-center">
                    <button onClick={() => setShowPromotion(true)} className="bg-primary text-black px-6 py-3 rounded-lg font-bold">Open Promotion Panel</button>
                </div>
            )}

            {activeTab === 'ACCOUNT' && (
                <Account 
                    userState={userState} 
                    onLogout={handleLogout}
                    onOpenGiftRedeem={() => setShowGiftRedeem(true)}
                    onOpenAdmin={() => setShowAdmin(true)}
                    onOpenFeedback={() => setShowFeedback(true)}
                    onOpenWallet={(tab) => setWalletTab(tab)}
                    onOpenVip={() => setShowVipPanel(true)}
                />
            )}
        </div>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Modals & Overlays */}
        
        {lastResultToast && (
            <ResultToast 
                winAmount={lastResultToast.winAmount} 
                betSelection={lastResultToast.selection}
                onClose={() => setLastResultToast(null)}
            />
        )}

        <WalletModal 
            isOpen={walletTab !== null} 
            initialTab={walletTab || 'recharge'} 
            currentBalance={userState.balance}
            adminUpiIds={adminState.upiIds}
            onClose={() => setWalletTab(null)}
            hasDeposited={userState.hasDeposited}
            onUpdateBalance={(amount, type) => {}}
            onRequestDeposit={(amount, utr, screenshot) => {
                const req: DepositRequest = {
                    id: Date.now().toString(),
                    userId: userState.phoneNumber || '',
                    amount,
                    status: 'PENDING',
                    date: Date.now(),
                    utr,
                    screenshot
                };
                setDepositRequests(prev => [req, ...prev]);
            }}
            onRequestWithdrawal={(amount, details) => {
                const req: WithdrawalRequest = {
                    id: Date.now().toString(),
                    userId: userState.phoneNumber || '',
                    amount,
                    status: 'PENDING',
                    date: Date.now(),
                    bankDetails: details
                };
                setWithdrawalRequests(prev => [req, ...prev]);
                setUserState(prev => ({ ...prev, balance: prev.balance - amount }));
            }}
        />

        <AdminDashboard 
            isOpen={showAdmin} 
            onClose={() => setShowAdmin(false)}
            adminState={adminState}
            setRiggedResult={(mode, val) => setAdminState(p => ({ ...p, riggedResults: { ...p.riggedResults, [mode]: val } }))}
            onAddFunds={handleAddFunds}
            withdrawalRequests={withdrawalRequests}
            onProcessWithdrawal={handleProcessWithdrawal}
            depositRequests={depositRequests}
            onProcessDeposit={handleProcessDeposit}
            onManageUpi={(action, data) => {
                if (action === 'add') {
                    setAdminState(p => ({ ...p, upiIds: [...p.upiIds, { id: Date.now().toString(), ...data, isActive: true }] }));
                } else {
                    setAdminState(p => ({ ...p, upiIds: p.upiIds.filter(u => u.id !== data.id) }));
                }
            }}
            onManageAdminAccess={(action, phone) => {
                if (action === 'add') setAdminState(p => ({ ...p, allowedAdmins: [...p.allowedAdmins, phone] }));
                else setAdminState(p => ({ ...p, allowedAdmins: p.allowedAdmins.filter(a => a !== phone) }));
            }}
            onCreateGiftCode={(code, amount) => {
                setAdminState(p => ({ ...p, giftCodes: [...p.giftCodes, { code, amount, isUsed: false }] }));
            }}
            onDeleteGiftCode={(code) => {
                setAdminState(p => ({ ...p, giftCodes: p.giftCodes.filter(g => g.code !== code) }));
            }}
            feedbacks={feedbacks}
            onResolveFeedback={(id, reply) => setFeedbacks(prev => prev.map(f => f.id === id ? { 
                ...f, 
                status: 'RESOLVED',
                reply: reply,
                replyDate: Date.now()
            } : f))}
        />

        <PromotionPanel 
            isOpen={showPromotion} 
            onClose={() => setShowPromotion(false)}
            userState={userState}
            onClaimCommission={(amt) => {
                setUserState(prev => ({ ...prev, balance: prev.balance + amt, commissionBalance: 0 }));
            }}
            onSimulateCommission={(amt) => {
                setUserState(prev => ({ ...prev, commissionBalance: prev.commissionBalance + amt }));
            }}
        />

        <GiftRedeemModal 
            isOpen={showGiftRedeem} 
            onClose={() => setShowGiftRedeem(false)} 
            onRedeem={handleRedeemGift}
        />

        <DailyTaskModal 
            isOpen={showDailyTask}
            onClose={() => setShowDailyTask(false)}
            currentDeposit={userState.dailyDepositAmount}
            claimedRewards={userState.claimedDailyRewards}
            onClaim={(idx, reward) => {
                setUserState(prev => ({ 
                    ...prev, 
                    balance: prev.balance + reward,
                    claimedDailyRewards: [...prev.claimedDailyRewards, idx]
                }));
            }}
            onGoDeposit={() => { setShowDailyTask(false); setWalletTab('recharge'); }}
        />

        <FeedbackModal 
            isOpen={showFeedback}
            onClose={() => setShowFeedback(false)}
            history={feedbacks.filter(f => f.userId === (userState.phoneNumber || 'Guest'))}
            onSubmit={(msg, img) => {
                setFeedbacks(prev => [{
                    id: Date.now().toString(),
                    userId: userState.phoneNumber || 'Guest',
                    message: msg,
                    image: img,
                    date: Date.now(),
                    status: 'PENDING'
                }, ...prev]);
                playSuccess();
            }}
        />

        <BonusModal 
            onClose={() => setShowBonusModal(false)}
            onDeposit={() => { setShowBonusModal(false); setWalletTab('recharge'); }}
        />

        <VipPanel 
            isOpen={showVipPanel}
            onClose={() => setShowVipPanel(false)}
            userState={userState}
            onClaimLevelReward={handleClaimLevelReward}
            onClaimMonthlyReward={handleClaimMonthlyReward}
        />
    </div>
  );
};

export default App;