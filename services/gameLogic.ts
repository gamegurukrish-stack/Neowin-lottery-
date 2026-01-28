
import { Color, GameResult, GameMode, BetSelection } from '../types';
import { NUMBER_TO_COLOR_MAP, MODE_CONFIG } from '../constants';

export const generatePeriodId = (timestamp: number, mode: GameMode): string => {
  const date = new Date(timestamp);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  
  const totalMinutes = hours * 60 + minutes;
  const totalSeconds = totalMinutes * 60 + seconds;
  
  let issueNumber = 0;
  
  // Calculate issue number based on mode duration
  // We assume the day starts at 00:00:00
  const duration = MODE_CONFIG[mode].duration;
  issueNumber = Math.floor(totalSeconds / duration) + 1;

  const issueString = String(issueNumber).padStart(4, '0');
  
  return `${year}${month}${day}${issueString}`;
};

export const generateRandomResult = (periodId: string, mode: GameMode, riggedInput?: number | 'BIG' | 'SMALL' | null): GameResult => {
  let number: number;
  
  if (riggedInput === 'BIG') {
      // Random number 5-9
      number = Math.floor(Math.random() * 5) + 5;
      console.log(`[Admin] Rigged result for ${periodId}: BIG (${number})`);
  } else if (riggedInput === 'SMALL') {
      // Random number 0-4
      number = Math.floor(Math.random() * 5);
      console.log(`[Admin] Rigged result for ${periodId}: SMALL (${number})`);
  } else if (typeof riggedInput === 'number' && riggedInput >= 0 && riggedInput <= 9) {
    number = riggedInput;
    console.log(`[Admin] Rigged result for ${periodId}: ${number}`);
  } else {
    number = Math.floor(Math.random() * 10);
  }
  
  const colors = NUMBER_TO_COLOR_MAP[number];
  
  return {
    periodId,
    number,
    colors,
    price: Math.floor(Math.random() * 10000) + 40000,
    mode
  };
};

export const calculateWinnings = (selection: BetSelection, resultNumber: number, betAmount: number): number => {
  const resultColors = NUMBER_TO_COLOR_MAP[resultNumber];
  
  // Fee deduction
  const contractMoney = betAmount * 0.98; 
  
  // Number Betting
  if (typeof selection === 'number') {
    if (selection === resultNumber) {
      return contractMoney * 9;
    }
    return 0;
  }
  
  // Big/Small Betting
  if (selection === 'BIG') {
      return resultNumber >= 5 ? contractMoney * 2 : 0;
  }
  if (selection === 'SMALL') {
      return resultNumber <= 4 ? contractMoney * 2 : 0;
  }

  // Color Betting
  if (selection === Color.VIOLET) {
      if (resultColors.includes(Color.VIOLET)) {
          return contractMoney * 4.5;
      }
  } else if (selection === Color.GREEN) {
      if (resultColors.includes(Color.GREEN)) {
          return resultColors.includes(Color.VIOLET) ? contractMoney * 1.5 : contractMoney * 2;
      }
  } else if (selection === Color.RED) {
      if (resultColors.includes(Color.RED)) {
          return resultColors.includes(Color.VIOLET) ? contractMoney * 1.5 : contractMoney * 2;
      }
  }
  return 0;
};
