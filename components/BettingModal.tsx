
import React, { useState } from 'react';
import { Color, BetSelection } from '../types';
import clsx from 'clsx';
import { playClick } from '../services/soundService';
import { Minus, Plus } from 'lucide-react';

interface BettingModalProps {
  selection: BetSelection | null;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  balance: number;
}

const BettingModal: React.FC<BettingModalProps> = ({ selection, onClose, onConfirm, balance }) => {
  // New Logic: Base Unit (1, 10, 100, 1000) * Quantity
  const [baseUnit, setBaseUnit] = useState<number>(10);
  const [quantity, setQuantity] = useState<number>(1);

  if (selection === null) return null;

  const totalAmount = baseUnit * quantity;
  const canAfford = totalAmount > 0 && totalAmount <= balance;

  const baseUnits = [1, 10, 100, 1000];
  const quickMultipliers = [1, 5, 10, 20, 50, 100];

  const handleBaseUnitChange = (val: number) => {
    playClick();
    setBaseUnit(val);
  };

  const handleQuantityChange = (val: number) => {
    playClick();
    setQuantity(Math.max(1, val));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0) {
        setQuantity(val);
    } else if (e.target.value === '') {
        setQuantity(1); // Default to 1 if empty
    }
  };

  let selectionLabel = '';
  let selectionColorClass = '';
  let selectionBgClass = '';

  if (typeof selection === 'number') {
      selectionLabel = `Select Number ${selection}`;
      selectionColorClass = 'text-blue-500';
      selectionBgClass = 'bg-blue-600';
  } else if (selection === 'BIG') {
      selectionLabel = 'Select Big';
      selectionColorClass = 'text-orange-500';
      selectionBgClass = 'bg-orange-500';
  } else if (selection === 'SMALL') {
      selectionLabel = 'Select Small';
      selectionColorClass = 'text-blue-500';
      selectionBgClass = 'bg-blue-500';
  } else {
      selectionLabel = `Join ${selection}`;
      if (selection === Color.GREEN) {
          selectionColorClass = 'text-game-green';
          selectionBgClass = 'bg-game-green';
      } else if (selection === Color.RED) {
          selectionColorClass = 'text-game-red';
          selectionBgClass = 'bg-game-red';
      } else {
          selectionColorClass = 'text-game-violet';
          selectionBgClass = 'bg-game-violet';
      }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl flex flex-col animate-in slide-in-from-bottom duration-300 overflow-hidden shadow-2xl"
        style={{ maxHeight: '85vh' }}
      >
        
        {/* Header - Fixed */}
        <div className={clsx("p-4 text-center relative text-white transition-colors duration-300 shrink-0 shadow-md z-10", selectionBgClass)}>
          <div className="font-bold text-lg uppercase tracking-wider">{selectionLabel}</div>
          <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/10 rounded-full p-1.5 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-5 space-y-5 text-gray-800 bg-white overflow-y-auto flex-1 custom-scrollbar">
            
            {/* 1. Contract Money (Base Unit) */}
            <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Contract Money</p>
                <div className="flex gap-2">
                    {baseUnits.map(unit => (
                        <button 
                            key={unit}
                            onClick={() => handleBaseUnitChange(unit)}
                            className={clsx(
                                "flex-1 py-2 rounded-lg font-bold transition-all text-sm shadow-sm border",
                                baseUnit === unit 
                                    ? clsx("text-white border-transparent shadow-md scale-105", selectionBgClass)
                                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                            )}
                        >
                            {unit}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. Number (Quantity) */}
             <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Number</p>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 flex-1">
                        <button 
                            onClick={() => handleQuantityChange(quantity - 1)}
                            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition active:scale-90 shadow-sm border border-gray-200"
                        >
                            <Minus size={18} strokeWidth={3} />
                        </button>
                        
                        <div className="flex-1 relative">
                            <input 
                                type="number" 
                                value={quantity}
                                onChange={handleInputChange}
                                className="w-full text-center font-bold text-xl bg-gray-50 border border-gray-200 rounded-lg py-2 focus:border-primary outline-none transition-all"
                            />
                        </div>

                        <button 
                            onClick={() => handleQuantityChange(quantity + 1)}
                            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition active:scale-90 shadow-sm border border-gray-200"
                        >
                            <Plus size={18} strokeWidth={3} />
                        </button>
                    </div>
                </div>
                
                {/* Quick Multipliers */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pt-3 pb-1">
                    {quickMultipliers.map(mult => (
                        <button 
                            key={mult}
                            onClick={() => handleQuantityChange(mult)}
                            className={clsx(
                                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-w-[40px] border",
                                quantity === mult 
                                    ? clsx("text-white border-transparent shadow-sm", selectionBgClass) 
                                    : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                            )}
                        >
                            x{mult}
                        </button>
                    ))}
                 </div>
            </div>

            {/* Terms */}
            <div className="flex items-center gap-2 pt-1 group cursor-pointer" onClick={() => {}}>
                <div className={clsx("w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors", selectionBgClass)}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <p className="text-xs text-gray-500 font-medium group-hover:text-gray-700">I agree to the PRE-SALE RULE.</p>
            </div>
            
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-20 shrink-0 pb-6 sm:pb-4">
            <button 
                onClick={onClose} 
                className="flex-1 py-3 text-gray-600 font-bold bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition active:scale-95 shadow-sm"
            >
                Cancel
            </button>
            <button 
                onClick={() => canAfford && onConfirm(totalAmount)}
                disabled={!canAfford}
                className={clsx(
                    "flex-[2] py-3 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95",
                    canAfford ? clsx("hover:shadow-xl hover:brightness-110", selectionBgClass) : "bg-gray-300 cursor-not-allowed"
                )}
            >
                <span className="text-sm">Bet ₹{totalAmount}</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default BettingModal;
