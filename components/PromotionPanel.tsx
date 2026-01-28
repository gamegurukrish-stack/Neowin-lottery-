import React, { useState } from 'react';
import { Share2, Users, Coins, ArrowRight, Activity, X, Copy } from 'lucide-react';
import { UserState } from '../types';
import { REFERRAL_RATES, simulateDownlineWin } from '../services/mlmService';
import { playSuccess } from '../services/soundService';
import clsx from 'clsx';

interface PromotionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userState: UserState;
  onClaimCommission: (amount: number) => void;
  onSimulateCommission: (amount: number) => void; // Adds to commission balance
}

const PromotionPanel: React.FC<PromotionPanelProps> = ({ 
    isOpen, onClose, userState, onClaimCommission, onSimulateCommission 
}) => {
  const [copied, setCopied] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(userState.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulate = () => {
    // Simulate a downline winning
    const result = simulateDownlineWin(userState.phoneNumber || '');
    onSimulateCommission(result.commission);
    playSuccess();
    
    const logMsg = `L${result.level} ${result.sourceUser} won bet of ₹${result.betAmount}. You earned ₹${result.commission.toFixed(2)}`;
    setSimulationLog(prev => [logMsg, ...prev].slice(0, 5));
  };

  const handleClaim = () => {
    if (userState.commissionBalance > 0) {
        onClaimCommission(userState.commissionBalance);
        playSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-card-bg w-full max-w-md h-[90vh] sm:h-auto rounded-t-3xl sm:rounded-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 border border-gray-700 flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-900 to-indigo-900 flex justify-between items-center shrink-0">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <Users size={20} className="text-purple-300" /> Agency Promotion
            </h2>
            <button onClick={onClose} className="text-gray-300 hover:text-white bg-white/10 p-1 rounded-full">
                <X size={20} />
            </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6 flex-1">
            
            {/* My Code */}
            <div className="text-center">
                <p className="text-gray-400 text-xs uppercase mb-2">My Referral Code</p>
                <div 
                    onClick={handleCopy}
                    className="bg-dark-bg border border-dashed border-purple-500 rounded-xl p-4 flex items-center justify-center gap-3 cursor-pointer hover:bg-white/5 transition"
                >
                    <span className="text-2xl font-mono font-bold text-white tracking-widest">{userState.referralCode}</span>
                    {copied ? <span className="text-green-500 text-xs font-bold">COPIED</span> : <Copy size={16} className="text-gray-500" />}
                </div>
            </div>

            {/* Commission Wallet */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-gray-700 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Coins size={100} className="text-yellow-500" />
                </div>
                <div className="relative z-10">
                    <p className="text-gray-400 text-sm">Commission Balance</p>
                    <div className="text-4xl font-bold text-white mt-1 mb-4">
                        ₹ {userState.commissionBalance.toFixed(2)}
                    </div>
                    <button 
                        onClick={handleClaim}
                        disabled={userState.commissionBalance <= 0}
                        className={clsx(
                            "w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all",
                            userState.commissionBalance > 0 
                                ? "bg-primary text-black hover:opacity-90 shadow-lg shadow-primary/20" 
                                : "bg-gray-700 text-gray-500 cursor-not-allowed"
                        )}
                    >
                        Transfer to Wallet <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            {/* Simulation Tool */}
            <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-indigo-300 font-bold text-sm flex items-center gap-2">
                        <Activity size={16} /> Simulation Tool
                    </h3>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">DEV ONLY</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">
                    Click below to simulate a downline user winning a bet, which triggers a commission for you.
                </p>
                <button 
                    onClick={handleSimulate}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition"
                >
                    Simulate Downline Win
                </button>
                
                {/* Log */}
                <div className="mt-3 space-y-1">
                    {simulationLog.map((log, idx) => (
                        <div key={idx} className="text-[10px] text-gray-400 font-mono animate-in slide-in-from-left">
                            {log}
                        </div>
                    ))}
                </div>
            </div>

            {/* Rates Table */}
            <div>
                <h3 className="text-white font-bold text-sm mb-3">Commission Rates</h3>
                <div className="grid grid-cols-2 gap-2">
                    {REFERRAL_RATES.map((rate, idx) => (
                        <div key={idx} className="bg-dark-bg p-3 rounded border border-gray-800 flex justify-between items-center">
                            <span className="text-gray-400 text-xs">Level {idx + 1}</span>
                            <span className="text-primary font-bold text-sm">{(rate * 100).toFixed(2)}%</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fake Share */}
            <button className="w-full flex items-center justify-center gap-2 py-4 border border-gray-700 rounded-xl text-gray-300 hover:bg-white/5 transition">
                <Share2 size={18} /> Share Referral Link
            </button>
        </div>
      </div>
    </div>
  );
};

export default PromotionPanel;