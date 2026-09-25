"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import Link from 'next/link';
import { AlertOctagon, Terminal, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success) {
        await login(res.data.token, res.data);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
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
            <div className="w-10 h-10 bg-[#FF6A00] flex items-center justify-center transform skew-x-[-10deg]">
              <span className="text-black font-bold text-2xl transform skew-x-10">B</span>
            </div>
            <span className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest">BATTLEGROUNDS</span>
          </Link>
          
          <h1 className="font-rajdhani text-6xl font-bold text-white uppercase leading-[0.9] mt-20">
            Access<br/>Command<br/><span className="text-[#FF6A00]">Center.</span>
          </h1>
          <p className="font-inter text-[#B8C0C2] mt-6 max-w-sm">
            Authenticate to manage your squad, access classified tournament intelligence, and dominate the leaderboard.
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
        
        <div className="w-full max-w-md flex flex-col justify-center relative z-10">
          
          <div className="mb-8 shrink-0 flex items-center gap-3">
            <Terminal className="w-6 h-6 text-[#FF6A00]" />
            <h2 className="font-rajdhani text-3xl font-bold text-white uppercase tracking-widest">Squad Auth Protocol</h2>
          </div>

          {error && (
            <div className="bg-red-950/40 border-l-4 border-red-500 text-red-400 p-3 mb-6 shrink-0 flex items-center gap-3">
              <AlertOctagon className="h-4 w-4 shrink-0" />
              <span className="font-orbitron text-[10px] font-bold uppercase tracking-widest">{error}</span>
            </div>
          )}

          <div className="w-full bg-[#111518]/90 backdrop-blur-md border border-white/10 p-6 md:p-8 hud-border relative shadow-2xl shrink-0">
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              <div>
                <label className="block font-orbitron text-[9px] text-[#B8C0C2] tracking-widest uppercase mb-1">Comms Channel (Email)</label>
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
                    placeholder="ADMIN@SQUAD.COM"
                  />
                </div>
              </div>

              <div>
                <label className="block font-orbitron text-[9px] text-[#B8C0C2] tracking-widest uppercase mb-1">Access Code (Password)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-[#B8C0C2]" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-[#080A0C] border border-white/10 text-white font-inter text-sm focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00]"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#B8C0C2] hover:text-[#FF6A00] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/forgot-password" className="font-orbitron text-[9px] text-[#FF6A00] hover:text-white transition-colors tracking-widest uppercase">
                  Reset Access Code
                </Link>
              </div>

              <div className="pt-4 border-t border-white/5">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 bg-[#FF6A00] hover:bg-white text-black font-rajdhani text-xl font-bold uppercase tracking-widest transition-colors transform skew-x-[-10deg] shadow-[0_0_15px_rgba(255,106,0,0.4)] disabled:opacity-50"
                >
                  <span className="transform skew-x-10">{loading ? 'Authenticating...' : 'Establish Connection'}</span>
                </button>
              </div>
            </form>
            
            <div className="mt-6 pt-6 border-t border-white/5 text-center">
              <p className="font-inter text-xs text-[#B8C0C2]">
                Squad not registered?{' '}
                <Link href="/register" className="text-[#FF6A00] hover:text-white transition-colors font-bold uppercase tracking-widest ml-1">
                  Initialize deployment
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}