
import React from 'react';
import { GameResult, Color } from '../types';
import clsx from 'clsx';

interface HistoryTableProps {
  history: GameResult[];
  compact?: boolean;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ history, compact = false }) => {
  return (
    <div className={clsx(compact ? "mt-0" : "p-4 pb-20")}>
      {!compact && (
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            Game Record
        </h3>
      )}
      
      <div className="bg-card-bg rounded-lg overflow-hidden border border-gray-800 shadow-md">
        <div className="grid grid-cols-4 bg-dark-bg p-3 text-gray-400 text-[10px] font-bold uppercase tracking-wider text-center">
            <div>Period</div>
            <div>Number</div>
            <div>Big/Small</div>
            <div>Color</div>
        </div>
        
        <div className="divide-y divide-gray-800">
            {history.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">No history available</div>
            ) : (
                history.map((item) => (
                    <div key={item.periodId} className="grid grid-cols-4 p-3 items-center text-center hover:bg-white/5 transition-colors">
                        <div className="text-gray-300 font-mono text-xs">{item.periodId.slice(-4)}</div>
                        <div className={clsx(
                            "font-bold text-lg bg-clip-text text-transparent bg-gradient-to-b",
                            item.number === 0 ? "from-red-400 to-purple-500" :
                            item.number === 5 ? "from-green-400 to-purple-500" :
                            [1,3,7,9].includes(item.number) ? "from-green-400 to-green-600" :
                            "from-red-400 to-red-600"
                        )}>
                            {item.number}
                        </div>
                        <div className="flex justify-center">
                            <span className={clsx(
                                "text-xs font-bold px-2 py-0.5 rounded",
                                item.number >= 5 ? "text-orange-400 bg-orange-900/20" : "text-blue-400 bg-blue-900/20"
                            )}>
                                {item.number >= 5 ? 'Big' : 'Small'}
                            </span>
                        </div>
                        <div className="flex justify-center gap-1">
                            {item.colors.map(c => (
                                <div key={c} className={clsx(
                                    "w-3 h-3 rounded-full shadow-sm ring-1 ring-black/50",
                                    c === Color.GREEN ? "bg-game-green" :
                                    c === Color.RED ? "bg-game-red" : "bg-game-violet"
                                )} />
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default HistoryTable;
