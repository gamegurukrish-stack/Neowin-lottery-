
import React, { useState } from 'react';
import { X, ArrowDownCircle, ArrowUpCircle, CreditCard, Landmark, Loader2, CheckCircle2, Copy, Image as ImageIcon, Upload, Grid, Lock } from 'lucide-react';
import clsx from 'clsx';
import { UpiId } from '../types';

interface WalletModalProps {
  isOpen: boolean;
  initialTab: 'recharge' | 'withdraw';
  currentBalance: number;
  adminUpiIds: UpiId[];
  onClose: () => void;
  onUpdateBalance: (amount: number, type: 'add' | 'subtract') => void;
  onRequestWithdrawal: (amount: number, bankDetails: string) => void;
  onRequestDeposit: (amount: number, utr: string, screenshot?: string) => void;
  hasDeposited: boolean;
}

const WalletModal: React.FC<WalletModalProps> = ({ 
  isOpen, initialTab, currentBalance, adminUpiIds, onClose, onUpdateBalance, onRequestWithdrawal, onRequestDeposit, hasDeposited
}) => {
  const [activeTab, setActiveTab] = useState<'recharge' | 'withdraw'>(initialTab);
  const [amount, setAmount] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  // Withdraw fields
  const [bankName, setBankName] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');

  // Deposit fields
  const [utr, setUtr] = useState('');
  const [selectedUpiIndex, setSelectedUpiIndex] = useState<number>(0);
  const [screenshot, setScreenshot] = useState<string | null>(null);

  if (!isOpen) return null;

  const depositAmounts = [100, 500, 1000, 2000, 5000, 10000, 20000, 50000];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setStatusMsg('UPI ID Copied!');
    setStatus('success');
    setTimeout(() => { setStatus('idle'); setStatusMsg(''); }, 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setStatus('error');
        setStatusMsg('Image size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDepositSubmit = async () => {
      if (!amount || Number(amount) < 100) {
        setStatus('error');
        setStatusMsg('Minimum deposit is ₹100');
        return;
      }
      if (utr.length < 4) {
          setStatus('error');
          setStatusMsg('Enter valid UTR/Ref No.');
          return;
      }

      setLoading(true);
      setTimeout(() => {
          onRequestDeposit(Number(amount), utr, screenshot || undefined);
          setLoading(false);
          setStatus('success');
          setStatusMsg('Deposit Request Submitted!');
          setTimeout(() => {
              onClose();
              resetForm();
          }, 2500);
      }, 1500);
  };

  const handleWithdrawSubmit = async () => {
    // 1. Check restriction
    if (!hasDeposited) {
        setStatus('error');
        setStatusMsg('Deposit required to activate withdrawals.');
        return;
    }
    
    // 2. Validate Amount
    if (!amount || Number(amount) < 110) {
      setStatus('error');
      setStatusMsg('Minimum withdrawal is ₹110');
      return;
    }
    if (Number(amount) > currentBalance) {
        setStatus('error');
        setStatusMsg('Insufficient balance');
        return;
    }

    // 3. Validate Details
    if (!bankName || !accountNo || !ifscCode || !accountHolderName) {
        setStatus('error');
        setStatusMsg('Please enter all bank details');
        return;
    }
    setLoading(true);
    
    setTimeout(() => {
      const details = `Name: ${accountHolderName} | Bank: ${bankName} | Acc: ${accountNo} | IFSC: ${ifscCode}`;
      onRequestWithdrawal(Number(amount), details);
      setStatus('success');
      setStatusMsg('Withdrawal Request Submitted!');
      setTimeout(() => {
        onClose();
        resetForm();
      }, 1500);
    }, 1500);
  };

  const resetForm = () => {
    setAmount('');
    setStatus('idle');
    setLoading(false);
    setBankName('');
    setAccountNo('');
    setIfscCode('');
    setAccountHolderName('');
    setUtr('');
    setScreenshot(null);
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-card-bg w-full max-w-md h-[95vh] sm:h-[90vh] rounded-t-3xl sm:rounded-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 border border-gray-700 flex flex-col">
        
        {/* Header */}
        <div className="p-4 flex justify-between items-center bg-gray-800 border-b border-gray-700 shrink-0">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <CreditCard size={20} className="text-primary" /> Wallet
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white bg-gray-700 p-1 rounded-full">
                <X size={20} />
            </button>
        </div>

        {/* Tabs */}
        <div className="flex p-2 bg-gray-900 gap-2 shrink-0">
            <button 
                onClick={() => { setActiveTab('recharge'); resetForm(); }}
                className={clsx(
                    "flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all",
                    activeTab === 'recharge' ? "bg-primary text-black" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                )}
            >
                <ArrowDownCircle size={18} /> Recharge
            </button>
            <button 
                onClick={() => { setActiveTab('withdraw'); resetForm(); }}
                className={clsx(
                    "flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all",
                    activeTab === 'withdraw' ? "bg-game-green text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                )}
            >
                <ArrowUpCircle size={18} /> Withdraw
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1">
            <div className="bg-gradient-to-r from-game-red to-orange-500 p-6 rounded-xl mb-6 text-center shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20"><Landmark size={80} color="white" /></div>
                <span className="text-red-100 text-xs uppercase tracking-wider font-bold relative z-10">Total Balance</span>
                <div className="text-4xl font-bold text-white mt-1 relative z-10">₹ {currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </div>

            {status !== 'idle' && (
                <div className={clsx(
                    "mb-4 p-3 rounded-lg text-center text-sm font-bold flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2",
                    status === 'success' ? "bg-green-900/30 text-green-400 border border-green-800" : "bg-red-900/30 text-red-400 border border-red-800"
                )}>
                    {status === 'success' && <CheckCircle2 size={16} />}
                    {statusMsg}
                </div>
            )}

            {activeTab === 'recharge' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    
                    {/* Amount Grid */}
                    <div>
                         <div className="flex items-center gap-2 text-primary font-bold mb-3 text-sm uppercase">
                            <Grid size={16} /> Select Amount
                         </div>
                         <div className="grid grid-cols-3 gap-3">
                            {depositAmounts.map(amt => (
                                <button 
                                    key={amt}
                                    onClick={() => setAmount(amt)}
                                    className={clsx(
                                        "py-3 rounded-lg border text-sm font-bold transition-all shadow-sm",
                                        amount === amt 
                                            ? "bg-primary text-black border-primary scale-105" 
                                            : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                                    )}
                                >
                                    ₹ {amt >= 1000 ? `${amt/1000}K` : amt}
                                </button>
                            ))}
                        </div>
                        <div className="relative mt-4">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                            <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full bg-dark-bg border border-gray-600 rounded-xl py-4 pl-8 pr-4 text-white focus:border-primary outline-none font-bold text-lg"
                                placeholder="Or enter custom amount"
                            />
                        </div>
                    </div>

                    {/* Step 2: Pay to UPI */}
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                        <label className="text-xs text-gray-400 font-bold uppercase mb-2 block">Payment Channel</label>
                        {adminUpiIds.length > 0 ? (
                            <div className="bg-dark-bg border border-gray-600 rounded-xl p-3 space-y-2">
                                <div className="text-xs text-gray-500 flex justify-between">
                                    <span>{adminUpiIds[selectedUpiIndex]?.label}</span>
                                    {adminUpiIds.length > 1 && (
                                        <button onClick={() => setSelectedUpiIndex(i => (i + 1) % adminUpiIds.length)} className="text-primary hover:underline">
                                            Change
                                        </button>
                                    )}
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-mono text-white text-sm break-all">{adminUpiIds[selectedUpiIndex]?.address}</span>
                                    <button 
                                        onClick={() => copyToClipboard(adminUpiIds[selectedUpiIndex]?.address)}
                                        className="text-primary p-2 hover:bg-primary/10 rounded-full"
                                    >
                                        <Copy size={18} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-red-400 text-xs">No payment methods available.</div>
                        )}
                    </div>

                    {/* Step 3: UTR & Screenshot */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-400 font-bold uppercase ml-1">UTR / Reference No.</label>
                            <input 
                                type="text"
                                value={utr}
                                onChange={(e) => setUtr(e.target.value)}
                                className="w-full mt-1 bg-dark-bg border border-gray-600 rounded-xl py-3 px-4 text-white focus:border-primary outline-none"
                                placeholder="Input 12-digit UTR"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-gray-400 font-bold uppercase ml-1">Payment Proof</label>
                            <div className="mt-1 relative">
                                 <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden" 
                                    id="payment-screenshot"
                                 />
                                 <label 
                                    htmlFor="payment-screenshot"
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-primary hover:bg-gray-800 transition-colors bg-dark-bg"
                                 >
                                    {screenshot ? (
                                        <div className="relative w-full h-full p-2">
                                            <img src={screenshot} alt="Preview" className="w-full h-full object-contain rounded" />
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">Change Image</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-500">
                                            <Upload size={24} className="mb-2" />
                                            <span className="text-xs font-bold">Upload Screenshot</span>
                                        </div>
                                    )}
                                 </label>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleDepositSubmit}
                        disabled={loading || !amount || !utr}
                        className="w-full bg-gradient-to-r from-primary to-orange-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-orange-900/20 active:scale-95 transition-all flex justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Submit Deposit"}
                    </button>
                </div>
            ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    {/* Restriction Notice */}
                    {!hasDeposited && (
                        <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-xl flex items-start gap-3">
                            <Lock className="text-red-500 shrink-0 mt-0.5" size={18} />
                            <div>
                                <h4 className="text-red-400 text-sm font-bold">Withdrawal Locked</h4>
                                <p className="text-gray-400 text-xs mt-1">
                                    You must make at least one successful deposit to activate withdrawals. 
                                </p>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-xs text-gray-400 font-bold uppercase ml-1">Withdraw Amount</label>
                        <div className="relative mt-1">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                            <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                disabled={!hasDeposited}
                                className="w-full bg-dark-bg border border-gray-600 rounded-xl py-3 pl-8 pr-4 text-white focus:border-game-green outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Enter amount"
                            />
                        </div>
                    </div>

                    <div className="bg-dark-bg p-4 rounded-xl border border-gray-700 space-y-3">
                        <div className="flex items-center gap-2 text-game-green text-sm font-bold mb-2">
                            <Landmark size={16} /> Bank Details
                        </div>
                        <input 
                            type="text" 
                            placeholder="Account Holder Name"
                            value={accountHolderName}
                            onChange={(e) => setAccountHolderName(e.target.value)}
                            disabled={!hasDeposited}
                            className="w-full bg-gray-800 border-b border-gray-600 py-2 px-1 text-sm text-white focus:border-game-green outline-none transition-colors disabled:opacity-50"
                        />
                        <input 
                            type="text" 
                            placeholder="Bank Name"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            disabled={!hasDeposited}
                            className="w-full bg-gray-800 border-b border-gray-600 py-2 px-1 text-sm text-white focus:border-game-green outline-none transition-colors disabled:opacity-50"
                        />
                         <input 
                            type="text" 
                            placeholder="Account Number"
                            value={accountNo}
                            onChange={(e) => setAccountNo(e.target.value)}
                            disabled={!hasDeposited}
                            className="w-full bg-gray-800 border-b border-gray-600 py-2 px-1 text-sm text-white focus:border-game-green outline-none transition-colors disabled:opacity-50"
                        />
                        <input 
                            type="text" 
                            placeholder="IFSC Code"
                            value={ifscCode}
                            onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                            disabled={!hasDeposited}
                            className="w-full bg-gray-800 border-b border-gray-600 py-2 px-1 text-sm text-white focus:border-game-green outline-none transition-colors disabled:opacity-50"
                        />
                    </div>

                    <button 
                        onClick={handleWithdrawSubmit}
                        disabled={loading || !hasDeposited}
                        className="w-full mt-4 bg-gradient-to-r from-game-green to-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-green-900/20 active:scale-95 transition-all flex justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                         {loading ? <Loader2 className="animate-spin" /> : "Withdraw Funds"}
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
