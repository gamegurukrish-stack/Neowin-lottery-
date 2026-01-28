
import React, { useState } from 'react';
import { Gift, X, Loader2, CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import { playSuccess, playError } from '../services/soundService';

interface GiftRedeemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRedeem: (code: string) => Promise<{ success: boolean; amount?: number; message?: string }>;
}

const GiftRedeemModal: React.FC<GiftRedeemModalProps> = ({ isOpen, onClose, onRedeem }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setResult(null);

    // Simulate network delay
    setTimeout(async () => {
        const res = await onRedeem(code.trim());
        setLoading(false);
        if (res.success) {
            playSuccess();
            setResult({ success: true, message: `Successfully received ₹${res.amount}` });
            setCode('');
        } else {
            playError();
            setResult({ success: false, message: res.message || 'Invalid Code' });
        }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-sm bg-card-bg rounded-2xl overflow-hidden border border-gray-700 shadow-2xl relative">
        <button 
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-white z-10"
        >
            <X size={20} />
        </button>

        <div className="bg-gradient-to-br from-purple-600 to-indigo-800 p-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md shadow-inner">
                <Gift size={40} className="text-white drop-shadow-lg" />
            </div>
            <h2 className="text-2xl font-bold text-white">Redeem Gift</h2>
            <p className="text-purple-200 text-xs mt-1">Enter the code sent by the admin</p>
        </div>

        <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Gift Code</label>
                    <input 
                        type="text" 
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter Code (e.g. NEO888)"
                        className="w-full mt-1 bg-dark-bg border border-gray-600 rounded-xl py-3 px-4 text-white focus:border-purple-500 outline-none transition-colors"
                    />
                </div>

                {result && (
                    <div className={clsx(
                        "p-3 rounded-lg text-sm flex items-center gap-2",
                        result.success ? "bg-green-900/20 text-green-400 border border-green-800" : "bg-red-900/20 text-red-400 border border-red-800"
                    )}>
                        {result.success && <CheckCircle size={16} />}
                        {result.message}
                    </div>
                )}

                <button 
                    type="submit"
                    disabled={loading || !code}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                    {loading ? <Loader2 className="animate-spin mx-auto" /> : "Receive"}
                </button>
            </form>
            
            <div className="mt-6 pt-4 border-t border-gray-800 text-center">
                <p className="text-[10px] text-gray-500">
                    Codes are case-sensitive. Contact support if you face issues.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GiftRedeemModal;
