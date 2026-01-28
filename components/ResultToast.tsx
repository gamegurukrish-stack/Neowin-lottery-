import React, { useEffect } from 'react';
import clsx from 'clsx';
import { Color, BetSelection } from '../types';

interface ResultToastProps {
  winAmount: number;
  betSelection: BetSelection;
  onClose: () => void;
}

const ResultToast: React.FC<ResultToastProps> = ({ winAmount, betSelection, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isWin = winAmount > 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none p-4">
      <div className={clsx(
          "pointer-events-auto bg-card-bg border-2 rounded-2xl p-8 shadow-2xl max-w-sm w-full text-center transform transition-all animate-in zoom-in duration-300",
          isWin ? "border-game-green shadow-green-900/50" : "border-game-red shadow-red-900/50"
      )}>
        <div className={clsx(
            "w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 text-4xl shadow-inner",
            isWin ? "bg-game-green text-white" : "bg-game-red text-white"
        )}>
            {isWin ? "🏆" : "😓"}
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">
            {isWin ? "Congratulations!" : "Better Luck Next Time"}
        </h2>
        
        <p className="text-gray-400 mb-6">
            {isWin 
                ? `You won ₹ ${winAmount.toFixed(2)}` 
                : `You lost your bet on ${betSelection}`
            }
        </p>

        <button 
            onClick={onClose}
            className="px-8 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full font-bold transition"
        >
            Close
        </button>
      </div>
    </div>
  );
};

export default ResultToast;