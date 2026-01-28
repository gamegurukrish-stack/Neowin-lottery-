
import React, { useState } from 'react';
import { MessageSquare, ArrowRight, Loader2, Smartphone, Gift, Mail, Lock, AlertCircle, Chrome } from 'lucide-react';
import { mockSendOTP, mockVerifyOTP } from '../services/mockApi';
import clsx from 'clsx';

interface AuthFormProps {
  onLogin: (identifier: string, referralCode?: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [loginMethod, setLoginMethod] = useState<'PHONE' | 'EMAIL'>('PHONE');

  // Phone State
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSentMsg, setOtpSentMsg] = useState('');

  // Email State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login and Sign Up

  // Background Image (Red Car Aesthetic - Neon Rain)
  const BG_IMAGE_URL = "https://images.hdqwalls.com/wallpapers/audi-rs-e-tron-gt-neon-red-rain-4k-yj.jpg";

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
    // Reset OTP state if phone changes
    if (showOtp) {
        setShowOtp(false);
        setOtp('');
        setError('');
        setOtpSentMsg('');
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
        setError('Please enter a valid 10-digit mobile number');
        return;
    }
    setLoading(true);
    setError('');
    
    try {
        await mockSendOTP(phone);
        setShowOtp(true);
        // UX Helper for Simulation
        setOtpSentMsg('OTP sent via SMS & WhatsApp: 123456');
        setOtp('123456');
    } catch (e) {
        setError('Failed to send OTP. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
        setError('Please enter valid OTP');
        return;
    }
    setLoading(true);
    setError('');

    try {
        await mockVerifyOTP(phone, otp);
        onLogin(phone, referralCode);
    } catch (e) {
        setError('Invalid OTP. Try 123456.');
    } finally {
        setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email || !password) {
          setError('Please fill in all fields');
          return;
      }
      setLoading(true);
      setError('');

      // Simulation delay
      setTimeout(() => {
          setLoading(false);
          
          if (isSignUp) {
              // Sign Up Logic: Allow any new registration for demo
              onLogin(email, referralCode);
          } else {
              // Login Logic: Check admin or fail
              // Hardcoded Admin Logic
              if (email === 'gamegurukrish@gmail.com' && password === '06/03/2007') {
                  onLogin(email);
              } else {
                  setError('Invalid Email or Password. Try Sign Up?');
              }
          }
      }, 1500);
  };

  const handleGoogleLogin = () => {
      setLoading(true);
      setError('');
      // Simulate Google Login
      setTimeout(() => {
          setLoading(false);
          onLogin('google_user@gmail.com', referralCode);
      }, 1500);
  };

  return (
    <div 
        className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
        style={{ backgroundImage: `url('${BG_IMAGE_URL}')` }}
    >
      {/* Dark Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      
      <div className="relative w-full max-w-md bg-dark-bg/90 border border-gray-700 rounded-3xl p-8 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-orange-600"></div>
        
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">NEOWIN</h1>
            <p className="text-gray-400">Premium Prediction Gaming</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-800 rounded-lg p-1 mb-6">
            <button 
                type="button"
                onClick={() => { setLoginMethod('PHONE'); setError(''); }}
                className={clsx(
                    "flex-1 py-2 text-sm font-bold rounded-md transition-all flex items-center justify-center gap-2",
                    loginMethod === 'PHONE' ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white"
                )}
            >
                <Smartphone size={16} /> Mobile Number
            </button>
            <button 
                type="button"
                onClick={() => { setLoginMethod('EMAIL'); setError(''); }}
                className={clsx(
                    "flex-1 py-2 text-sm font-bold rounded-md transition-all flex items-center justify-center gap-2",
                    loginMethod === 'EMAIL' ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white"
                )}
            >
                <Mail size={16} /> Email / Google
            </button>
        </div>

        {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm flex items-center gap-2 animate-pulse">
                <AlertCircle size={16} className="shrink-0" />
                <span className="font-bold">{error}</span>
            </div>
        )}
        
        {otpSentMsg && !error && (
             <div className="mb-4 p-3 bg-green-900/30 border border-green-800 rounded-lg text-green-400 text-sm flex items-center gap-2 animate-in fade-in">
                <MessageSquare size={16} className="shrink-0" />
                <span className="font-bold">{otpSentMsg}</span>
            </div>
        )}

        {/* Phone Login Form */}
        {loginMethod === 'PHONE' && (
            <form onSubmit={showOtp ? handlePhoneLogin : handleSendOTP} className="space-y-4">
                <div className="space-y-4">
                    <div className="bg-black/30 border border-gray-700 rounded-xl p-3 flex items-center gap-3">
                        <Smartphone className="text-gray-400" size={20} />
                        <div className="flex-1">
                            <label className="block text-[10px] text-gray-500 font-bold uppercase">Mobile Number</label>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-bold">+91</span>
                                <input 
                                    type="tel" 
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    className="bg-transparent text-white font-bold outline-none w-full placeholder-gray-600"
                                    placeholder="Enter mobile number"
                                    disabled={showOtp}
                                />
                            </div>
                            
                            {!showOtp && (
                                <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-green-500 font-medium animate-in fade-in">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                    </svg>
                                    OTP sent via SMS & WhatsApp
                                </div>
                            )}
                        </div>
                    </div>

                    {showOtp && (
                        <>
                            <div className="bg-black/30 border border-gray-700 rounded-xl p-3 flex items-center gap-3 animate-in fade-in slide-in-from-right">
                                <MessageSquare className="text-gray-400" size={20} />
                                <div className="flex-1">
                                    <label className="block text-[10px] text-gray-500 font-bold uppercase">OTP Code</label>
                                    <input 
                                        type="text" 
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="bg-transparent text-white font-bold outline-none w-full placeholder-gray-600"
                                        placeholder="Enter 6-digit OTP"
                                        autoFocus
                                    />
                                </div>
                            </div>
                            
                            <div className="bg-black/30 border border-gray-700 rounded-xl p-3 flex items-center gap-3 animate-in fade-in slide-in-from-right delay-100">
                                <Gift className="text-gray-400" size={20} />
                                <div className="flex-1">
                                    <label className="block text-[10px] text-gray-500 font-bold uppercase">Referral Code (Optional)</label>
                                    <input 
                                        type="text" 
                                        value={referralCode}
                                        onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                                        className="bg-transparent text-white font-bold outline-none w-full placeholder-gray-600"
                                        placeholder="Enter code"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-yellow-500 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" /> : (
                        <>
                            {showOtp ? "Login to Neowin" : "Get Verification Code"} <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </form>
        )}

        {/* Email / Google Login Form */}
        {loginMethod === 'EMAIL' && (
            <div className="space-y-4">
                 {/* Google Button */}
                 <button 
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition shadow-lg disabled:opacity-70 active:scale-95"
                >
                    {/* Simple Google G Icon simulated with text or basic svg if not importing assets */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    {loading ? "Connecting..." : "Continue with Google"}
                </button>

                <div className="flex items-center gap-4">
                    <div className="h-px bg-gray-700 flex-1"></div>
                    <span className="text-gray-500 text-[10px] font-bold tracking-widest">OR {isSignUp ? 'REGISTER' : 'LOGIN'} WITH EMAIL</span>
                    <div className="h-px bg-gray-700 flex-1"></div>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-4">
                    <div className="bg-black/30 border border-gray-700 rounded-xl p-3 flex items-center gap-3">
                        <Mail className="text-gray-400" size={20} />
                        <div className="flex-1">
                            <label className="block text-[10px] text-gray-500 font-bold uppercase">Email Address</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-transparent text-white font-bold outline-none w-full placeholder-gray-600"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div className="bg-black/30 border border-gray-700 rounded-xl p-3 flex items-center gap-3">
                        <Lock className="text-gray-400" size={20} />
                        <div className="flex-1">
                            <label className="block text-[10px] text-gray-500 font-bold uppercase">Password</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-transparent text-white font-bold outline-none w-full placeholder-gray-600"
                                placeholder="Enter password"
                            />
                        </div>
                    </div>

                    {isSignUp && (
                        <div className="bg-black/30 border border-gray-700 rounded-xl p-3 flex items-center gap-3 animate-in fade-in">
                            <Gift className="text-gray-400" size={20} />
                            <div className="flex-1">
                                <label className="block text-[10px] text-gray-500 font-bold uppercase">Referral Code (Optional)</label>
                                <input 
                                    type="text" 
                                    value={referralCode}
                                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                                    className="bg-transparent text-white font-bold outline-none w-full placeholder-gray-600"
                                    placeholder="Enter code"
                                />
                            </div>
                        </div>
                    )}

                    <button 
                        type="submit"
                        disabled={loading}
                        className={clsx(
                            "w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50",
                            isSignUp ? "bg-game-green hover:bg-green-600 text-white" : "bg-primary hover:bg-yellow-500 text-black"
                        )}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (
                            <>
                                {isSignUp ? "Create Account" : "Login Securely"} <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                    
                    <div className="text-center pt-2">
                         <p className="text-sm text-gray-400">
                             {isSignUp ? "Already have an account?" : "Don't have an account?"}
                             <button 
                                 type="button"
                                 onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                                 className="ml-2 text-primary font-bold hover:underline"
                             >
                                 {isSignUp ? "Login" : "Sign Up"}
                             </button>
                         </p>
                    </div>
                </form>
            </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
