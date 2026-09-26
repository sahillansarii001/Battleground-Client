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
    <div className="w-full flex justify-center items-center p-4 sm:p-8 relative selection:bg-[#FF6A00]/30 selection:text-[#FF6A00] h-full z-10">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-[#FF6A00]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-lg relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-4 py-1 mb-6">
            <AlertOctagon className="w-4 h-4 text-red-500" />
            <span className="font-orbitron text-[11px] font-bold text-red-500 tracking-widest uppercase">Critical Protocol</span>
          </div>
          <h2 className="font-rajdhani text-4xl sm:text-5xl font-bold text-white uppercase tracking-widest text-center leading-none">
            Security <span className="text-[#FF6A00]">Update</span>
          </h2>
          <p className="font-inter text-[#B8C0C2] text-sm text-center mt-4 max-w-sm">
            Your current access code is compromised or temporary. Establish a secure connection key to proceed to the command center.
          </p>
        </div>

        {error && (
          <div className="bg-red-950/60 border border-red-500 text-red-400 p-4 mb-6 flex items-center gap-3 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <AlertOctagon className="h-5 w-5 shrink-0" />
            <span className="font-orbitron text-[10px] font-bold uppercase tracking-widest">{error}</span>
          </div>
        )}

        <div className="bg-[#111518]/80 backdrop-blur-xl border border-white/10 p-8 sm:p-10 relative hud-border shadow-[0_0_40px_rgba(0,0,0,0.8)] shrink-0">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block font-orbitron text-[10px] text-[#FF6A00] tracking-widest uppercase mb-2 font-bold">New Access Code</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#FF6A00] text-[#B8C0C2]">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-[#080A0C]/80 border border-white/10 text-white font-inter text-base focus:outline-none focus:border-[#FF6A00] focus:bg-[#080A0C] transition-all focus:shadow-[0_0_15px_rgba(255,106,0,0.2)]"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#B8C0C2] hover:text-[#FF6A00] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-orbitron text-[10px] text-[#FF6A00] tracking-widest uppercase mb-2 font-bold">Confirm Access Code</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#FF6A00] text-[#B8C0C2]">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-[#080A0C]/80 border border-white/10 text-white font-inter text-base focus:outline-none focus:border-[#FF6A00] focus:bg-[#080A0C] transition-all focus:shadow-[0_0_15px_rgba(255,106,0,0.2)]"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/5 mt-8">
              <button
                type="submit"
                disabled={loading || !password || !confirmPassword}
                className="w-full flex justify-center py-4 px-4 bg-[#FF6A00] hover:bg-white text-black font-rajdhani text-2xl font-bold uppercase tracking-widest transition-all transform skew-x-[-10deg] shadow-[0_0_20px_rgba(255,106,0,0.5)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] disabled:opacity-50 disabled:shadow-none hover:scale-[1.02]"
              >
                <span className="transform skew-x-10 flex items-center gap-3">
                  <Terminal className="w-6 h-6" />
                  {loading ? 'Processing...' : 'Secure Connection'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
