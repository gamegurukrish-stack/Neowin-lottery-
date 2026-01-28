
import React from 'react';
import { Wallet, RefreshCw, Bell, Lock, Users, Crown } from 'lucide-react';
import { UserState } from '../types';
import clsx from 'clsx';

interface HeaderProps {
  userState: UserState;
  onRefresh: () => void;
  onOpenAdmin: () => void;
  onOpenWallet: (type: 'recharge' | 'withdraw') => void;
  onOpenPromotion: () => void;
  showBalance?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  userState, 
  onRefresh, 
  onOpenAdmin, 
  onOpenWallet, 
  onOpenPromotion,
  showBalance = true 
}) => {
  
  const getVipBadgeStyles = (level: number) => {
    if (level >= 5) return "bg-cyan-500 text-black";
    if (level === 4) return "bg-purple-500 text-white";
    if (level === 3) return "bg-yellow-400 text-black";
    if (level === 2) return "bg-gray-300 text-black";
    if (level === 1) return "bg-orange-400 text-black";
    return "bg-gray-800 text-gray-500";
  };

  return (
    <div className={clsx("bg-card-bg text-white p-4 sticky top-0 z-50 shadow-md", !showBalance && "pb-2")}>
      <div className={clsx("flex justify-between items-center", showBalance ? "mb-4" : "mb-0")}>
        <h1 className="text-xl font-bold tracking-wider text-primary flex items-center gap-2">
            NEOWIN
            <div className={clsx(
                "text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-0.5 font-bold transition-colors",
                getVipBadgeStyles(userState.vipLevel)
            )}>
                <Crown size={8} fill="currentColor"/> V{userState.vipLevel}
            </div>
        </h1>
        <div className="flex gap-4 items-center">
             {/* Promotion Button */}
            <button 
                onClick={onOpenPromotion}
                className="text-purple-400 hover:text-white transition-colors"
            >
                <Users size={20} />
            </button>
            {/* Secret Admin Button - High Visibility for Admin */}
            {userState.isAdmin && (
              <button 
                  onClick={onOpenAdmin} 
                  className="bg-game-red text-white p-1.5 rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-red-500/40 animate-pulse"
                  title="Open Admin Panel"
              >
                  <Lock size={18} />
              </button>
            )}
            <button className="text-gray-400 hover:text-white"><Bell size={20} /></button>
        </div>
      </div>
      
      {showBalance && (
        <div className="bg-dark-bg p-4 rounded-xl shadow-inner border border-gray-800 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center text-gray-400 text-sm mb-1">
            <Wallet size={16} className="mr-2" />
            <span>Available Balance</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-white">
              ₹ {userState.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <button 
              onClick={onRefresh}
              className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
            >
              <RefreshCw size={16} className="text-primary" />
            </button>
          </div>
          <div className="mt-3 flex gap-2">
              <button 
                  onClick={() => onOpenWallet('recharge')}
                  className="flex-1 bg-primary text-black font-bold py-2 rounded-lg text-sm hover:opacity-90 transition shadow-lg shadow-primary/20"
              >
                  Recharge
              </button>
              <button 
                  onClick={() => onOpenWallet('withdraw')}
                  className="flex-1 bg-gray-700 text-white font-bold py-2 rounded-lg text-sm hover:bg-gray-600 transition"
              >
                  Withdraw
              </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
