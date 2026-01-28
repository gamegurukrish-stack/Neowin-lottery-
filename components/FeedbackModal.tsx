
import React, { useState } from 'react';
import { X, Send, MessageSquare, Image as ImageIcon, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import { Feedback } from '../types';
import clsx from 'clsx';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (message: string, image?: string) => void;
  history?: Feedback[];
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, onSubmit, history = [] }) => {
  const [activeTab, setActiveTab] = useState<'NEW' | 'HISTORY'>('NEW');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image too large. Max 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSubmitting(true);
    
    // Simulate processing delay
    setTimeout(() => {
        onSubmit(message, image || undefined);
        setMessage('');
        setImage(null);
        setIsSubmitting(false);
        setActiveTab('HISTORY'); // Switch to history to see the new pending item
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-card-bg w-full max-w-sm rounded-2xl border border-gray-700 shadow-2xl overflow-hidden relative animate-in zoom-in-95 flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center shrink-0">
                <h3 className="text-white font-bold flex items-center gap-2">
                    <MessageSquare size={18} className="text-primary" /> Help Center
                </h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white bg-black/20 p-1 rounded-full"><X size={20}/></button>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-900 p-1 shrink-0">
                <button 
                    onClick={() => setActiveTab('NEW')}
                    className={clsx(
                        "flex-1 py-2 text-xs font-bold rounded uppercase tracking-wider transition-colors",
                        activeTab === 'NEW' ? "bg-primary text-black" : "text-gray-500 hover:text-gray-300"
                    )}
                >
                    New Ticket
                </button>
                <button 
                    onClick={() => setActiveTab('HISTORY')}
                    className={clsx(
                        "flex-1 py-2 text-xs font-bold rounded uppercase tracking-wider transition-colors",
                        activeTab === 'HISTORY' ? "bg-primary text-black" : "text-gray-500 hover:text-gray-300"
                    )}
                >
                    My History
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'NEW' ? (
                    <form onSubmit={handleSubmit} className="p-4 space-y-4">
                        <div>
                            <p className="text-gray-400 text-xs mb-2">
                                Describe your issue clearly. You can attach a screenshot if related to payments.
                            </p>
                            <textarea 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full h-32 bg-dark-bg border border-gray-600 rounded-xl p-3 text-white text-sm focus:border-primary outline-none resize-none placeholder-gray-600"
                                placeholder="Type your message here..."
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <input 
                                type="file" 
                                accept="image/*"
                                id="feedback-image"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                            {image ? (
                                <div className="relative w-full h-32 bg-black/40 rounded-xl border border-gray-600 flex items-center justify-center overflow-hidden">
                                    <img src={image} alt="Preview" className="h-full object-contain" />
                                    <button 
                                        type="button"
                                        onClick={() => setImage(null)}
                                        className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 shadow-lg"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ) : (
                                <label 
                                    htmlFor="feedback-image"
                                    className="flex items-center justify-center w-full h-12 border border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-primary hover:bg-gray-800 transition text-gray-500 gap-2 text-sm"
                                >
                                    <ImageIcon size={18} /> Attach Image (Optional)
                                </label>
                            )}
                        </div>
                        
                        <div className="pt-2">
                            <button 
                                type="submit"
                                disabled={!message.trim() || isSubmitting}
                                className="w-full bg-primary text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-500 transition disabled:opacity-50"
                            >
                                {isSubmitting ? "Sending..." : <>Send Message <Send size={16}/></>}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="p-4 space-y-4">
                        {history.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 text-sm">
                                No feedback history found.
                            </div>
                        ) : (
                            history.map(item => (
                                <div key={item.id} className="bg-dark-bg border border-gray-700 rounded-xl p-3 space-y-3">
                                    {/* User Message */}
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                                <Clock size={10} /> {new Date(item.date).toLocaleString()}
                                            </span>
                                            <span className={clsx(
                                                "text-[10px] px-1.5 py-0.5 rounded font-bold",
                                                item.status === 'RESOLVED' ? "bg-green-900/30 text-green-400" : "bg-yellow-900/30 text-yellow-400"
                                            )}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-white">{item.message}</p>
                                        {item.image && (
                                            <div className="mt-2 rounded-lg overflow-hidden border border-gray-700">
                                                <img src={item.image} alt="Attachment" className="w-full h-32 object-cover" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Admin Reply */}
                                    {item.reply && (
                                        <div className="bg-gray-800/50 rounded-lg p-3 border-l-2 border-primary">
                                            <div className="text-[10px] text-primary font-bold mb-1 flex items-center gap-1">
                                                <CheckCircle2 size={10} /> Support Reply
                                            </div>
                                            <p className="text-xs text-gray-300">{item.reply}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default FeedbackModal;
