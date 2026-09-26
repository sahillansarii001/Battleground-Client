"use client";
import { useAuth } from '@/hooks/useAuth';
import { Users, Shield, Target } from 'lucide-react';

export default function Team() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Team Header */}
      <div className="bg-[#111518]/90 border border-white/10 p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#FF6A00]/5 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="w-32 h-32 bg-[#080A0C] border border-[#FF6A00]/30 p-2 transform skew-x-[-5deg] relative z-10 shrink-0">
          <div className="w-full h-full bg-[#111518] flex items-center justify-center overflow-hidden transform skew-x-[5deg]">
            {user?.logo?.url ? (
              <img src={user.logo.url} alt="Team Logo" className="w-full h-full object-cover" />
            ) : (
              <Shield className="w-12 h-12 text-[#B8C0C2] opacity-30" />
            )}
          </div>
        </div>

        <div className="text-center md:text-left relative z-10">
          <span className="font-orbitron text-[10px] text-[#FF6A00] uppercase tracking-widest border border-[#FF6A00]/30 px-2 py-1 mb-3 inline-block bg-[#FF6A00]/10">
            {user?.teamType || 'Squad'} Operation
          </span>
          <h2 className="font-rajdhani text-4xl font-bold text-white uppercase tracking-widest">{user?.teamName || 'UNKNOWN SQUAD'}</h2>
          <p className="font-inter text-sm text-[#B8C0C2] mt-2">
            Status: <span className={user?.status === 'APPROVED' ? 'text-[#39B54A]' : 'text-yellow-500'}>{user?.status || 'PENDING'}</span>
          </p>
        </div>
      </div>

      {/* Roster */}
      <div>
        <h3 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
          <Users className="w-6 h-6 text-[#FF6A00]" /> Active Roster
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user?.players?.map((player, index) => (
            <div key={player._id || index} className="bg-[#111518]/90 border border-white/10 p-5 relative group hover:border-[#FF6A00]/50 transition-colors">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6A00] opacity-50 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-rajdhani text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    {player.inGameName}
                    {index === 0 && <span className="bg-[#FF6A00]/20 text-[#FF6A00] border border-[#FF6A00]/50 font-orbitron text-[8px] px-1 py-0.5">IGL</span>}
                  </h4>
                  <p className="font-inter text-[10px] text-[#B8C0C2] uppercase mt-1">LEGAL: {player.playerName}</p>
                </div>
                <div className="font-orbitron text-[9px] text-[#B8C0C2] uppercase border border-white/10 px-2 py-1 bg-[#080A0C]">
                  {player.role || 'ASSAULTER'}
                </div>
              </div>
              
              <div className="bg-[#080A0C] px-3 py-2 border border-white/5 flex justify-between items-center">
                <span className="font-orbitron text-[9px] text-[#B8C0C2] uppercase tracking-widest">BGMI ID</span>
                <span className="font-rajdhani font-bold text-white tracking-widest">{player.bgmiId}</span>
              </div>
            </div>
          ))}

          {!user?.players?.length && (
            <div className="col-span-full bg-[#080A0C] border border-white/5 p-8 flex flex-col items-center justify-center text-center">
              <Target className="w-10 h-10 text-[#B8C0C2] mb-3 opacity-30" />
              <p className="font-inter text-sm text-[#B8C0C2]">No operator data found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
