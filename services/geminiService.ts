import { GoogleGenAI, Type } from "@google/genai";
import { GameResult, PredictionResponse } from '../types';

const getClient = () => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key is missing. AI features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeTrend = async (history: GameResult[]): Promise<PredictionResponse | null> => {
  const client = getClient();
  if (!client) return null;

  // Format history for the prompt
  const historyText = history.slice(0, 15).map(h => 
    `Period: ${h.periodId.slice(-4)}, Number: ${h.number}, Color: ${h.colors.join('+')}`
  ).join('\n');

  const prompt = `
    You are an AI advisor for a color prediction game simulation. 
    Analyze the following recent results (Period, Winning Number, Winning Color):
    
    ${historyText}

    Based on patterns (like streaks, alternations, or random distribution), predict the next likely outcome.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prediction: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            analysis: { type: Type.STRING },
          },
          required: ['prediction', 'confidence', 'analysis'],
        },
      },
    });
    
    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as PredictionResponse;
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return {
      prediction: "Analysis Failed",
      analysis: "Could not connect to AI advisor.",
      confidence: 0
    };
  }
};