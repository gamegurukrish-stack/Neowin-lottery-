
import React from 'react';
import { Bet, Color } from '../types';
import clsx from 'clsx';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface MyHistoryProps {
  bets: Bet[];
}

const MyHistory: React.FC<MyHistoryProps> = ({ bets }) => {
  const getSelectionBadge = (selection: string | number) => {
    if (typeof selection === 'number') {
        return <span className="text-blue-400 font-bold">Number {selection}</span>;
    }
    if (selection === 'BIG') return <span className="text-orange-400 font-bold">Big</span>;
    if (selection === 'SMALL') return <span className="text-blue-400 font-bold">Small</span>;
    if (selection === Color.GREEN) return <span className="text-game-green font-bold">Green</span>;
    if (selection === Color.RED) return <span className="text-game-red font-bold">Red</span>;
    if (selection === Color.VIOLET) return <span className="text-game-violet font-bold">Violet</span>;
    return <span>{selection}</span>;
  };

  const getNumberColor = (num: number) => {
    if (num === 0) return 'bg-gradient-to-tr from-game-red via-game-violet to-game-violet';
    if (num === 5) return 'bg-gradient-to-tr from-game-green via-game-violet to-game-violet';
    if ([1, 3, 7, 9].includes(num)) return 'bg-game-green';
    return 'bg-game-red';
  };

  if (bets.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center py-20 opacity-60">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-600 mb-4">
                  <path d="M19.5 14.25V19.5H4.5V14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 15.75L12 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.75 8.25L12 4.5L8.25 8.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 19.5C12 19.5 16 16.5 19 16.5C22 16.5 22 13.5 22 13.5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round"/>
                  <path d="M4.5 14.25H19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4"/>
              </svg>
              <p className="text-gray-500 font-medium">No data</p>
          </div>
      );
  }

  return (
    <div className="space-y-3">
        {bets.map((bet) => (
            <div key={bet.id} className="bg-card-bg p-4 rounded-xl border border-gray-800 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <div className="text-2xl font-bold text-white mb-1">{getSelectionBadge(bet.selection)}</div>
                        <div className="text-xs text-gray-500 font-mono">Period: {bet.periodId.slice(-4)}</div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                        <div className={clsx(
                            "flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg",
                            bet.status === 'WIN' ? "bg-green-900/20 text-green-400" :
                            bet.status === 'LOSS' ? "bg-red-900/20 text-red-400" :
                            "bg-yellow-900/20 text-yellow-400"
                        )}>
                            {bet.status === 'WIN' && <><CheckCircle2 size={14} /> Win</>}
                            {bet.status === 'LOSS' && <><XCircle size={14} /> Loss</>}
                            {bet.status === 'PENDING' && <><Clock size={14} className="animate-pulse" /> Pending</>}
                        </div>

                        {/* Result Badge - Shown when available */}
                        {(bet.status === 'WIN' || bet.status === 'LOSS') && bet.resultNumber !== undefined && (
                            <div className="flex items-center gap-1.5 animate-in fade-in">
                                <span className="text-[10px] text-gray-500 uppercase font-bold">Result</span>
                                <div className={clsx(
                                    "w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md border border-white/10",
                                    getNumberColor(bet.resultNumber)
                                )}>
                                    {bet.resultNumber}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-between items-end border-t border-gray-700/50 pt-3 mt-2">
                    <div className="text-xs text-gray-400">
                        Bet Amount <br/>
                        <span className="text-white text-base font-bold">₹{bet.amount}</span>
                    </div>
                    {bet.status !== 'PENDING' && (
                         <div className="text-right">
                            <span className="text-xs text-gray-400">Result</span>
                            <div className={clsx(
                                "text-lg font-bold",
                                bet.status === 'WIN' ? "text-green-400" : "text-red-400"
                            )}>
                                {bet.status === 'WIN' ? `+₹${bet.winAmount.toFixed(2)}` : `-₹${bet.amount}`}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        ))}
    </div>
  );
};

export default MyHistory;
