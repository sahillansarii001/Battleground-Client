"use client";
import { Trophy } from 'lucide-react';

export default function Leaderboard() {
  return (
    <div className="space-y-6">
      <div className="bg-[#111518]/90 border border-white/10 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="font-rajdhani text-4xl font-bold text-white uppercase tracking-widest flex items-center gap-3">
            <Trophy className="w-8 h-8 text-[#FF6A00]" />
            Global Rankings
          </h2>
          <p className="font-inter text-[#B8C0C2] mt-2">Season 1 Battleground Leaderboard</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-[#080A0C] border border-white/10 text-white font-orbitron text-[10px] px-4 py-2 uppercase tracking-widest focus:outline-none focus:border-[#FF6A00]">
            <option>Overall</option>
            <option>Group A</option>
            <option>Group B</option>
          </select>
        </div>
      </div>

      <div className="bg-[#080A0C] border border-white/10 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#111518] border-b border-white/10 font-orbitron text-[10px] text-[#FF6A00] uppercase tracking-widest">
              <th className="p-4 whitespace-nowrap">Rank</th>
              <th className="p-4 whitespace-nowrap">Squad</th>
              <th className="p-4 whitespace-nowrap">Matches</th>
              <th className="p-4 whitespace-nowrap">WWCD</th>
              <th className="p-4 whitespace-nowrap">Place Pts</th>
              <th className="p-4 whitespace-nowrap">Kill Pts</th>
              <th className="p-4 whitespace-nowrap text-right">Total Pts</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="7" className="p-8 text-center text-[#B8C0C2] font-inter text-sm border-b border-white/5">
                Leaderboard data is currently compiling...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}