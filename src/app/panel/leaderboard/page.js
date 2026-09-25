"use client";
import { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import api from '@/lib/api';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get('/leaderboard');
      if (res.success) {
        setLeaderboard(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard', error);
    } finally {
      setLoading(false);
    }
  };

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
          </select>
        </div>
      </div>

      <div className="bg-[#080A0C] border border-white/10 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#111518] border-b border-white/10 font-orbitron text-[10px] text-[#FF6A00] uppercase tracking-widest">
              <th className="p-4 whitespace-nowrap">Rank</th>
              <th className="p-4 whitespace-nowrap">Squad</th>
              <th className="p-4 whitespace-nowrap text-center">Matches</th>
              <th className="p-4 whitespace-nowrap text-center">WWCD</th>
              <th className="p-4 whitespace-nowrap text-center">Place Pts</th>
              <th className="p-4 whitespace-nowrap text-center">Kill Pts</th>
              <th className="p-4 whitespace-nowrap text-right text-white text-sm">Total Pts</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-[#B8C0C2] font-inter text-sm border-b border-white/5">
                  Leaderboard data is currently compiling...
                </td>
              </tr>
            ) : leaderboard.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-[#B8C0C2] font-inter text-sm border-b border-white/5">
                  No official results have been published yet.
                </td>
              </tr>
            ) : (
              leaderboard.map((team, index) => (
                <tr key={team._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-orbitron text-white text-sm font-bold">#{index + 1}</td>
                  <td className="p-4 font-rajdhani text-white text-lg font-bold tracking-wider uppercase">
                    <div className="flex items-center gap-3">
                      {team.logo && team.logo.url ? (
                        <img src={team.logo.url} alt={team.teamName} className="w-8 h-8 object-cover rounded" />
                      ) : (
                        <div className="w-8 h-8 bg-white/10 flex items-center justify-center font-rajdhani font-bold">{team.teamName.charAt(0)}</div>
                      )}
                      {team.teamName}
                    </div>
                  </td>
                  <td className="p-4 font-inter text-[#B8C0C2] text-center">{team.matchesPlayed}</td>
                  <td className="p-4 font-inter text-[#B8C0C2] text-center">{team.wwcd}</td>
                  <td className="p-4 font-inter text-[#B8C0C2] text-center">{team.placementPoints || 0}</td>
                  <td className="p-4 font-inter text-[#B8C0C2] text-center">{team.killPoints || 0}</td>
                  <td className="p-4 font-rajdhani text-white text-2xl font-bold text-right">{team.totalPoints}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
