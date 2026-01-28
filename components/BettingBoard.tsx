
import React, { useState } from 'react';
import clsx from 'clsx';
import { Color, BetSelection } from '../types';
import { playClick } from '../services/soundService';
import { Minus, Plus, Wallet, ChevronDown, Check } from 'lucide-react';

interface BettingBoardProps {
  disabled: boolean;
  balance: number;
  onPlaceBet: (selection: BetSelection, amount: number) => void;
}

const BettingBoard: React.FC<BettingBoardProps> = ({ disabled, balance, onPlaceBet }) => {
  const [activeSelection, setActiveSelection] = useState<BetSelection | null>(null);
  const [baseAmount, setBaseAmount] = useState<number>(10);
  const [quantity, setQuantity] = useState<number>(1);
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const handleSelect = (selection: BetSelection) => {
    if (!disabled) {
        playClick();
        if (activeSelection === selection) {
            setActiveSelection(null); // Toggle off
        } else {
            setActiveSelection(selection);
            // Reset betting defaults
            setBaseAmount(10);
            setQuantity(1);
        }
    }
  };

  const handleConfirmBet = () => {
      if (activeSelection !== null && !disabled) {
          const totalAmount = baseAmount * quantity;
          if (totalAmount <= balance) {
              onPlaceBet(activeSelection, totalAmount);
              setActiveSelection(null);
          }
      }
  };

  const getNumberColor = (num: number) => {
    if (num === 0) return 'bg-gradient-to-tr from-game-red via-game-violet to-game-violet';
    if (num === 5) return 'bg-gradient-to-tr from-game-green via-game-violet to-game-violet';
    if ([1, 3, 7, 9].includes(num)) return 'bg-game-green';
    return 'bg-game-red';
  };

  const isSelected = (s: BetSelection) => activeSelection === s;
  const totalBetAmount = baseAmount * quantity;
  const canAfford = totalBetAmount > 0 && totalBetAmount <= balance;

  return (
    <div className="bg-card-bg rounded-t-3xl -mt-4 relative z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300">
      
      {/* Balance Header */}
      <div className="bg-gray-800/50 p-3 flex justify-between items-center border-b border-gray-700">
          <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
              <Wallet size={14} className="text-primary" />
              Available Balance
          </div>
          <div className="text-white font-bold font-mono text-sm">
              ₹ {balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
      </div>

      <div className="p-4 relative">
        {/* Color Actions */}
        <div className="flex justify-between gap-3 mb-6">
            {[
                { type: Color.GREEN, label: 'Green', bg: 'bg-game-green', shadow: 'shadow-green-900/20' },
                { type: Color.VIOLET, label: 'Violet', bg: 'bg-game-violet', shadow: 'shadow-purple-900/20' },
                { type: Color.RED, label: 'Red', bg: 'bg-game-red', shadow: 'shadow-red-900/20' }
            ].map((btn) => (
                <button 
                    key={btn.type}
                    disabled={disabled}
                    onClick={() => handleSelect(btn.type)}
                    className={clsx(
                        "flex-1 h-12 rounded-lg font-bold text-base transition-all duration-200 border-2",
                        btn.bg, btn.shadow,
                        isSelected(btn.type) 
                            ? "border-white scale-105 shadow-xl ring-2 ring-white/50 z-10" 
                            : "border-transparent opacity-90 hover:opacity-100 shadow-lg text-white",
                        disabled && "opacity-50 cursor-not-allowed grayscale"
                    )}>
                    {isSelected(btn.type) && <Check size={16} className="inline mr-1" />}
                    {btn.label}
                </button>
            ))}
        </div>

        {/* Number Grid */}
        <div className="grid grid-cols-5 gap-3 p-3 bg-dark-bg rounded-2xl border border-gray-800 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
            {numbers.map((num) => (
            <button
                key={num}
                disabled={disabled}
                onClick={() => handleSelect(num)}
                className={clsx(
                    "relative aspect-square rounded-full flex items-center justify-center text-xl font-bold shadow-md transition-all duration-200 border-2",
                    getNumberColor(num),
                    isSelected(num) 
                        ? "border-white scale-110 shadow-xl ring-2 ring-white/30 z-10 text-white" 
                        : "border-transparent text-white/90 hover:scale-105",
                    disabled && "opacity-50 cursor-not-allowed grayscale"
                )}
            >
                {num}
            </button>
            ))}
        </div>

        {/* Big / Small Actions */}
        <div className="flex justify-between gap-3 mb-2">
             {[
                { type: 'BIG', label: 'Big', from: 'from-orange-400', to: 'to-orange-600', shadow: 'shadow-orange-900/20' },
                { type: 'SMALL', label: 'Small', from: 'from-blue-400', to: 'to-blue-600', shadow: 'shadow-blue-900/20' }
            ].map((btn) => (
                <button 
                    key={btn.type}
                    disabled={disabled}
                    onClick={() => handleSelect(btn.type as BetSelection)}
                    className={clsx(
                        "flex-1 h-12 rounded-full font-bold text-lg uppercase tracking-wider transition-all duration-200 border-2",
                        `bg-gradient-to-r ${btn.from} ${btn.to}`, btn.shadow,
                        isSelected(btn.type as BetSelection)
                            ? "border-white scale-105 shadow-xl ring-2 ring-white/50 text-white" 
                            : "border-transparent opacity-90 hover:opacity-100 shadow-lg text-white",
                        disabled && "opacity-50 cursor-not-allowed grayscale"
                    )}>
                    {isSelected(btn.type as BetSelection) && <Check size={18} className="inline mr-1 -mt-1" />}
                    {btn.label}
                </button>
            ))}
        </div>
      </div>

      {/* Inline Betting Control Panel */}
      <div className={clsx(
          "bg-gray-800 border-t border-gray-700 overflow-hidden transition-all duration-300 ease-in-out",
          activeSelection !== null && !disabled ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
          <div className="p-4 space-y-4">
              <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-bold">Selection: <span className="text-white">{activeSelection}</span></span>
                  <button onClick={() => setActiveSelection(null)} className="text-gray-500 hover:text-white"><ChevronDown size={20}/></button>
              </div>

              {/* Amount Presets */}
              <div className="grid grid-cols-4 gap-2">
                  {[1, 10, 100, 1000].map(amt => (
                      <button 
                        key={amt}
                        onClick={() => { playClick(); setBaseAmount(amt); }}
                        className={clsx(
                            "py-2 rounded font-bold text-sm border transition-colors",
                            baseAmount === amt 
                                ? "bg-primary text-black border-primary" 
                                : "bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-700"
                        )}
                      >
                          {amt}
                      </button>
                  ))}
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center justify-between bg-dark-bg p-2 rounded-lg border border-gray-700">
                   <button 
                        onClick={() => { playClick(); setQuantity(Math.max(1, quantity - 1)); }}
                        className="p-2 bg-gray-800 rounded hover:bg-gray-700 text-white"
                   >
                       <Minus size={16} />
                   </button>
                   <div className="text-center">
                       <div className="text-xs text-gray-500 uppercase font-bold">Quantity</div>
                       <input 
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                            className="bg-transparent text-center font-bold text-white w-20 outline-none"
                       />
                   </div>
                   <button 
                        onClick={() => { playClick(); setQuantity(quantity + 1); }}
                        className="p-2 bg-gray-800 rounded hover:bg-gray-700 text-white"
                   >
                       <Plus size={16} />
                   </button>
              </div>
              
              {/* Multiplier Presets */}
              <div className="flex gap-2">
                  {[1, 5, 10, 20].map(mult => (
                      <button
                        key={mult}
                        onClick={() => { playClick(); setQuantity(mult); }}
                        className={clsx(
                            "flex-1 py-1 rounded text-xs font-bold border transition-colors",
                            quantity === mult 
                                ? "bg-gray-700 text-white border-gray-500" 
                                : "bg-transparent border-gray-700 text-gray-500 hover:bg-gray-800"
                        )}
                      >
                          x{mult}
                      </button>
                  ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setActiveSelection(null)}
                    className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-colors"
                  >
                      Cancel
                  </button>
                  <button 
                    onClick={handleConfirmBet}
                    disabled={!canAfford}
                    className={clsx(
                        "flex-[2] py-3 rounded-xl font-bold text-black transition-all shadow-lg flex items-center justify-center gap-2",
                        canAfford 
                            ? "bg-gradient-to-r from-primary to-yellow-500 hover:brightness-110 shadow-yellow-900/20" 
                            : "bg-gray-600 cursor-not-allowed opacity-70"
                    )}
                  >
                      Bet ₹{totalBetAmount}
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default BettingBoard;
