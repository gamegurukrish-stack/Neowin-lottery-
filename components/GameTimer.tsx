import React, { useEffect, useRef } from 'react';
import { Timer } from 'lucide-react';
import clsx from 'clsx';
import { BETTING_CLOSE_SECONDS } from '../constants';
import { playTick } from '../services/soundService';

interface GameTimerProps {
  timeLeft: number;
  periodId: string;
}

const GameTimer: React.FC<GameTimerProps> = ({ timeLeft, periodId }) => {
  const isCritical = timeLeft <= BETTING_CLOSE_SECONDS;
  const lastTimeRef = useRef(timeLeft);

  useEffect(() => {
    // Play tick only when second changes and is in critical zone (last 5 seconds)
    if (timeLeft <= 5 && timeLeft > 0 && timeLeft !== lastTimeRef.current) {
        playTick();
    }
    lastTimeRef.current = timeLeft;
  }, [timeLeft]);

  // Render the 5 boxes for the timer visual
  const secondsStr = timeLeft.toString().padStart(2, '0');
  
  return (
    <div className="px-4 py-6 bg-[url('https://picsum.photos/800/200?blur=2')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        <div className="relative z-10 flex justify-between items-center">
            <div>
                <div className="flex items-center text-gray-300 text-sm mb-1">
                    <Timer size={14} className="mr-1" />
                    <span>Period</span>
                </div>
                <div className="text-2xl font-bold text-white tracking-widest font-mono">
                    {periodId.slice(-4)}
                </div>
                <div className="text-xs text-gray-500 font-mono mt-1">
                    ID: {periodId}
                </div>
            </div>

            <div className="text-right">
                <div className="text-sm text-gray-300 mb-1">Count Down</div>
                <div className="flex gap-1 justify-end">
                     <div className={clsx(
                         "text-3xl font-bold min-w-[60px] text-center p-2 rounded bg-card-bg shadow-lg border border-gray-700 transition-colors duration-300",
                         isCritical ? "text-game-red bg-red-900/20 border-red-900" : "text-primary"
                     )}>
                        00 : {secondsStr}
                     </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default GameTimer;