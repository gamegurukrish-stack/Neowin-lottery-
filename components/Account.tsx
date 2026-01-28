
import React, { useState } from 'react';
import { UserState } from '../types';
import { 
  Wallet, Settings, Bell, Gift, FileText, ChevronRight, LogOut, 
  Shield, Crown, Sparkles, Lock, Headphones, RefreshCw, 
  ArrowDownCircle, ArrowUpCircle, History, FileClock, 
  BarChart3, Flag, Copy, LayoutGrid, CreditCard
} from 'lucide-react';
import clsx from 'clsx';
import { playClick } from '../services/soundService';

interface AccountProps {
  userState: UserState;
  onLogout: () => void;
  onOpenGiftRedeem?: () => void;
  onOpenAdmin: () => void;
  onOpenFeedback: () => void;
  onOpenWallet: (type: 'recharge' | 'withdraw') => void;
  onOpenVip: () => void; // New Prop
}

const Account: React.FC<AccountProps> = ({ 
  userState, onLogout, onOpenGiftRedeem, onOpenAdmin, onOpenFeedback, onOpenWallet, onOpenVip 
}) => {
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleCopyUid = () => {
    navigator.clipboard.writeText(userState.uid);
    setCopied(true);
    playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
      setRefreshing(true);
      playClick();
      setTimeout(() => setRefreshing(false), 1000);
  };
  
  const getVipBadgeStyles = (level: number) => {
     // Reference image style: Silver/Metallic for VIP0/1, Gold/Fancy for higher
     if (level >= 5) return "bg-gradient-to-r from-blue-400 to-cyan-300 text-blue-900";
     if (level >= 1) return "bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900";
     return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800";
  };

  const VipIcon = userState.vipLevel >= 5 ? Sparkles : Crown;

  // Mock date for visual fidelity to reference
  const lastLogin = new Date().toLocaleString('en-IN', { 
      year: 'numeric', month: '2-digit', day: '2-digit', 
      hour: '2-digit', minute: '2-digit', second: '2-digit', 
      hour12: false 
  }).replace(',', '');

  return (
    <div className="min-h-screen bg-dark-bg pb-24 font-sans">
      
      {/* 1. Header Section (Red Gradient) */}
      <div className="bg-gradient-to-b from-game-red to-[#b91c1c] pb-20 pt-8 px-5 rounded-b-[40px] relative shadow-lg">
        <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-white p-0.5 shadow-xl shrink-0">
                <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userState.phoneNumber}`} 
                    alt="Avatar" 
                    className="w-full h-full rounded-full bg-gray-100" 
                />
            </div>
            
            {/* User Info */}
            <div className="flex-1 text-white">
                <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold tracking-wide">
                        MEMBER{userState.phoneNumber?.slice(-4)}
                    </h2>
                    <span className={clsx(
                        "text-[10px] px-2 py-0.5 rounded-full font-black flex items-center gap-1 shadow-md uppercase",
                        getVipBadgeStyles(userState.vipLevel)
                    )}>
                        <VipIcon size={10} fill="currentColor" /> VIP {userState.vipLevel}
                    </span>
                </div>
                
                <div className="flex items-center gap-2 text-white/90 text-xs bg-black/20 px-3 py-1 rounded-full w-fit mb-1 backdrop-blur-sm">
                    <span className="opacity-80">UID</span>
                    <span className="font-mono font-bold">| {userState.uid}</span>
                    <button onClick={handleCopyUid} className="ml-1 hover:text-white transition-colors">
                        {copied ? <span className="text-green-300 font-bold">✓</span> : <Copy size={12} />}
                    </button>
                </div>

                <div className="text-[10px] text-white/70">
                    Last login: {lastLogin}
                </div>
            </div>
        </div>

        {/* Settings Icon Absolute */}
        <button className="absolute top-8 right-5 text-white/80 hover:text-white transition">
            <Settings size={24} />
        </button>
      </div>

      {/* 2. Balance Card (Floating) */}
      <div className="px-4 -mt-14 relative z-10">
          <div className="bg-card-bg rounded-2xl p-5 shadow-xl border border-gray-800">
              <div className="flex justify-between items-start mb-2">
                  <span className="text-gray-400 text-sm">Total balance</span>
                  <button 
                    onClick={handleRefresh}
                    className={clsx("text-gray-500 hover:text-white transition-all", refreshing && "animate-spin")}
                  >
                      <RefreshCw size={18} />
                  </button>
              </div>
              <div className="text-3xl font-bold text-white mb-4">
                  ₹{userState.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
          </div>
      </div>

      {/* 3. Quick Actions Grid */}
      <div className="px-4 mt-6">
          <div className="bg-card-bg rounded-xl p-4 shadow-lg border border-gray-800 grid grid-cols-3 gap-2">
              {[
                  { label: 'Deposit', icon: ArrowDownCircle, color: 'text-orange-500', bg: 'bg-orange-500/10', action: () => onOpenWallet('recharge') },
                  { label: 'Withdraw', icon: ArrowUpCircle, color: 'text-blue-500', bg: 'bg-blue-500/10', action: () => onOpenWallet('withdraw') },
                  { label: 'VIP', icon: Crown, color: 'text-emerald-500', bg: 'bg-emerald-500/10', action: onOpenVip },
              ].map((item, idx) => (
                  <button 
                    key={idx} 
                    onClick={item.action}
                    className="flex flex-col items-center gap-2 group"
                  >
                      <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-active:scale-95", item.bg, item.color)}>
                          <item.icon size={24} />
                      </div>
                      <span className="text-xs text-gray-400 font-medium">{item.label}</span>
                  </button>
              ))}
          </div>
      </div>

      {/* 4. History Grid (2x2) */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
            {[
                { label: 'Game History', desc: 'My game history', icon: FileText, color: 'bg-blue-600', action: () => {} },
                { label: 'Transaction', desc: 'My transaction', icon: FileClock, color: 'bg-green-600', action: () => {} },
                { label: 'Deposit', desc: 'Deposit history', icon: Wallet, color: 'bg-pink-600', action: () => {} },
                { label: 'Withdraw', desc: 'Withdraw history', icon: CreditCard, color: 'bg-orange-600', action: () => {} },
            ].map((item, idx) => (
                <button 
                    key={idx}
                    onClick={item.action} 
                    className="bg-card-bg p-3 rounded-xl border border-gray-800 flex items-center gap-3 shadow-md hover:bg-gray-800 transition active:scale-95 text-left"
                >
                    <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-lg shrink-0", item.color)}>
                        <item.icon size={20} />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-gray-200 leading-tight">{item.label}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{item.desc}</div>
                    </div>
                </button>
            ))}
      </div>

      {/* 5. Menu List */}
      <div className="px-4 mt-4 space-y-3">
          
           {/* Admin Button - Only visible if isAdmin */}
           {userState.isAdmin && (
              <button 
                onClick={onOpenAdmin}
                className="w-full bg-red-900/20 p-4 rounded-xl flex items-center justify-between border border-red-500/30 hover:bg-red-900/40 transition mb-3 group"
            >
                  <div className="flex items-center gap-3">
                      <Lock size={20} className="text-red-500" />
                      <span className="text-sm font-bold text-red-100">Admin Control Panel</span>
                  </div>
                  <ChevronRight size={16} className="text-red-500 group-hover:translate-x-1 transition-transform" />
              </button>
          )}

          {[
              { icon: Bell, label: 'Notification', badge: '1', color: 'text-red-400', action: () => {} },
              { icon: Gift, label: 'Gifts', color: 'text-pink-400', action: onOpenGiftRedeem },
              { icon: Flag, label: 'My Tournament', color: 'text-orange-400', action: () => {} },
              { icon: BarChart3, label: 'Game statistics', color: 'text-purple-400', action: () => {} },
              { icon: Headphones, label: 'Help & Feedback', color: 'text-yellow-400', action: onOpenFeedback },
          ].map((item, idx) => (
              <button 
                key={idx} 
                onClick={item.action}
                className="w-full bg-card-bg p-4 rounded-xl flex items-center justify-between border border-gray-800 hover:bg-gray-800 transition group"
            >
                  <div className="flex items-center gap-3">
                      <item.icon size={20} className={item.color} />
                      <span className="text-sm font-medium text-gray-200">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                      {item.badge && (
                          <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                              {item.badge}
                          </span>
                      )}
                      <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                  </div>
              </button>
          ))}

          <button 
            onClick={onLogout}
            className="w-full mt-6 bg-transparent p-4 rounded-xl flex items-center justify-center gap-2 text-gray-500 font-bold border border-gray-800 hover:bg-gray-800 hover:text-red-500 transition"
          >
              <LogOut size={18} /> Logout
          </button>
          
          <div className="text-center pb-4 pt-2">
              <span className="text-[10px] text-gray-600">v1.0.5 - Neowin</span>
          </div>
      </div>

    </div>
  );
};

export default Account;
