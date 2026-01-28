
import React, { useState } from 'react';
import { GameResult, Bet } from '../types';
import HistoryTable from './HistoryTable';
import MyHistory from './MyHistory';
import clsx from 'clsx';

interface GameTabsProps {
  gameHistory: GameResult[];
  userBets: Bet[];
  onOpenPrediction?: () => void;
}

const GameTabs: React.FC<GameTabsProps> = ({ gameHistory, userBets, onOpenPrediction }) => {
  const [activeTab, setActiveTab] = useState<'CHART' | 'STRATEGY' | 'HISTORY'>('CHART');

  return (
    <div className="w-full pb-24 px-4 mt-2">
        {/* Tab Buttons */}
        <div className="flex gap-2 mb-4">
             <button
                onClick={() => setActiveTab('CHART')}
                className={clsx(
                    "flex-1 py-3 rounded-lg font-bold text-sm transition-all shadow-sm",
                    activeTab === 'CHART' ? "bg-game-red text-white shadow-red-900/20" : "bg-white text-gray-600 hover:bg-gray-50"
                )}
             >
                 Chart
             </button>
             <button
                onClick={() => {
                    setActiveTab('STRATEGY');
                    if(onOpenPrediction) onOpenPrediction();
                }}
                className={clsx(
                    "flex-1 py-3 rounded-lg font-bold text-sm transition-all shadow-sm",
                    activeTab === 'STRATEGY' ? "bg-game-red text-white shadow-red-900/20" : "bg-white text-gray-600 hover:bg-gray-50"
                )}
             >
                 Follow Strategy
             </button>
             <button
                onClick={() => setActiveTab('HISTORY')}
                className={clsx(
                    "flex-1 py-3 rounded-lg font-bold text-sm transition-all shadow-sm",
                    activeTab === 'HISTORY' ? "bg-game-red text-white shadow-red-900/20" : "bg-white text-gray-600 hover:bg-gray-50"
                )}
             >
                 My History
             </button>
        </div>

        {/* Content */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {activeTab === 'CHART' && <HistoryTable history={gameHistory} compact={true} />}
            {activeTab === 'STRATEGY' && (
                 <div className="text-center py-10 text-gray-500">
                     <p>Strategy Advisor Activated.</p>
                     <p className="text-xs mt-2">Check the floating bot icon for insights.</p>
                 </div>
            )}
            {activeTab === 'HISTORY' && <MyHistory bets={userBets} />}
        </div>
    </div>
  );
};

export default GameTabs;
