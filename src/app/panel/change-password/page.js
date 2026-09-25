"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { AlertOctagon, Lock, Terminal, Eye, EyeOff } from 'lucide-react';

export default function ChangePassword() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
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
      const res = await api.put('/auth/change-password', { password });
      if (res.success) {
        // Update user state and redirect
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          storedUser.mustChangePassword = false;
          localStorage.setItem('user', JSON.stringify(storedUser));
        }
        await refreshUser();
        router.push('/panel/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080A0C] flex flex-col items-center justify-center p-4 sm:p-8 relative selection:bg-[#FF6A00]/30 selection:text-[#FF6A00]">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 shrink-0 flex items-center justify-center gap-3">
          <Terminal className="w-6 h-6 text-[#FF6A00]" />
          <h2 className="font-rajdhani text-3xl font-bold text-white uppercase tracking-widest text-center">Security Update Required</h2>
        </div>

        <p className="font-inter text-[#B8C0C2] text-sm text-center mb-8">
          You are using a temporary or compromised access code. You must establish a secure permanent code before accessing the command center.
        </p>

        {error && (
          <div className="bg-red-950/40 border-l-4 border-red-500 text-red-400 p-3 mb-6 shrink-0 flex items-center gap-3">
            <AlertOctagon className="h-4 w-4 shrink-0" />
            <span className="font-orbitron text-[10px] font-bold uppercase tracking-widest">{error}</span>
          </div>
        )}

        <div className="bg-[#111518]/90 backdrop-blur-md border border-white/10 p-6 md:p-8 hud-border shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block font-orbitron text-[9px] text-[#B8C0C2] tracking-widest uppercase mb-1">New Access Code (Password)</label>
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

            <div>
              <label className="block font-orbitron text-[9px] text-[#B8C0C2] tracking-widest uppercase mb-1">Confirm Access Code</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#B8C0C2]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-[#080A0C] border border-white/10 text-white font-inter text-sm focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00]"
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
                <span className="transform skew-x-10">{loading ? 'Processing...' : 'Secure Connection'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
