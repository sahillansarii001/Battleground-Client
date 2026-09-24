"use client";
import { useAuth } from '@/hooks/useAuth';
import { Target, Trophy, Swords, AlertOctagon, Activity } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-[#111518]/90 backdrop-blur-md border border-white/10 p-8 hud-border relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6A00]"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="font-rajdhani text-3xl font-bold text-white uppercase tracking-widest">
              Welcome back, <span className="text-[#FF6A00]">{user?.teamName || 'Commander'}</span>
            </h2>
            <p className="font-inter text-sm text-[#B8C0C2] mt-1">
              Your squad is currently <span className={user?.status === 'APPROVED' ? 'text-[#39B54A]' : 'text-yellow-500'}>{user?.status || 'PENDING'}</span>.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-[#080A0C] border border-white/10 px-4 py-2 font-orbitron text-[10px] tracking-widest text-[#B8C0C2] uppercase">
            <Activity className="w-4 h-4 text-[#FF6A00] animate-pulse" />
            System Online
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111518]/90 border border-white/10 p-6 flex items-center gap-4 hover:border-[#FF6A00]/50 transition-colors">
          <div className="w-12 h-12 bg-[#080A0C] border border-[#FF6A00]/30 flex items-center justify-center transform skew-x-[-10deg]">
            <Trophy className="w-6 h-6 text-[#FF6A00] transform skew-x-[10deg]" />
          </div>
          <div>
            <p className="font-orbitron text-[9px] text-[#B8C0C2] uppercase tracking-widest">Current Rank</p>
            <p className="font-rajdhani text-3xl font-bold text-white">#--</p>
          </div>
        </div>
        
        <div className="bg-[#111518]/90 border border-white/10 p-6 flex items-center gap-4 hover:border-[#FF6A00]/50 transition-colors">
          <div className="w-12 h-12 bg-[#080A0C] border border-[#FF6A00]/30 flex items-center justify-center transform skew-x-[-10deg]">
            <Swords className="w-6 h-6 text-[#FF6A00] transform skew-x-[10deg]" />
          </div>
          <div>
            <p className="font-orbitron text-[9px] text-[#B8C0C2] uppercase tracking-widest">Matches Played</p>
            <p className="font-rajdhani text-3xl font-bold text-white">0</p>
          </div>
        </div>

        <div className="bg-[#111518]/90 border border-white/10 p-6 flex items-center gap-4 hover:border-[#FF6A00]/50 transition-colors">
          <div className="w-12 h-12 bg-[#080A0C] border border-[#FF6A00]/30 flex items-center justify-center transform skew-x-[-10deg]">
            <Target className="w-6 h-6 text-[#FF6A00] transform skew-x-[10deg]" />
          </div>
          <div>
            <p className="font-orbitron text-[9px] text-[#B8C0C2] uppercase tracking-widest">Total Kills</p>
            <p className="font-rajdhani text-3xl font-bold text-white">0</p>
          </div>
        </div>
      </div>

      {/* Intelligence Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111518]/90 border border-white/10 p-6">
          <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Next Deployment</h3>
          <div className="bg-[#080A0C] border border-white/5 p-8 flex flex-col items-center justify-center text-center">
            <AlertOctagon className="w-10 h-10 text-[#B8C0C2] mb-3 opacity-50" />
            <p className="font-inter text-sm text-[#B8C0C2]">No upcoming matches scheduled.</p>
          </div>
        </div>

        <div className="bg-[#111518]/90 border border-white/10 p-6">
          <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Recent Intel</h3>
          <div className="bg-[#080A0C] border border-white/5 p-4 mb-3 border-l-2 border-[#FF6A00]">
            <p className="font-inter text-xs text-[#B8C0C2] mb-1">SYSTEM NOTIFICATION</p>
            <p className="font-rajdhani text-sm font-bold text-white uppercase">Squad Registration Received. Awaiting Admin Approval.</p>
          </div>
        </div>
      </div>
    </div>
  );
}