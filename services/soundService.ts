// Simple synth sound service using Web Audio API
// This avoids external dependencies/files and ensures offline functionality

const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
const ctx = new AudioContextClass();

const createOscillator = (type: OscillatorType, freq: number, duration: number, startTime: number) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  
  gain.gain.setValueAtTime(0.1, startTime);
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(startTime);
  osc.stop(startTime + duration);
};

export const playClick = () => {
  if (ctx.state === 'suspended') ctx.resume();
  const now = ctx.currentTime;
  createOscillator('sine', 800, 0.05, now);
};

export const playTick = () => {
  if (ctx.state === 'suspended') ctx.resume();
  const now = ctx.currentTime;
  // Woodblock sound
  createOscillator('triangle', 1200, 0.05, now);
  createOscillator('square', 800, 0.02, now);
};

export const playSuccess = () => {
  if (ctx.state === 'suspended') ctx.resume();
  const now = ctx.currentTime;
  // Ascending chime
  createOscillator('sine', 523.25, 0.1, now); // C5
  createOscillator('sine', 659.25, 0.1, now + 0.1); // E5
  createOscillator('sine', 783.99, 0.2, now + 0.2); // G5
};

export const playWin = () => {
  if (ctx.state === 'suspended') ctx.resume();
  const now = ctx.currentTime;
  // Major chord arpeggio
  createOscillator('triangle', 523.25, 0.1, now);
  createOscillator('triangle', 659.25, 0.1, now + 0.1);
  createOscillator('triangle', 783.99, 0.1, now + 0.2);
  createOscillator('triangle', 1046.50, 0.4, now + 0.3); // C6
};

export const playLoss = () => {
  if (ctx.state === 'suspended') ctx.resume();
  const now = ctx.currentTime;
  // Descending tone
  createOscillator('sawtooth', 300, 0.3, now);
  createOscillator('sawtooth', 200, 0.4, now + 0.2);
};

export const playError = () => {
  if (ctx.state === 'suspended') ctx.resume();
  const now = ctx.currentTime;
  createOscillator('sawtooth', 150, 0.2, now);
};