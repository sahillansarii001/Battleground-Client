"use client";
import { Swords, Clock, Target } from 'lucide-react';

export default function Matches() {
  return (
    <div className="space-y-6">
      {/* Filters/Tabs (Visual only for now) */}
      <div className="flex border-b border-white/10 mb-6">
        <button className="px-6 py-3 font-rajdhani text-lg font-bold text-[#FF6A00] border-b-2 border-[#FF6A00] tracking-widest uppercase">Upcoming</button>
        <button className="px-6 py-3 font-rajdhani text-lg font-bold text-[#B8C0C2] hover:text-white tracking-widest uppercase transition-colors">Past Results</button>
      </div>

      <div className="bg-[#111518]/90 border border-white/10 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-[#080A0C] border border-white/10 flex items-center justify-center mb-4 transform skew-x-[-10deg]">
          <Swords className="w-8 h-8 text-[#B8C0C2] transform skew-x-10 opacity-50" />
        </div>
        <h3 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest mb-2">No Scheduled Drops</h3>
        <p className="font-inter text-[#B8C0C2] max-w-md mx-auto">
          Tournament brackets have not been generated yet. Await further instructions from high command.
        </p>
      </div>
    </div>
  );
}