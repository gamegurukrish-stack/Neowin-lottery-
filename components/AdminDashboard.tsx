
import React, { useState } from 'react';
import { GameMode, AdminState, WithdrawalRequest, DepositRequest, UpiId, Feedback } from '../types';
import { MODE_CONFIG } from '../constants';
import clsx from 'clsx';
import { X, Check, DollarSign, Plus, Trash2, Image as ImageIcon, Gift, MessageSquare, Copy, Send } from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  adminState: AdminState;
  setRiggedResult: (mode: GameMode, value: number | 'BIG' | 'SMALL' | null) => void;
  onAddFunds: (amount: number) => void;
  withdrawalRequests: WithdrawalRequest[];
  onProcessWithdrawal: (id: string, approved: boolean) => void;
  depositRequests: DepositRequest[];
  onProcessDeposit: (id: string, approved: boolean) => void;
  onManageUpi: (action: 'add' | 'delete', data: any) => void;
  onManageAdminAccess: (action: 'add' | 'delete', phone: string) => void;
  onCreateGiftCode?: (code: string, amount: number) => void;
  onDeleteGiftCode?: (code: string) => void;
  feedbacks?: Feedback[];
  onResolveFeedback?: (id: string, replyMsg: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  isOpen, onClose, adminState, setRiggedResult, onAddFunds,
  withdrawalRequests, onProcessWithdrawal,
  depositRequests, onProcessDeposit, onManageUpi, onManageAdminAccess,
  onCreateGiftCode, onDeleteGiftCode, feedbacks = [], onResolveFeedback
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('30s');
  const [fundAmount, setFundAmount] = useState(1000);
  const [activeTab, setActiveTab] = useState<'game' | 'users' | 'finance' | 'settings' | 'gifts' | 'support'>('game');
  const [viewScreenshot, setViewScreenshot] = useState<string | null>(null);

  // New UPI Form State
  const [newUpiAddress, setNewUpiAddress] = useState('');
  const [newUpiLabel, setNewUpiLabel] = useState('');

  // New Admin Form State
  const [newAdminPhone, setNewAdminPhone] = useState('');

  // Gift Code State
  const [giftAmount, setGiftAmount] = useState(100);

  // Reply State
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleAddUpi = () => {
      if (newUpiAddress && newUpiLabel) {
          onManageUpi('add', { address: newUpiAddress, label: newUpiLabel });
          setNewUpiAddress('');
          setNewUpiLabel('');
      }
  };

  const handleAddAdmin = () => {
    if (newAdminPhone.length >= 10) {
        onManageAdminAccess('add', newAdminPhone);
        setNewAdminPhone('');
    }
  };

  const handleCreateGift = () => {
      if (onCreateGiftCode && giftAmount > 0) {
          const randomCode = 'NEO' + Math.random().toString(36).substring(2, 8).toUpperCase();
          onCreateGiftCode(randomCode, giftAmount);
      }
  };

  const handleReplySubmit = (id: string) => {
      if (onResolveFeedback && replyText[id]) {
          onResolveFeedback(id, replyText[id]);
          // Clear text
          const newReplies = { ...replyText };
          delete newReplies[id];
          setReplyText(newReplies);
      }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-gray-900 w-full max-w-2xl rounded-2xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative">
        
        {/* Screenshot Overlay */}
        {viewScreenshot && (
            <div className="absolute inset-0 z-[110] bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in">
                <button 
                    onClick={() => setViewScreenshot(null)}
                    className="absolute top-4 right-4 text-white bg-gray-800 p-2 rounded-full hover:bg-red-600 transition"
                >
                    <X size={24} />
                </button>
                <img src={viewScreenshot} alt="Payment Proof" className="max-w-full max-h-[80vh] object-contain rounded-lg border border-gray-700" />
            </div>
        )}

        {/* Header */}
        <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-red-500 flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                ADMIN CONTROL PANEL
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X size={24} />
            </button>
        </div>

        {/* Tab Nav */}
        <div className="flex bg-gray-800 border-b border-gray-700 overflow-x-auto">
            {[
                {id: 'game', label: 'Game Control'},
                {id: 'users', label: 'User Wallet'},
                {id: 'finance', label: 'Requests'},
                {id: 'gifts', label: 'Gift Codes'},
                {id: 'support', label: 'Support'},
                {id: 'settings', label: 'Settings'},
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={clsx(
                        "flex-1 py-3 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap",
                        activeTab === tab.id 
                            ? "border-red-500 text-red-400 bg-red-900/10" 
                            : "border-transparent text-gray-400 hover:text-gray-200"
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>

        <div className="p-6 overflow-y-auto flex-1">
            
            {/* 1. Game Control */}
            {activeTab === 'game' && (
                <section>
                    <div className="flex gap-2 mb-4 overflow-x-auto">
                        {(Object.keys(MODE_CONFIG) as GameMode[]).map(mode => (
                            <button
                                key={mode}
                                onClick={() => setSelectedMode(mode)}
                                className={clsx(
                                    "px-3 py-1 rounded text-sm font-bold border",
                                    selectedMode === mode ? "bg-red-500/20 text-red-400 border-red-500" : "border-gray-700 text-gray-500"
                                )}
                            >
                                {MODE_CONFIG[mode].label}
                            </button>
                        ))}
                    </div>

                    <div className="bg-black/40 p-4 rounded-xl border border-gray-800">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-300 text-sm">Next Result for {MODE_CONFIG[selectedMode].label}</span>
                            {adminState.riggedResults[selectedMode] !== null ? (
                                <span className="text-red-400 font-bold flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded text-xs">
                                    FORCED: {adminState.riggedResults[selectedMode]}
                                    <button onClick={() => setRiggedResult(selectedMode, null)} className="ml-2 hover:text-white"><X size={12}/></button>
                                </span>
                            ) : (
                                <span className="text-green-500 text-xs">RANDOM</span>
                            )}
                        </div>

                        {/* Force Big / Small Controls */}
                        <div className="flex gap-2 mb-4">
                            <button 
                                onClick={() => setRiggedResult(selectedMode, 'BIG')}
                                className={clsx(
                                    "flex-1 py-2 rounded font-bold transition-all text-sm uppercase tracking-wider",
                                    adminState.riggedResults[selectedMode] === 'BIG' 
                                    ? "bg-orange-600 text-white shadow-lg shadow-orange-900/50 ring-2 ring-orange-400" 
                                    : "bg-gray-800 text-orange-400 hover:bg-gray-700 border border-orange-500/30"
                                )}
                            >
                                Force Big
                            </button>
                            <button 
                                onClick={() => setRiggedResult(selectedMode, 'SMALL')}
                                className={clsx(
                                    "flex-1 py-2 rounded font-bold transition-all text-sm uppercase tracking-wider",
                                    adminState.riggedResults[selectedMode] === 'SMALL' 
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50 ring-2 ring-blue-400" 
                                    : "bg-gray-800 text-blue-400 hover:bg-gray-700 border border-blue-500/30"
                                )}
                            >
                                Force Small
                            </button>
                        </div>
                        
                        {/* Number Controls */}
                        <div className="grid grid-cols-5 gap-2">
                            {[0,1,2,3,4,5,6,7,8,9].map(num => (
                                <button
                                    key={num}
                                    onClick={() => setRiggedResult(selectedMode, num)}
                                    className={clsx(
                                        "aspect-square rounded flex items-center justify-center font-bold text-lg transition-all",
                                        adminState.riggedResults[selectedMode] === num 
                                            ? "bg-red-600 text-white shadow-lg shadow-red-900/50 scale-110" 
                                            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                                    )}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 2. User Wallet */}
            {activeTab === 'users' && (
                <section>
                    <div className="bg-black/40 p-4 rounded-xl border border-gray-800 flex items-center gap-4">
                        <div className="relative flex-1">
                            <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input 
                                type="number" 
                                value={fundAmount}
                                onChange={(e) => setFundAmount(Number(e.target.value))}
                                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg py-2 pl-9 pr-4 focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <button 
                            onClick={() => {
                                onAddFunds(fundAmount);
                                setFundAmount(0);
                            }}
                            className="bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                            <Check size={16} /> Add Funds to Me
                        </button>
                    </div>
                </section>
            )}

             {/* 3. Finance (Withdrawals & Deposits) */}
             {activeTab === 'finance' && (
                <div className="space-y-6">
                    {/* Deposits */}
                    <section>
                        <h3 className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-2">Pending Deposits</h3>
                        <div className="bg-black/40 p-2 rounded-xl border border-gray-800 max-h-48 overflow-y-auto">
                            {depositRequests.filter(r => r.status === 'PENDING').length === 0 ? (
                                <div className="text-gray-500 text-sm text-center py-4">No pending deposits</div>
                            ) : (
                                <div className="space-y-2">
                                    {depositRequests.map(req => (
                                        <div key={req.id} className={clsx("p-3 rounded flex justify-between items-center text-sm", req.status === 'PENDING' ? "bg-gray-800" : "opacity-50")}>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white font-bold text-lg">₹{req.amount}</span>
                                                    <span className="text-blue-400 text-xs font-mono bg-blue-900/20 px-1 rounded">{req.userId}</span>
                                                </div>
                                                <div className="text-gray-400 text-xs">UTR: <span className="text-white font-mono">{req.utr}</span></div>
                                                <div className="text-gray-500 text-[10px]">{new Date(req.date).toLocaleString()}</div>
                                            </div>
                                            
                                            {/* Proof Button */}
                                            {req.screenshot && (
                                                <button 
                                                    onClick={() => setViewScreenshot(req.screenshot!)}
                                                    className="mr-3 text-blue-400 hover:text-blue-300 p-2 bg-blue-900/20 rounded"
                                                    title="View Screenshot"
                                                >
                                                    <ImageIcon size={18} />
                                                </button>
                                            )}

                                            {req.status === 'PENDING' ? (
                                                <div className="flex gap-2">
                                                    <button onClick={() => onProcessDeposit(req.id, false)} className="p-2 bg-red-900/50 text-red-400 rounded hover:bg-red-900"><X size={14} /></button>
                                                    <button onClick={() => onProcessDeposit(req.id, true)} className="p-2 bg-green-900/50 text-green-400 rounded hover:bg-green-900"><Check size={14} /></button>
                                                </div>
                                            ) : (
                                                <span className="text-xs">{req.status}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Withdrawals */}
                    <section>
                        <h3 className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-2">Pending Withdrawals</h3>
                        <div className="bg-black/40 p-2 rounded-xl border border-gray-800 max-h-64 overflow-y-auto">
                            {withdrawalRequests.filter(r => r.status === 'PENDING').length === 0 ? (
                                <div className="text-gray-500 text-sm text-center py-4">No pending withdrawals</div>
                            ) : (
                                <div className="space-y-2">
                                    {withdrawalRequests.map(req => (
                                        <div key={req.id} className={clsx("p-3 rounded flex justify-between items-start text-sm", req.status === 'PENDING' ? "bg-gray-800" : "opacity-50")}>
                                            <div className="flex-1 min-w-0 mr-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-white font-bold text-lg">₹{req.amount}</span>
                                                    <span className="bg-blue-900/30 text-blue-300 text-[10px] px-1.5 py-0.5 rounded font-mono border border-blue-800/50">
                                                        {req.userId}
                                                    </span>
                                                </div>
                                                
                                                <div className="bg-black/30 p-2 rounded border border-gray-700 relative group">
                                                    <div className="text-gray-400 text-[10px] font-mono break-all leading-relaxed pr-6">
                                                        {req.bankDetails}
                                                    </div>
                                                    <button 
                                                        onClick={() => navigator.clipboard.writeText(req.bankDetails)}
                                                        className="absolute top-1 right-1 p-1 text-gray-500 hover:text-white bg-gray-800/50 rounded transition-colors"
                                                        title="Copy Details"
                                                    >
                                                        <Copy size={12} />
                                                    </button>
                                                </div>
                                                <div className="text-gray-600 text-[10px] mt-1 text-right">{new Date(req.date).toLocaleString()}</div>
                                            </div>
                                            
                                            {req.status === 'PENDING' ? (
                                                <div className="flex flex-col gap-2 mt-1">
                                                    <button onClick={() => onProcessWithdrawal(req.id, true)} className="p-2 bg-green-900/20 text-green-400 border border-green-900/50 rounded hover:bg-green-900/40 transition"><Check size={16} /></button>
                                                    <button onClick={() => onProcessWithdrawal(req.id, false)} className="p-2 bg-red-900/20 text-red-400 border border-red-900/50 rounded hover:bg-red-900/40 transition"><X size={16} /></button>
                                                </div>
                                            ) : (
                                                <span className={clsx("text-xs font-bold px-2 py-1 rounded mt-1", req.status === 'APPROVED' ? "bg-green-900/20 text-green-500" : "bg-red-900/20 text-red-500")}>
                                                    {req.status}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            )}

            {/* 4. Gift Codes (New) */}
            {activeTab === 'gifts' && (
                <section className="space-y-6">
                    <div>
                         <h3 className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-2">Create Gift Code</h3>
                         <div className="flex items-center gap-2">
                             <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                                <input 
                                    type="number"
                                    value={giftAmount}
                                    onChange={(e) => setGiftAmount(Number(e.target.value))}
                                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg py-2 pl-7 pr-4 focus:ring-2 focus:ring-purple-500 outline-none"
                                    placeholder="Amount"
                                />
                             </div>
                             <button 
                                onClick={handleCreateGift}
                                className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2"
                             >
                                 <Plus size={18} /> Generate
                             </button>
                         </div>
                    </div>

                    <div>
                        <h3 className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-2">Active Codes</h3>
                        <div className="space-y-2">
                             {adminState.giftCodes && adminState.giftCodes.map((gift, idx) => (
                                 <div key={idx} className="bg-gray-800 p-3 rounded flex justify-between items-center border border-gray-700">
                                     <div className="flex items-center gap-3">
                                         <div className="w-10 h-10 bg-purple-900/50 rounded flex items-center justify-center text-purple-300">
                                             <Gift size={20} />
                                         </div>
                                         <div>
                                             <div className="text-white font-mono font-bold tracking-wider">{gift.code}</div>
                                             <div className="text-green-400 text-xs font-bold">₹{gift.amount}</div>
                                         </div>
                                     </div>
                                     <button 
                                        onClick={() => onDeleteGiftCode && onDeleteGiftCode(gift.code)}
                                        className="text-red-500 hover:text-red-400 p-2 bg-red-900/10 rounded"
                                     >
                                         <Trash2 size={16} />
                                     </button>
                                 </div>
                             ))}
                             {(!adminState.giftCodes || adminState.giftCodes.length === 0) && (
                                 <div className="text-center py-6 text-gray-600 text-sm italic">
                                     No active gift codes. Create one above.
                                 </div>
                             )}
                        </div>
                    </div>
                </section>
            )}

            {/* 5. Support Feedbacks */}
            {activeTab === 'support' && (
                <section>
                    <h3 className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-2">User Feedbacks</h3>
                    <div className="space-y-3">
                        {feedbacks.length === 0 ? (
                            <div className="text-center py-10 text-gray-600 italic">No messages found.</div>
                        ) : (
                            feedbacks.map(msg => (
                                <div key={msg.id} className={clsx(
                                    "bg-gray-800 p-4 rounded-xl border border-gray-700 relative",
                                    msg.status === 'PENDING' ? "border-l-4 border-l-yellow-500" : "opacity-70"
                                )}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="text-xs text-gray-400 font-bold">{msg.userId}</div>
                                            <div className="text-[10px] text-gray-500">{new Date(msg.date).toLocaleString()}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            {msg.image && (
                                                <button 
                                                    onClick={() => setViewScreenshot(msg.image!)}
                                                    className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-blue-400"
                                                    title="View Image"
                                                >
                                                    <ImageIcon size={14} />
                                                </button>
                                            )}
                                            {msg.status === 'RESOLVED' && (
                                                <span className="text-[10px] bg-gray-700 text-gray-300 px-2 py-1 rounded">Resolved</span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <p className="text-sm text-gray-200 bg-black/20 p-2 rounded mb-2">
                                        {msg.message}
                                    </p>

                                    {/* Reply Section */}
                                    {msg.status === 'PENDING' && onResolveFeedback && (
                                        <div className="mt-2 flex gap-2">
                                            <input 
                                                type="text" 
                                                placeholder="Type reply..."
                                                value={replyText[msg.id] || ''}
                                                onChange={(e) => setReplyText(prev => ({...prev, [msg.id]: e.target.value}))}
                                                className="flex-1 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white outline-none focus:border-primary"
                                            />
                                            <button 
                                                onClick={() => handleReplySubmit(msg.id)}
                                                className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-500"
                                            >
                                                Reply
                                            </button>
                                        </div>
                                    )}
                                    
                                    {msg.reply && (
                                        <div className="mt-2 text-xs text-green-400 border-l-2 border-green-500 pl-2">
                                            <span className="font-bold">Admin:</span> {msg.reply}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </section>
            )}

            {/* 6. Settings (UPI & Admin Access) */}
            {activeTab === 'settings' && (
                <div className="space-y-8">
                     {/* UPI Section */}
                     <section>
                         <h3 className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-2">Manage Payment UPI</h3>
                         <div className="flex flex-col gap-2 mb-4">
                            <input 
                                type="text" 
                                placeholder="UPI Address (e.g. name@bank)"
                                value={newUpiAddress}
                                onChange={(e) => setNewUpiAddress(e.target.value)}
                                className="bg-gray-800 border border-gray-700 p-2 rounded text-white text-sm outline-none focus:border-primary"
                            />
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Label (e.g. Google Pay)"
                                    value={newUpiLabel}
                                    onChange={(e) => setNewUpiLabel(e.target.value)}
                                    className="flex-1 bg-gray-800 border border-gray-700 p-2 rounded text-white text-sm outline-none focus:border-primary"
                                />
                                <button 
                                    onClick={handleAddUpi}
                                    className="bg-primary text-black font-bold px-4 rounded hover:bg-yellow-500"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>

                         <div className="space-y-2">
                             {adminState.upiIds.map(upi => (
                                 <div key={upi.id} className="bg-gray-800 p-3 rounded flex justify-between items-center border border-gray-700">
                                     <div>
                                         <div className="text-white font-mono text-sm">{upi.address}</div>
                                         <div className="text-gray-500 text-xs">{upi.label}</div>
                                     </div>
                                     <button 
                                        onClick={() => onManageUpi('delete', { id: upi.id })}
                                        className="text-red-500 hover:text-red-400 p-2"
                                     >
                                         <Trash2 size={16} />
                                     </button>
                                 </div>
                             ))}
                             {adminState.upiIds.length === 0 && <div className="text-gray-600 text-sm italic">No active UPI IDs.</div>}
                         </div>
                    </section>

                    {/* Admin Access Section */}
                    <section>
                         <h3 className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-2 pt-4 border-t border-gray-800">Manage Admins</h3>
                         <div className="flex gap-2 mb-4">
                            <input 
                                type="text" 
                                placeholder="Add Admin Phone"
                                value={newAdminPhone}
                                onChange={(e) => setNewAdminPhone(e.target.value.replace(/\D/g, ''))}
                                className="flex-1 bg-gray-800 border border-gray-700 p-2 rounded text-white text-sm outline-none focus:border-blue-500"
                            />
                            <button 
                                onClick={handleAddAdmin}
                                className="bg-blue-600 text-white font-bold px-4 rounded hover:bg-blue-500"
                            >
                                <Plus size={18} />
                            </button>
                        </div>

                         <div className="space-y-2">
                             {adminState.allowedAdmins.map(phone => (
                                 <div key={phone} className="bg-gray-800 p-3 rounded flex justify-between items-center border border-gray-700">
                                     <div className="flex items-center gap-2">
                                         <span className="text-white font-mono text-sm">{phone}</span>
                                         {phone === '8477088145' && <span className="bg-red-900/50 text-red-200 text-[10px] px-1.5 py-0.5 rounded">MASTER</span>}
                                     </div>
                                     {phone !== '8477088145' && (
                                        <button 
                                            onClick={() => onManageAdminAccess('delete', phone)}
                                            className="text-red-500 hover:text-red-400 p-2"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                     )}
                                 </div>
                             ))}
                         </div>
                    </section>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
