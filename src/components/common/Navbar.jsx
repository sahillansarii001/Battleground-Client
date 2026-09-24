"use client";

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    return '/panel/dashboard';
  };

  return (
    <div className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'top-4' : 'top-6'} px-4 sm:px-6 lg:px-8`}>
      <nav className={`max-w-7xl mx-auto transition-all duration-300 ${
        scrolled 
          ? 'bg-[#0B0D0F]/90 backdrop-blur-lg border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl py-2' 
          : 'bg-[#0B0D0F]/70 backdrop-blur-md border border-white/10 rounded-2xl py-3 shadow-lg'
      }`}>
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-black tracking-tight text-white flex items-center gap-3 group">
              <div className="w-8 h-8 bg-[#FF6A00] rounded flex items-center justify-center transform group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,106,0,0.4)]">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="hidden sm:block tracking-widest">BATTLEGROUNDS</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              <Link href="/" className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-bold transition-all uppercase tracking-wide">Home</Link>
              <Link href="/#matches" className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-bold transition-all uppercase tracking-wide">Matches</Link>
              <Link href="/#leaderboard" className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-bold transition-all uppercase tracking-wide">Leaderboard</Link>
              <Link href="/rules" className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-bold transition-all uppercase tracking-wide">Rules</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <>
                <Link href="/login" className="text-gray-300 hover:text-white text-sm font-bold transition-colors uppercase tracking-wide">Login</Link>
                <Link href="/register" className="bg-[#FF6A00] text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-[0_4px_14px_rgba(255,106,0,0.4)] hover:bg-[#ff7b1a] hover:shadow-[0_6px_20px_rgba(255,106,0,0.6)] hover:-translate-y-0.5 transition-all uppercase tracking-wide border border-[#FF6A00]/50">
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link href={getDashboardLink()} className="bg-white/10 text-white border border-white/20 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-white/20 transition-all uppercase tracking-wide">
                  Dashboard
                </Link>
                <button onClick={logout} className="text-gray-400 hover:text-[#FF6A00] text-sm font-bold transition-colors uppercase tracking-wide">
                  Logout
                </button>
              </>
            )}
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button onClick={toggleMenu} className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-[#FF6A00] focus:outline-none transition-all">
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute top-24 left-4 right-4 bg-[#0B0D0F]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link href="/" className="hover:bg-white/10 text-white block px-4 py-3 rounded-xl text-sm font-bold transition-colors uppercase tracking-wide" onClick={toggleMenu}>Home</Link>
            <Link href="/#matches" className="hover:bg-white/10 text-white block px-4 py-3 rounded-xl text-sm font-bold transition-colors uppercase tracking-wide" onClick={toggleMenu}>Matches</Link>
            <Link href="/#leaderboard" className="hover:bg-white/10 text-white block px-4 py-3 rounded-xl text-sm font-bold transition-colors uppercase tracking-wide" onClick={toggleMenu}>Leaderboard</Link>
            <Link href="/rules" className="hover:bg-white/10 text-white block px-4 py-3 rounded-xl text-sm font-bold transition-colors uppercase tracking-wide" onClick={toggleMenu}>Rules</Link>
            <div className="border-t border-white/10 pt-4 mt-4 space-y-3 px-2">
              {!user ? (
                <>
                  <Link href="/login" className="hover:bg-white/10 text-white block px-4 py-3 rounded-xl text-sm font-bold transition-colors uppercase tracking-wide" onClick={toggleMenu}>Login</Link>
                  <Link href="/register" className="bg-[#FF6A00] text-white block px-4 py-3 rounded-xl text-sm font-black text-center shadow-lg uppercase tracking-wide" onClick={toggleMenu}>Register</Link>
                </>
              ) : (
                <>
                  <Link href={getDashboardLink()} className="bg-white/10 border border-white/20 text-white block px-4 py-3 rounded-xl text-sm font-bold text-center uppercase tracking-wide" onClick={toggleMenu}>Dashboard</Link>
                  <button onClick={() => { logout(); toggleMenu(); }} className="hover:bg-red-500/20 hover:text-red-400 text-gray-400 w-full text-left block px-4 py-3 rounded-xl text-sm font-bold transition-colors uppercase tracking-wide">Logout</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
