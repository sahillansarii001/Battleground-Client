"use client";

import { useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertOctagon, Mail, KeyRound, Lock, CheckCircle2, Terminal, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const router = useRouter();
  
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('PLEASE ENTER A VALID EMAIL ADDRESS (E.G. @GMAIL.COM)');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.success) {
        setStep(2);
      }
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      if (res.success) {
        setStep(3);
      }
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      return setError('PASSWORDS DO NOT MATCH');
    }

    if (!/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
      return setError('PASSWORD MUST CONTAIN AT LEAST ONE CAPITAL LETTER, ONE NUMBER, AND ONE SPECIAL CHARACTER');
    }
    
    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', { email, otp, password });
      if (res.success) {
        setStep(4);
      }
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#080A0C] flex overflow-hidden selection:bg-[#FF6A00]/30 selection:text-[#FF6A00]">
      
      {/* LEFT SPLIT - BRANDING (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/3 relative bg-[#111518] flex-col justify-between p-12 border-r border-white/5 shadow-2xl z-20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="absolute top-1/4 right-[-20vw] w-[40vw] h-[40vw] bg-[#FF6A00]/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <img src="/BattlegroundLogo.png" alt="Battlegrounds" className="h-12 w-auto md:h-16 object-contain transform skew-x-[-10deg]" />
          </Link>
          
          <h1 className="font-rajdhani text-6xl font-bold text-white uppercase leading-[0.9] mt-20">
            Access<br/>Recovery<br/><span className="text-[#FF6A00]">Protocol.</span>
          </h1>
          <p className="font-inter text-[#B8C0C2] mt-6 max-w-sm">
            Lost your squad credentials? Follow the protocol to verify your identity and restore system access securely.
          </p>
        </div>

        <div className="relative z-10 font-orbitron text-[10px] text-[#B8C0C2] uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#FF6A00] animate-pulse"></span>
            System Online // Secure Connection
          </div>
        </div>
      </div>

      {/* RIGHT SPLIT - FORM AREA */}
      <div className="w-full lg:w-2/3 h-full relative flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 z-10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        
        <Link href="/login" className="absolute top-6 left-6 sm:top-8 sm:left-8 z-50 flex items-center gap-2 font-orbitron text-[10px] text-[#B8C0C2] hover:text-[#FF6A00] transition-colors uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Abort Recovery
        </Link>

        <div className="w-full max-w-md flex flex-col justify-center relative z-10 mt-8 lg:mt-0">
          
          <div className="mb-8 shrink-0 flex items-center gap-3">
            <Terminal className="w-6 h-6 text-[#FF6A00]" />
            <h2 className="font-rajdhani text-3xl font-bold text-white uppercase tracking-widest">Access Recovery</h2>
          </div>

          {error && (
            <div className="bg-red-950/40 border-l-4 border-red-500 text-red-400 p-3 mb-6 shrink-0 flex items-center gap-3">
              <AlertOctagon className="h-4 w-4 shrink-0" />
              <span className="font-orbitron text-[10px] font-bold uppercase tracking-widest">{error}</span>
            </div>
          )}

          <div className="w-full bg-[#111518]/90 backdrop-blur-md border border-white/10 p-6 md:p-8 hud-border relative shadow-2xl shrink-0">
            
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <label className="block font-orbitron text-[9px] text-[#B8C0C2] tracking-widest uppercase mb-1">Registered Comms (Email)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-[#B8C0C2]" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-[#080A0C] border border-white/10 text-white font-inter text-sm focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00]"
                      placeholder="SQUAD@DOMAIN.COM"
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/5">
                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full flex justify-center py-3 px-4 bg-[#FF6A00] hover:bg-white text-black font-rajdhani text-xl font-bold uppercase tracking-widest transition-colors transform skew-x-[-10deg] shadow-[0_0_15px_rgba(255,106,0,0.4)] disabled:opacity-50"
                  >
                    <span className="transform skew-x-10">{loading ? 'Transmitting...' : 'Send Verification Code'}</span>
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="block font-orbitron text-[9px] text-[#B8C0C2] tracking-widest uppercase mb-1">Verification Code (OTP)</label>
                  <p className="font-inter text-xs text-[#B8C0C2] mb-3">Enter the 6-digit code sent to <span className="text-white">{email}</span></p>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyRound className="h-4 w-4 text-[#B8C0C2]" />
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-[#080A0C] border border-white/10 text-[#FF6A00] font-orbitron text-center text-xl tracking-[0.5em] focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00]"
                      placeholder="••••••"
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/5">
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full flex justify-center py-3 px-4 bg-[#FF6A00] hover:bg-white text-black font-rajdhani text-xl font-bold uppercase tracking-widest transition-colors transform skew-x-[-10deg] shadow-[0_0_15px_rgba(255,106,0,0.4)] disabled:opacity-50"
                  >
                    <span className="transform skew-x-10">{loading ? 'Verifying...' : 'Validate Code'}</span>
                  </button>
                </div>
                <div className="text-center pt-2">
                  <button type="button" onClick={() => handleSendOtp(null)} className="font-orbitron text-[9px] text-[#FF6A00] hover:text-white uppercase tracking-widest transition-colors">
                    Resend Code
                  </button>
                  <p className="mt-4 text-[10px] text-[#B8C0C2] font-inter text-center">
                    Note: OTPs expire in 5 minutes. If the email doesn't appear in your inbox, please verify your spam or junk folder.
                  </p>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label className="block font-orbitron text-[9px] text-[#B8C0C2] tracking-widest uppercase mb-1">New Access Code (Password)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-[#B8C0C2]" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-[#080A0C] border border-white/10 text-white font-inter text-sm focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00]"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-orbitron text-[9px] text-[#B8C0C2] tracking-widest uppercase mb-1">Confirm Access Code</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-[#B8C0C2]" />
                    </div>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-[#080A0C] border border-white/10 text-white font-inter text-sm focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00]"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/5">
                  <button
                    type="submit"
                    disabled={loading || !password || !confirmPassword}
                    className="w-full flex justify-center py-3 px-4 bg-[#FF6A00] hover:bg-white text-black font-rajdhani text-xl font-bold uppercase tracking-widest transition-colors transform skew-x-[-10deg] shadow-[0_0_15px_rgba(255,106,0,0.4)] disabled:opacity-50"
                  >
                    <span className="transform skew-x-10">{loading ? 'Processing...' : 'Confirm Override'}</span>
                  </button>
                </div>
              </form>
            )}

            {step === 4 && (
              <div className="text-center space-y-6 py-4">
                <div className="mx-auto w-16 h-16 bg-[#080A0C] border border-[#FF6A00]/50 flex items-center justify-center rounded-full mb-4">
                  <CheckCircle2 className="w-8 h-8 text-[#FF6A00]" />
                </div>
                <h3 className="font-rajdhani text-2xl font-bold text-white uppercase">Override Successful</h3>
                <p className="font-inter text-sm text-[#B8C0C2]">Your new access code has been accepted by the system.</p>
                
                <div className="pt-4 border-t border-white/5">
                  <Link href="/login" className="block w-full text-center py-3 px-4 bg-[#FF6A00] hover:bg-white text-black font-rajdhani text-xl font-bold uppercase tracking-widest transition-colors transform skew-x-[-10deg] shadow-[0_0_15px_rgba(255,106,0,0.4)]">
                    <span className="transform skew-x-10 block">Return to Login</span>
                  </Link>
                </div>
              </div>
            )}

            {step < 4 && (
              <div className="mt-6 pt-6 border-t border-white/5 text-center">
                <Link href="/login" className="font-orbitron text-[10px] text-[#B8C0C2] hover:text-[#FF6A00] transition-colors uppercase tracking-widest">
                  {'< Abort Recovery'}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
