import React, { useState } from 'react';
import { X, Gift } from 'lucide-react';
import clsx from 'clsx';

interface BonusModalProps {
  onClose: () => void;
  onDeposit: () => void;
}

const BonusModal: React.FC<BonusModalProps> = ({ onClose, onDeposit }) => {
  const [active, setActive] = useState(true);

  if (!active) return null;

  const handleClose = () => {
      setActive(false);
      onClose();
  };

  const bonuses = [
      { deposit: 5000, bonus: 488 },
      { deposit: 1000, bonus: 168 },
      { deposit: 500, bonus: 108 },
      { deposit: 300, bonus: 48 },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-white rounded-2xl overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-game-red p-4 text-center relative">
             <h2 className="text-white font-bold text-xl">Extra first deposit bonus</h2>
             <p className="text-red-100 text-xs mt-1">Each account can only receive rewards once</p>
             <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white z-10">
                 <Gift size={32} className="text-game-red" />
             </div>
        </div>

        {/* Content */}
        <div className="pt-10 pb-6 px-4 space-y-3 bg-gray-50 max-h-[60vh] overflow-y-auto">
            {bonuses.map((item, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center mb-2 relative z-10">
                        <span className="text-sm font-bold text-gray-700">First deposit <span className="text-primary">{item.deposit}</span></span>
                        <span className="text-sm font-bold text-game-red">+{item.bonus}.00</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mb-3 relative z-10">
                        Deposit {item.deposit} for the first time and you will receive {item.bonus} bonus
                    </p>
                    <div className="flex gap-2 items-center relative z-10">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-0 h-full bg-primary"></div>
                        </div>
                        <button 
                            onClick={onDeposit}
                            className="text-xs border border-primary text-primary px-3 py-1 rounded-full hover:bg-primary hover:text-white transition"
                        >
                            Deposit
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-gray-100 flex justify-center">
            <button 
                onClick={handleClose}
                className="bg-game-red text-white w-full py-3 rounded-full font-bold shadow-lg shadow-red-500/30 hover:bg-red-700 transition"
            >
                Activity Details
            </button>
        </div>

        <button 
            onClick={handleClose}
            className="absolute top-2 right-2 text-white/80 hover:text-white bg-black/10 rounded-full p-1"
        >
            <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default BonusModal;