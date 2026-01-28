
import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Bot, Sparkles, X } from 'lucide-react';
import { GameResult, PredictionResponse } from '../types';
import { analyzeTrend } from '../services/geminiService';

interface PredictionBotProps {
  history: GameResult[];
}

// Forward ref to allow parent to open the bot
const PredictionBot = forwardRef<{ open: () => void }, PredictionBotProps>(({ history }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true)
  }));

  const handleAskAI = async () => {
    setLoading(true);
    setPrediction(null);
    try {
        const result = await analyzeTrend(history);
        setPrediction(result);
    } catch (e) {
        setPrediction({
            prediction: "Error",
            analysis: "Failed to fetch prediction",
            confidence: 0
        });
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-40 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-full shadow-2xl shadow-blue-500/30 hover:scale-105 transition-transform flex items-center gap-2 animate-bounce"
      >
        <Bot size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 fade-in">
        <div className="bg-gradient-to-r from-purple-800 to-blue-800 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-white font-bold">
                <Sparkles size={18} className="text-yellow-300" />
                Gemini Trend AI
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
                <X size={20} />
            </button>
        </div>

        <div className="p-5 min-h-[200px] flex flex-col justify-center text-gray-200">
            {loading ? (
                <div className="text-center space-y-3">
                    <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm animate-pulse">Analyzing history patterns...</p>
                </div>
            ) : prediction ? (
                <div className="space-y-4">
                    <div className="text-center">
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Recommended Move</p>
                        <p className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                            {prediction.prediction}
                        </p>
                    </div>
                    
                    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                        <p className="text-xs text-gray-400 mb-1">Reasoning</p>
                        <p className="text-sm leading-relaxed">{prediction.analysis}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Confidence</span>
                        <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-green-500 rounded-full" 
                                    style={{ width: `${prediction.confidence}%` }}
                                ></div>
                            </div>
                            <span>{prediction.confidence}%</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleAskAI}
                        className="w-full mt-2 py-2 text-xs font-bold text-blue-300 hover:text-blue-200 border border-blue-500/30 rounded hover:bg-blue-500/10 transition"
                    >
                        Regenerate
                    </button>
                </div>
            ) : (
                <div className="text-center space-y-4">
                    <p className="text-sm text-gray-400">
                        Let Gemini analyze the last 15 rounds to predict the next trend.
                    </p>
                    <button 
                        onClick={handleAskAI}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-900/50"
                    >
                        Analyze Now
                    </button>
                </div>
            )}
        </div>
    </div>
  );
});

export default PredictionBot;
