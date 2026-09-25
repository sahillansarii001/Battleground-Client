"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LayoutDashboard, Swords, Users, ShieldAlert, BookOpen, Settings, LogOut, Menu, X, Megaphone, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user || user.role !== 'ADMIN') return null;

  const navigation = [
    { name: 'Command Center', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Squads', href: '/admin/teams', icon: Users },
    { name: 'Matches', href: '/admin/matches', icon: Swords },
    { name: 'Scoreboard', href: '/admin/scores', icon: CheckCircle },
    { name: 'Intel', href: '/admin/announcements', icon: Megaphone },
    { name: 'Rulebook', href: '/admin/rules', icon: BookOpen },
    { name: 'System', href: '/admin/settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <>
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-white/10 bg-[#0B0D0F]">
        <ShieldAlert className="h-5 w-5 text-[#FF6A00] mr-3" />
        <span className="font-rajdhani text-2xl font-bold tracking-widest text-white uppercase">
          Admin <span className="text-[#FF6A00]">Core</span>
        </span>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6 bg-[#080A0C] relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        
        <div className="flex flex-col items-center mb-8 pb-6 border-b border-white/10 relative z-10">
          <div className="hud-border p-1 mb-3 bg-[#111518]">
            <div className="h-16 w-16 bg-[#FF6A00]/10 flex items-center justify-center">
              <span className="font-rajdhani text-[#FF6A00] font-bold text-2xl">AD</span>
            </div>
          </div>
          <span className="font-rajdhani text-white font-bold text-lg tracking-widest uppercase">{user.email?.split('@')[0]}</span>
          <span className="font-orbitron text-[#FF6A00] text-[9px] font-bold mt-2 uppercase px-3 py-1 border border-[#FF6A00]/30 tracking-widest">Global Admin</span>
        </div>
        
        <nav className="flex-1 space-y-2 relative z-10">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-x-3 p-3 font-rajdhani text-lg font-bold leading-6 transition-all uppercase tracking-widest transform skew-x-[-10deg] ${
                  isActive
                    ? 'bg-[#FF6A00] text-black shadow-[0_0_15px_rgba(255,106,0,0.3)]'
                    : 'bg-[#111518] text-[#B8C0C2] hover:bg-white hover:text-black border border-white/10'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <div className="transform skew-x-10 flex items-center gap-3 w-full">
                  <item.icon className={`h-5 w-5 shrink-0 transition-colors ${isActive ? 'text-black' : 'text-[#B8C0C2] group-hover:text-black'}`} aria-hidden="true" />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-4 border-t border-white/10 relative z-10">
          <button
            onClick={logout}
            className="group flex w-full items-center gap-x-3 p-3 font-rajdhani text-lg font-bold leading-6 bg-[#111518] text-[#B8C0C2] hover:bg-red-600 hover:text-white transition-colors uppercase tracking-widest transform skew-x-[-10deg] border border-white/10"
          >
            <div className="transform skew-x-10 flex items-center gap-3">
              <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
              Disconnect
            </div>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#0B0D0F] flex">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#080A0C] border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarOpen && (
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button type="button" className="ml-1 flex h-10 w-10 items-center justify-center bg-[#FF6A00] text-black font-bold focus:outline-none transform skew-x-[-10deg]" onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6 transform skew-x-10" aria-hidden="true" />
            </button>
          </div>
        )}
        <SidebarContent />
      </div>

      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-72 lg:flex-col lg:bg-[#080A0C] lg:border-r lg:border-white/10">
        <SidebarContent />
      </div>

      <div className="lg:pl-72 flex-1 flex flex-col min-w-0 bg-[#0B0D0F] relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
        
        <div className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/10 bg-[#0B0D0F]/90 backdrop-blur-md px-4 sm:gap-x-6 sm:px-6 lg:px-8">
          <button type="button" className="-m-2.5 p-2.5 text-[#B8C0C2] lg:hidden hover:text-[#FF6A00]" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center">
            <h1 className="font-rajdhani text-2xl font-bold leading-6 text-white uppercase tracking-widest hidden sm:block">
              <span className="text-[#FF6A00]">SYS //</span> {pathname.split('/').pop().replace('-', ' ')}
            </h1>
          </div>
        </div>

        <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}