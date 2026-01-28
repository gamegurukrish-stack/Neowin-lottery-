import React from 'react';
import clsx from 'clsx';
import { GameMode } from '../types';
import { MODE_CONFIG } from '../constants';

interface GameModeSelectorProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({ currentMode, onSelectMode }) => {
  const modes: GameMode[] = ['30s', '1m', '3m', '5m'];

  return (
    <div className="bg-card-bg p-2 mb-4">
      <div className="flex bg-dark-bg rounded-lg p-1">
        {modes.map((mode) => (
          <button
            key={mode}
            onClick={() => onSelectMode(mode)}
            className={clsx(
              "flex-1 py-3 text-sm font-bold rounded-md transition-all",
              currentMode === mode 
                ? "bg-gradient-to-r from-primary to-yellow-600 text-white shadow-lg" 
                : "text-gray-400 hover:text-white"
            )}
          >
            <div className="leading-tight">
                {MODE_CONFIG[mode].label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameModeSelector;