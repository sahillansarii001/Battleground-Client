"use client";
import { useAuth } from '@/hooks/useAuth';
import { Users, Shield, Target } from 'lucide-react';

export default function Team() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Tactical Header */}
      <div className="bg-[#080A0C] border border-white/5 relative flex flex-col md:flex-row items-stretch min-h-[160px]">
        {/* Left Accent Bar */}
        <div className="hidden md:block w-2 bg-[#FF6A00]"></div>
        
        {/* Diagonal Stripe Pattern Background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #fff, #fff 1px, transparent 1px, transparent 10px)' }}></div>

        {/* Logo Section */}
        <div className="w-full md:w-48 bg-[#040506] border-b md:border-b-0 md:border-r border-white/5 flex items-center justify-center p-6 relative z-10 shrink-0">
          <div className="w-24 h-24 bg-[#111518] flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(255,106,0,0.15)] relative">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#FF6A00]"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#FF6A00]"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#FF6A00]"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#FF6A00]"></div>
            
            {user?.logo?.url ? (
              <img src={user.logo.url} alt="Team Logo" className="w-full h-full object-cover p-1" />
            ) : (
              <Shield className="w-10 h-10 text-[#B8C0C2] opacity-30" />
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <div className="bg-[#FF6A00] text-black font-orbitron text-[9px] uppercase tracking-[0.2em] font-bold px-3 py-1">
              {user?.teamType || 'Squad'} OP
            </div>
            <div className={`font-orbitron text-[9px] uppercase tracking-[0.2em] font-bold px-3 py-1 border ${user?.status === 'APPROVED' ? 'border-[#39B54A] text-[#39B54A] bg-[#39B54A]/5' : 'border-yellow-500 text-yellow-500 bg-yellow-500/5'}`}>
              {user?.status || 'PENDING'}
            </div>
          </div>
          
          <h2 className="font-rajdhani text-4xl md:text-5xl font-bold text-white uppercase tracking-widest leading-none mb-4">
            {user?.teamName || 'UNKNOWN SQUAD'}
          </h2>
          
          <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
            <div>
              <p className="font-orbitron text-[9px] text-[#FF6A00] uppercase tracking-widest mb-1">COMMS LINK</p>
              <p className="font-inter text-sm text-[#B8C0C2]">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="font-orbitron text-[9px] text-[#FF6A00] uppercase tracking-widest mb-1">ACTIVE PERSONNEL</p>
              <p className="font-rajdhani text-lg font-bold text-white leading-none">{user?.players?.length || 0} / 4</p>
            </div>
          </div>
        </div>
      </div>

      {/* Roster Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-6 bg-[#FF6A00]"></div>
          <h3 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest">
            ROSTER DOSSIER
          </h3>
          <div className="flex-1 h-px bg-white/10 ml-4"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user?.players?.map((player, index) => (
            <div key={player._id || index} className="group bg-[#080A0C] border border-white/5 relative overflow-hidden transition-colors hover:border-[#FF6A00]/50">
              
              {/* Left Highlight */}
              <div className="absolute top-0 left-0 w-1 h-full bg-[#333] group-hover:bg-[#FF6A00] transition-colors"></div>
              
              <div className="p-5 pl-7 flex flex-col h-full relative z-10">
                {/* Header: IGN and Role */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-rajdhani text-3xl font-bold text-white uppercase tracking-wider leading-none">
                        {player.inGameName}
                      </h4>
                      {index === 0 && (
                        <span className="bg-[#FF6A00] text-black font-orbitron font-bold text-[9px] px-2 py-0.5 tracking-widest">
                          IGL
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-[#111518] border border-white/10 font-orbitron text-[9px] text-[#B8C0C2] uppercase tracking-[0.15em] px-3 py-1 group-hover:text-white transition-colors">
                    {player.role || 'ASSAULTER'}
                  </div>
                </div>
                
                {/* Data Grid */}
                <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="bg-[#040506] p-3 border border-white/5">
                    <p className="font-orbitron text-[8px] text-[#FF6A00] uppercase tracking-widest mb-1">LEGAL NAME</p>
                    <p className="font-inter text-xs text-white uppercase truncate">
                      {player.playerName}
                    </p>
                  </div>
                  <div className="bg-[#040506] p-3 border border-white/5">
                    <p className="font-orbitron text-[8px] text-[#FF6A00] uppercase tracking-widest mb-1">BGMI ID</p>
                    <p className="font-rajdhani text-base font-bold text-white tracking-widest truncate">
                      {player.bgmiId}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {!user?.players?.length && (
            <div className="col-span-full bg-[#080A0C] border border-white/5 p-12 flex flex-col items-center justify-center text-center">
              <Target className="w-12 h-12 text-[#333] mb-4" />
              <p className="font-rajdhani text-xl font-bold text-white uppercase tracking-widest">NO DATA FOUND</p>
              <p className="font-inter text-sm text-[#808A93] mt-2">Roster is completely empty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
