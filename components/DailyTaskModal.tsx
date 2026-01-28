
import React from 'react';
import { X, Calendar, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { playSuccess } from '../services/soundService';

interface DailyTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDeposit: number;
  claimedRewards: number[];
  onClaim: (index: number, reward: number) => void;
  onGoDeposit: () => void;
}

const DailyTaskModal: React.FC<DailyTaskModalProps> = ({ 
    isOpen, onClose, currentDeposit, claimedRewards, onClaim, onGoDeposit 
}) => {
  if (!isOpen) return null;

  // Configuration for daily tasks
  const tasks = [
      { target: 200, reward: 20 },
      { target: 500, reward: 55 },
      { target: 1000, reward: 120 },
      { target: 5000, reward: 600 },
      { target: 10000, reward: 1300 },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-dark-bg rounded-2xl overflow-hidden relative shadow-2xl border border-gray-700 animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center relative shrink-0">
             <div className="absolute top-3 right-3">
                 <button onClick={onClose} className="bg-black/20 hover:bg-black/40 text-white p-1 rounded-full transition">
                     <X size={20} />
                 </button>
             </div>
             
             <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg transform rotate-3">
                 <Calendar size={32} className="text-white" />
             </div>
             <h2 className="text-white font-bold text-xl uppercase tracking-wider">Daily Mission</h2>
             <p className="text-blue-100 text-xs mt-1">Deposit daily to unlock extra rewards!</p>
        </div>

        {/* Progress Summary */}
        <div className="bg-gray-800/50 p-4 border-b border-gray-700 shrink-0">
             <div className="flex justify-between items-end mb-2">
                 <span className="text-gray-400 text-xs font-bold uppercase">Today's Deposit</span>
                 <span className="text-2xl font-bold text-white">₹{currentDeposit}</span>
             </div>
             <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                 {/* Progress based on max target */}
                 <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                    style={{ width: `${Math.min((currentDeposit / 10000) * 100, 100)}%` }}
                 ></div>
             </div>
        </div>

        {/* Task List */}
        <div className="overflow-y-auto p-4 space-y-3 flex-1">
            {tasks.map((task, idx) => {
                const isCompleted = currentDeposit >= task.target;
                const isClaimed = claimedRewards.includes(idx);
                const percent = Math.min((currentDeposit / task.target) * 100, 100);

                return (
                    <div key={idx} className="bg-card-bg p-3 rounded-xl border border-gray-700 relative overflow-hidden group">
                        {/* Background Progress Tint */}
                        <div 
                            className="absolute inset-0 bg-blue-500/5 transition-all duration-1000 pointer-events-none"
                            style={{ width: `${percent}%` }}
                        ></div>

                        <div className="flex justify-between items-center relative z-10">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-bold text-sm">Deposit ₹{task.target}</span>
                                    {isCompleted && <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-bold">DONE</span>}
                                </div>
                                <div className="text-xs text-gray-400 mt-0.5">
                                    Reward: <span className="text-yellow-400 font-bold">₹{task.reward}</span>
                                </div>
                            </div>
                            
                            <div>
                                {isClaimed ? (
                                    <button disabled className="bg-gray-700 text-gray-500 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 cursor-not-allowed">
                                        <CheckCircle2 size={14} /> Collected
                                    </button>
                                ) : isCompleted ? (
                                    <button 
                                        onClick={() => {
                                            playSuccess();
                                            onClaim(idx, task.reward);
                                        }}
                                        className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-orange-500/20 hover:scale-105 transition-transform animate-pulse"
                                    >
                                        Claim
                                    </button>
                                ) : (
                                    <button 
                                        onClick={onGoDeposit}
                                        className="bg-blue-600/20 text-blue-400 border border-blue-600/50 px-3 py-2 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-1"
                                    >
                                        Deposit <ArrowRight size={12} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Mini Progress Bar for incomplete tasks */}
                        {!isCompleted && (
                            <div className="mt-2 h-1 w-full bg-gray-800 rounded-full overflow-hidden relative z-10">
                                <div className="h-full bg-blue-500" style={{ width: `${percent}%` }}></div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default DailyTaskModal;
