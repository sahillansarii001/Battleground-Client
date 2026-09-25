"use client";
import { CheckCircle, Calculator } from 'lucide-react';

export default function AdminScores() {
  return (
    <div className="space-y-6">
      <div className="bg-[#111518]/90 border border-white/10 p-6 flex items-center justify-between hud-border relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6A00]"></div>
        <div>
          <h2 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-[#FF6A00]" />
            Scoreboard Management
          </h2>
          <p className="font-inter text-xs text-[#B8C0C2] mt-1">Input match results to automatically update global rankings.</p>
        </div>
      </div>

      <div className="bg-[#111518]/90 border border-white/10 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-[#080A0C] border border-white/10 flex items-center justify-center mb-4 transform skew-x-[-10deg]">
          <Calculator className="w-8 h-8 text-[#B8C0C2] transform skew-x-10 opacity-50" />
        </div>
        <h3 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest mb-2">No Matches to Score</h3>
        <p className="font-inter text-[#B8C0C2] max-w-md mx-auto">
          Generate and complete matches in the Match Control panel before inputting scores here.
        </p>
      </div>
    </div>
  );
}