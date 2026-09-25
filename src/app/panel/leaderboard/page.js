"use client";
import { useState, useEffect, Fragment } from 'react';
import { Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import api from '@/lib/api';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedTeamId, setExpandedTeamId] = useState(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedMatch]);

  const fetchMatches = async () => {
    try {
      const res = await api.get('/matches');
      if (res.success) {
        setMatches(res.data.filter(m => m.resultStatus === 'PUBLISHED'));
      }
    } catch (error) {
      console.error('Failed to fetch matches', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const url = selectedMatch ? `/leaderboard?matchId=${selectedMatch}` : '/leaderboard';
      const res = await api.get(url);
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
          <select 
            value={selectedMatch}
            onChange={(e) => setSelectedMatch(e.target.value)}
            className="bg-[#080A0C] border border-white/10 text-white font-orbitron text-sm px-4 py-2 uppercase tracking-widest focus:outline-none focus:border-[#FF6A00]"
          >
            <option value="">Overall</option>
            {matches.map(m => (
              <option key={m._id} value={m._id}>{m.matchName}</option>
            ))}
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
              leaderboard.map((team, index) => {
                const isExpanded = expandedTeamId === team._id;
                return (
                  <Fragment key={team._id}>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 font-orbitron text-white text-sm font-bold">#{index + 1}</td>
                      <td className="p-4 font-rajdhani text-white text-lg font-bold tracking-wider uppercase">
                        <div 
                          className="flex items-center gap-3 cursor-pointer group"
                          onClick={() => setExpandedTeamId(isExpanded ? null : team._id)}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#FF6A00]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-white/50 group-hover:text-[#FF6A00]" />
                          )}
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
                    {isExpanded && (
                      <tr className="bg-[#1A2023]/50 border-b border-white/5">
                        <td colSpan="7" className="p-4">
                          <div className="flex flex-wrap gap-4 pl-[4.5rem]">
                            {team.players && team.players.length > 0 ? (
                              team.players.map(p => (
                                <div key={p._id} className="bg-[#080A0C] border border-white/10 p-3 flex items-center gap-4">
                                  <span className="text-white text-sm font-orbitron">{p.inGameName}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-[#B8C0C2] uppercase">Kills</span>
                                    <span className="text-[#FF6A00] font-bold">{p.kills}</span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <span className="text-xs text-[#B8C0C2]">No player data available.</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
