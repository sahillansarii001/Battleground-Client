"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import Link from 'next/link';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export default function AdminLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/admin/login', { email, password });
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
    <div className="flex-1 flex flex-col justify-center items-center py-20 px-4 sm:px-6 lg:px-8 bg-[#F5F7F6]">
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center mb-4 shadow-md">
            <ShieldAlert className="w-8 h-8 text-[#FF6A00]" />
          </div>
          <h2 className="text-2xl font-black text-[#111315] tracking-widest uppercase">
            Admin Access
          </h2>
        </div>

        <div className="bg-white py-8 px-6 shadow-sm border border-[#E8ECEA] rounded-3xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-start gap-3 font-medium">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div>
              <label className="block text-xs font-black text-[#111315] mb-2 tracking-widest uppercase">Admin Email</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-[#E8ECEA] bg-[#F5F7F6] rounded-xl text-[#111315] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6A00] focus:bg-white transition-all sm:text-sm font-medium"
                  placeholder="admin@battelground.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#111315] mb-2 tracking-widest uppercase">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-[#E8ECEA] bg-[#F5F7F6] rounded-xl text-[#111315] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6A00] focus:bg-white transition-all sm:text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 rounded-xl shadow-md text-sm font-black text-white bg-[#0B0D0F] hover:bg-[#15181C] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B0D0F] disabled:opacity-50 transition-all uppercase tracking-widest"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </div>
          </form>
          
          <div className="mt-8 pt-6 border-t border-[#E8ECEA] text-center">
            <Link href="/" className="text-sm font-bold text-[#66706B] hover:text-[#111315] transition-colors">
              &larr; Return to public site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}