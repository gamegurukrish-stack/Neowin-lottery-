
import React, { useState } from 'react';
import { ChevronLeft, Crown, Lock, Gift, Star, Coins, History, BookOpen } from 'lucide-react';
import { UserState } from '../types';
import { VIP_TIERS } from '../constants';
import clsx from 'clsx';
import { playSuccess } from '../services/soundService';

interface VipPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userState: UserState;
  onClaimLevelReward: (level: number, amount: number) => void;
  onClaimMonthlyReward: (amount: number) => void;
}

const VipPanel: React.FC<VipPanelProps> = ({ 
    isOpen, onClose, userState, onClaimLevelReward, onClaimMonthlyReward 
}) => {
  const [activeTab, setActiveTab] = useState<'History' | 'Rules'>('History');
  
  if (!isOpen) return null;

  // Calculate Levels
  const currentTier = VIP_TIERS.find(t => t.level === userState.vipLevel) || VIP_TIERS[0];
  const nextTier = VIP_TIERS.find(t => t.level === userState.vipLevel + 1);
  
  // Progress Calculation
  const expForCurrent = currentTier.exp;
  const expForNext = nextTier ? nextTier.exp : userState.experience; // If max level, full bar
  const progress = nextTier 
    ? Math.min(Math.max((userState.experience - expForCurrent) / (expForNext - expForCurrent) * 100, 0), 100)
    : 100;

  // Rewards Status
  const isLevelRewardClaimed = userState.claimedLevelRewards.includes(userState.vipLevel);
  // Simple check: claimed within this month?
  const lastClaimDate = new Date(userState.monthlyRewardLastClaimed);
  const now = new Date();
  const isMonthlyClaimed = lastClaimDate.getMonth() === now.getMonth() && lastClaimDate.getFullYear() === now.getFullYear();

  return (
    <div className="fixed inset-0 z-[100] bg-gray-100 flex flex-col font-sans animate-in slide-in-from-right duration-300">
      
      {/* 1. Header (Red Background) */}
      <div className="bg-[#e93d3d] text-white pb-20 rounded-b-[2rem] shadow-lg relative shrink-0">
          <div className="p-4 flex items-center relative">
              <button onClick={onClose} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition">
                  <ChevronLeft size={24} />
              </button>
              <h1 className="flex-1 text-center font-bold text-lg">VIP</h1>
              <div className="w-8"></div> {/* Spacer for centering */}
          </div>

          <div className="px-6 mt-2 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-2 border-white/50 overflow-hidden bg-gray-200">
                  <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userState.phoneNumber}`} 
                      alt="Avatar" 
                      className="w-full h-full"
                  />
              </div>
              <div>
                  <div className="text-xl font-bold flex items-center gap-2">
                    <Crown size={20} fill="gold" className="text-yellow-300" />
                    VIP {userState.vipLevel}
                  </div>
                  <div className="text-white/80 text-sm">MEMBER{userState.phoneNumber?.slice(-4)}</div>
              </div>
          </div>
      </div>

      {/* 2. Stats Cards (Floating) */}
      <div className="px-4 -mt-12 mb-4 relative z-10 flex gap-3">
          <div className="flex-1 bg-white rounded-xl p-3 shadow-md text-center">
              <div className="text-xs text-gray-500 font-bold mb-1">My Experience</div>
              <div className="text-lg font-bold text-[#e93d3d]">{userState.experience} EXP</div>
          </div>
          <div className="flex-1 bg-white rounded-xl p-3 shadow-md text-center">
              <div className="text-xs text-gray-500 font-bold mb-1">Payout Time</div>
              <div className="text-lg font-bold text-gray-800">4 <span className="text-xs font-normal text-gray-400">Days</span></div>
          </div>
      </div>

      {/* 3. Main Content (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-6">
          
          <div className="text-center text-xs text-gray-400 bg-gray-200 py-1 rounded">
              VIP level rewards are settled at 2:00 am on the 1st of every month
          </div>

          {/* Level Progress Card */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl min-h-[180px] text-white p-5 flex flex-col justify-between group">
              {/* Background Image/Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#8faeff] to-[#5b86e5]"></div>
              <div className="absolute right-[-20px] top-[-20px] opacity-20 transform rotate-12">
                  <Crown size={150} fill="white" />
              </div>

              <div className="relative z-10">
                  <div className="flex items-center gap-2 text-2xl font-bold italic mb-1">
                      <Crown fill="currentColor" size={28} /> VIP{userState.vipLevel}
                      {nextTier && <Lock size={16} className="text-white/60 ml-2" />}
                  </div>
                  <p className="text-xs text-white/80 max-w-[70%]">
                      {nextTier 
                          ? `Upgrading VIP${nextTier.level} requires ${nextTier.exp - userState.experience} EXP` 
                          : "Max Level Reached"}
                  </p>
                  <div className="inline-block bg-white/20 px-2 py-0.5 rounded text-[10px] mt-2 backdrop-blur-sm">
                      Bet ₹1 = 1 EXP
                  </div>
              </div>

              <div className="relative z-10 mt-4">
                  <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden mb-1">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                      ></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold">
                      <span>{userState.experience}</span>
                      <span>{nextTier ? nextTier.exp : 'MAX'} EXP</span>
                  </div>
              </div>
          </div>

          {/* Benefits Section */}
          <div>
              <h3 className="flex items-center gap-2 text-gray-800 font-bold mb-4">
                  <div className="bg-[#e93d3d] p-1 rounded-full text-white"><Crown size={12} /></div>
                  VIP{userState.vipLevel} Benefits Level
              </h3>

              <div className="space-y-3">
                  {/* 1. Level Reward */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                              <Gift size={20} />
                          </div>
                          <div>
                              <div className="text-sm font-bold text-gray-800">Level up rewards</div>
                              <div className="text-[10px] text-gray-400">Each account can only receive 1 time</div>
                          </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1 text-orange-500 font-bold text-sm bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                              <Coins size={12} /> {currentTier.levelReward}
                          </div>
                          <button 
                             disabled={isLevelRewardClaimed || currentTier.levelReward === 0}
                             onClick={() => {
                                 playSuccess();
                                 onClaimLevelReward(userState.vipLevel, currentTier.levelReward);
                             }}
                             className={clsx(
                                 "text-[10px] px-3 py-1 rounded-full border transition-all",
                                 isLevelRewardClaimed 
                                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" 
                                    : "bg-white text-[#e93d3d] border-[#e93d3d] hover:bg-[#e93d3d] hover:text-white"
                             )}
                          >
                              {isLevelRewardClaimed ? 'Received' : 'Claim'}
                          </button>
                      </div>
                  </div>

                  {/* 2. Monthly Reward */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                              <Star size={20} />
                          </div>
                          <div>
                              <div className="text-sm font-bold text-gray-800">Monthly reward</div>
                              <div className="text-[10px] text-gray-400">Each account can only receive 1 time per month</div>
                          </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1 text-yellow-600 font-bold text-sm bg-yellow-50 px-2 py-0.5 rounded border border-yellow-100">
                              <Coins size={12} /> {currentTier.monthlyReward}
                          </div>
                          <button 
                             disabled={isMonthlyClaimed || currentTier.monthlyReward === 0}
                             onClick={() => {
                                 playSuccess();
                                 onClaimMonthlyReward(currentTier.monthlyReward);
                             }}
                             className={clsx(
                                 "text-[10px] px-3 py-1 rounded-full border transition-all",
                                 isMonthlyClaimed 
                                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" 
                                    : "bg-white text-[#e93d3d] border-[#e93d3d] hover:bg-[#e93d3d] hover:text-white"
                             )}
                          >
                              {isMonthlyClaimed ? 'Received' : 'Claim'}
                          </button>
                      </div>
                  </div>

                  {/* 3. Rebate Rate */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-[#e93d3d]">
                              <Coins size={20} />
                          </div>
                          <div>
                              <div className="text-sm font-bold text-gray-800">Rebate rate</div>
                              <div className="text-[10px] text-gray-400">Increase income of rebate</div>
                          </div>
                      </div>
                      <div>
                          <div className="flex items-center gap-1 text-[#e93d3d] font-bold text-sm bg-red-50 px-2 py-1 rounded border border-red-100">
                              <Coins size={12} /> {currentTier.rebate}%
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          
          {/* Tabs Section */}
          <div className="bg-white rounded-t-2xl shadow-lg -mx-4 pb-10">
              <div className="flex border-b border-gray-200">
                  <button 
                    onClick={() => setActiveTab('History')}
                    className={clsx(
                        "flex-1 py-4 text-sm font-bold relative",
                        activeTab === 'History' ? "text-[#e93d3d]" : "text-gray-500"
                    )}
                  >
                      History
                      {activeTab === 'History' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#e93d3d] rounded-t-full"></div>}
                  </button>
                  <button 
                    onClick={() => setActiveTab('Rules')}
                    className={clsx(
                        "flex-1 py-4 text-sm font-bold relative",
                        activeTab === 'Rules' ? "text-[#e93d3d]" : "text-gray-500"
                    )}
                  >
                      Rules
                      {activeTab === 'Rules' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#e93d3d] rounded-t-full"></div>}
                  </button>
              </div>
              <div className="p-8 text-center text-gray-400 min-h-[200px] flex flex-col items-center justify-center">
                  {activeTab === 'History' ? (
                      <>
                        <History size={48} className="mb-2 opacity-20" />
                        <p className="text-sm">No reward history yet</p>
                      </>
                  ) : (
                      <>
                        <BookOpen size={48} className="mb-2 opacity-20" />
                        <p className="text-sm">VIP rules and terms apply.</p>
                      </>
                  )}
              </div>
          </div>

      </div>

      {/* Floating Support Button */}
      <button className="fixed bottom-6 right-6 bg-[#e93d3d] text-white p-3 rounded-full shadow-lg shadow-red-500/40 z-50 hover:scale-110 transition-transform">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/></svg>
      </button>

    </div>
  );
};

export default VipPanel;
