"use client";
import { BookOpen, ShieldAlert, Crosshair, AlertTriangle } from 'lucide-react';

export default function Rules() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <BookOpen className="w-12 h-12 text-[#FF6A00] mx-auto mb-4" />
        <h2 className="font-rajdhani text-4xl font-bold text-white uppercase tracking-widest">Tournament Rulebook</h2>
        <p className="font-orbitron text-[10px] text-[#B8C0C2] uppercase tracking-widest mt-2 border-t border-b border-white/10 py-2 inline-block">Standard Operating Procedures</p>
      </div>

      <div className="bg-[#111518]/90 border border-white/10 p-8 hover:border-[#FF6A00]/30 transition-colors group">
        <h3 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-[#FF6A00] group-hover:text-white transition-colors" />
          1. General Code of Conduct
        </h3>
        <ul className="space-y-3 font-inter text-[#B8C0C2] text-sm pl-9 list-disc">
          <li>All players must respect tournament officials, staff, and other participants.</li>
          <li>Toxic behavior, hate speech, or harassment in all-chat or comms will result in immediate squad disqualification.</li>
          <li>Account sharing is strictly prohibited. The registered BGMI ID must match the in-game participant.</li>
        </ul>
      </div>

      <div className="bg-[#111518]/90 border border-white/10 p-8 hover:border-[#FF6A00]/30 transition-colors group">
        <h3 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-3">
          <Crosshair className="w-6 h-6 text-[#FF6A00] group-hover:text-white transition-colors" />
          2. In-Game Rules
        </h3>
        <ul className="space-y-3 font-inter text-[#B8C0C2] text-sm pl-9 list-disc">
          <li>Emulators are strictly prohibited. iPads and Tablets are not allowed unless specified in the tier rules.</li>
          <li>Use of third-party software, GFX tools, aimbots, or wallhacks will lead to a permanent ban.</li>
          <li>Teaming up with other squads in a match will result in a zero-point deduction and a ban.</li>
        </ul>
      </div>

      <div className="bg-[#111518]/90 border border-white/10 p-8 hover:border-red-500/30 transition-colors group relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
        <h3 className="font-rajdhani text-2xl font-bold text-red-500 uppercase tracking-widest mb-4 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500 group-hover:animate-pulse" />
          3. Scoring System
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-[#080A0C] border border-white/5 p-4 text-center">
            <span className="block font-orbitron text-[9px] text-[#B8C0C2] uppercase mb-1">WWCD</span>
            <span className="font-rajdhani text-2xl font-bold text-white">10 Pts</span>
          </div>
          <div className="bg-[#080A0C] border border-white/5 p-4 text-center">
            <span className="block font-orbitron text-[9px] text-[#B8C0C2] uppercase mb-1">2nd Place</span>
            <span className="font-rajdhani text-2xl font-bold text-white">6 Pts</span>
          </div>
          <div className="bg-[#080A0C] border border-white/5 p-4 text-center">
            <span className="block font-orbitron text-[9px] text-[#B8C0C2] uppercase mb-1">3rd Place</span>
            <span className="font-rajdhani text-2xl font-bold text-white">5 Pts</span>
          </div>
          <div className="bg-[#080A0C] border border-[#FF6A00]/20 p-4 text-center border-b-2 border-b-[#FF6A00]">
            <span className="block font-orbitron text-[9px] text-[#FF6A00] uppercase mb-1">Per Kill</span>
            <span className="font-rajdhani text-2xl font-bold text-white">1 Pt</span>
          </div>
        </div>
      </div>
    </div>
  );
}