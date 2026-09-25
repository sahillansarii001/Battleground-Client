"use client";
import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import api from '@/lib/api';

export default function BattleRankings() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get('/leaderboard');
      if (res.success) {
        // Only show top 10 on the homepage
        setLeaderboard(res.data.slice(0, 10));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#080A0C] border border-white/10 overflow-hidden hud-border">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-200">
          <thead>
            <tr className="bg-[#111518] border-b border-white/10 font-orbitron text-[10px] text-[#B8C0C2] tracking-widest uppercase">
              <th className="py-4 px-6 w-20">Rank</th>
              <th className="py-4 px-6">Squad</th>
              <th className="py-4 px-6 text-center">Matches</th>
              <th className="py-4 px-6 text-center">WWCD</th>
              <th className="py-4 px-6 text-center text-[#39B54A]">Place Pts</th>
              <th className="py-4 px-6 text-center text-red-400">Kill Pts</th>
              <th className="py-4 px-6 text-right text-[#FF6A00] font-bold text-xs">Total</th>
            </tr>
          </thead>
          <tbody className="font-rajdhani">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-24 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Shield className="w-16 h-16 text-white/5 mb-4" />
                    <h3 className="text-2xl font-bold text-[#B8C0C2] uppercase tracking-widest">Syncing Data...</h3>
                  </div>
                </td>
              </tr>
            ) : leaderboard.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-24 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Shield className="w-16 h-16 text-white/5 mb-4" />
                    <h3 className="text-2xl font-bold text-[#B8C0C2] uppercase tracking-widest">Rankings Unlocked Soon</h3>
                    <p className="font-inter text-sm text-[#B8C0C2]/50 mt-2">Standings will populate after the first deployment.</p>
                  </div>
                </td>
              </tr>
            ) : (
              leaderboard.map((team, index) => (
                <tr key={team._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-6 text-white/50 group-hover:text-[#FF6A00] font-bold text-xl transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </td>
                  <td className="py-4 px-6 font-bold text-white text-xl uppercase tracking-wider flex items-center gap-3">
                    {team.logo && team.logo.url ? (
                      <img src={team.logo.url} alt={team.teamName} className="w-8 h-8 object-cover rounded" />
                    ) : (
                      <div className="w-8 h-8 bg-white/10 flex items-center justify-center font-rajdhani font-bold">{team.teamName.charAt(0)}</div>
                    )}
                    {team.teamName}
                  </td>
                  <td className="py-4 px-6 text-center text-[#B8C0C2]">{team.matchesPlayed}</td>
                  <td className="py-4 px-6 text-center text-white">{team.wwcd}</td>
                  <td className="py-4 px-6 text-center text-[#39B54A]">{team.placementPoints || 0}</td>
                  <td className="py-4 px-6 text-center text-red-400">{team.killPoints || 0}</td>
                  <td className="py-4 px-6 text-right font-bold text-2xl text-[#FF6A00]">{team.totalPoints}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
