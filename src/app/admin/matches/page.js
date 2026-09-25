"use client";
import { Swords, Plus, Calendar } from 'lucide-react';

export default function AdminMatches() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111518]/90 border border-white/10 p-6">
        <div>
          <h2 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest">Match Control</h2>
          <p className="font-inter text-xs text-[#B8C0C2] mt-1">Schedule and generate tournament brackets.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#FF6A00] hover:bg-white text-black font-rajdhani font-bold text-lg px-6 py-2 uppercase tracking-widest transition-colors transform skew-x-[-10deg]">
          <span className="transform skew-x-10 flex items-center gap-2">
            <Plus className="w-5 h-5" /> Generate Match
          </span>
        </button>
      </div>

      <div className="bg-[#111518]/90 border border-white/10 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-[#080A0C] border border-white/10 flex items-center justify-center mb-4 transform skew-x-[-10deg]">
          <Calendar className="w-8 h-8 text-[#B8C0C2] transform skew-x-10 opacity-50" />
        </div>
        <h3 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest mb-2">No Active Matches</h3>
        <p className="font-inter text-[#B8C0C2] max-w-md mx-auto">
          You have not generated any matches yet. Click "Generate Match" to organize approved squads into lobbies.
        </p>
      </div>
    </div>
  );
}