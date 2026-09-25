"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Target, Trophy, Swords, AlertOctagon, Activity, Calendar } from 'lucide-react';
import api from '@/lib/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ rank: '--', matches: 0, kills: 0, wwcd: 0 });
  const [nextMatch, setNextMatch] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch Leaderboard to get team stats
      const lbRes = await api.get('/leaderboard');
      if (lbRes.success) {
        const lbData = lbRes.data;
        const myRankIndex = lbData.findIndex(t => t._id === user._id);
        if (myRankIndex !== -1) {
          const myStats = lbData[myRankIndex];
          setStats({
            rank: myRankIndex + 1,
            matches: myStats.matchesPlayed || 0,
            kills: myStats.totalKills || 0,
            wwcd: myStats.wwcd || 0
          });
        }
      }

      // 2. Fetch Matches for Next Deployment
      const matchesRes = await api.get('/matches');
      if (matchesRes.success) {
        const allMatches = matchesRes.data;
        const upcomingMatches = allMatches.filter(m => m.status === 'UPCOMING' || m.status === 'LIVE');
        if (upcomingMatches.length > 0) {
          // Sort by date ascending to get the next closest match
          upcomingMatches.sort((a, b) => new Date(a.date) - new Date(b.date));
          setNextMatch(upcomingMatches[0]);
        }
      }

      // 3. Fetch Announcements (Backend automatically filters to PUBLISHED only for non-admins)
      const annRes = await api.get('/announcements');
      if (annRes.success) {
        setAnnouncements(annRes.data.slice(0, 3)); // Only take top 3 latest
      }

    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-[#111518]/90 backdrop-blur-md border border-white/10 p-8 hud-border relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6A00]"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="font-rajdhani text-3xl font-bold text-white uppercase tracking-widest">
              Welcome back, <span className="text-[#FF6A00]">{user?.teamName || 'Commander'}</span>
            </h2>
            <p className="font-inter text-sm text-[#B8C0C2] mt-1">
              Your squad is currently <span className={user?.status === 'APPROVED' ? 'text-[#39B54A]' : 'text-yellow-500'}>{user?.status || 'PENDING'}</span>.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-[#080A0C] border border-white/10 px-4 py-2 font-orbitron text-[10px] tracking-widest text-[#B8C0C2] uppercase">
            <Activity className="w-4 h-4 text-[#FF6A00] animate-pulse" />
            System Online
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#111518]/90 border border-white/10 p-6 flex items-center gap-4 hover:border-[#FF6A00]/50 transition-colors">
          <div className="w-12 h-12 bg-[#080A0C] border border-[#FF6A00]/30 flex items-center justify-center transform skew-x-[-10deg]">
            <Trophy className="w-6 h-6 text-[#FF6A00] transform skew-x-10" />
          </div>
          <div>
            <p className="font-orbitron text-[9px] text-[#B8C0C2] uppercase tracking-widest">Global Rank</p>
            <p className="font-rajdhani text-3xl font-bold text-white">#{stats.rank}</p>
          </div>
        </div>
        
        <div className="bg-[#111518]/90 border border-white/10 p-6 flex items-center gap-4 hover:border-[#FF6A00]/50 transition-colors">
          <div className="w-12 h-12 bg-[#080A0C] border border-[#FF6A00]/30 flex items-center justify-center transform skew-x-[-10deg]">
            <Calendar className="w-6 h-6 text-[#FF6A00] transform skew-x-10" />
          </div>
          <div>
            <p className="font-orbitron text-[9px] text-[#B8C0C2] uppercase tracking-widest">Matches Played</p>
            <p className="font-rajdhani text-3xl font-bold text-white">{stats.matches}</p>
          </div>
        </div>

        <div className="bg-[#111518]/90 border border-white/10 p-6 flex items-center gap-4 hover:border-[#FF6A00]/50 transition-colors">
          <div className="w-12 h-12 bg-[#080A0C] border border-[#FF6A00]/30 flex items-center justify-center transform skew-x-[-10deg]">
            <Target className="w-6 h-6 text-[#FF6A00] transform skew-x-10" />
          </div>
          <div>
            <p className="font-orbitron text-[9px] text-[#B8C0C2] uppercase tracking-widest">Total Kills</p>
            <p className="font-rajdhani text-3xl font-bold text-white">{stats.kills}</p>
          </div>
        </div>

        <div className="bg-[#111518]/90 border border-white/10 p-6 flex items-center gap-4 hover:border-[#FF6A00]/50 transition-colors">
          <div className="w-12 h-12 bg-[#080A0C] border border-[#FF6A00]/30 flex items-center justify-center transform skew-x-[-10deg]">
            <Swords className="w-6 h-6 text-[#FF6A00] transform skew-x-10" />
          </div>
          <div>
            <p className="font-orbitron text-[9px] text-[#B8C0C2] uppercase tracking-widest">WWCD</p>
            <p className="font-rajdhani text-3xl font-bold text-white">{stats.wwcd}</p>
          </div>
        </div>
      </div>

      {/* Intelligence Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111518]/90 border border-white/10 p-6 h-full flex flex-col">
          <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Next Deployment</h3>
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-[#B8C0C2]">Syncing...</div>
          ) : nextMatch ? (
            <div className="bg-[#080A0C] border border-[#FF6A00]/50 p-6 border-l-4 border-l-[#FF6A00] flex flex-col h-full justify-center">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-orbitron text-[10px] text-[#FF6A00] uppercase mb-1">M{nextMatch.matchNumber} / {nextMatch.status}</p>
                  <h4 className="font-rajdhani text-2xl font-bold text-white uppercase">{nextMatch.matchName}</h4>
                </div>
                <span className={`px-2 py-1 text-[10px] font-bold tracking-widest ${nextMatch.status === 'LIVE' ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-white/10 text-white'}`}>
                  {nextMatch.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm font-inter text-[#B8C0C2] bg-[#111518] p-4 border border-white/5">
                <div>
                  <span className="block text-[9px] font-orbitron uppercase mb-1 opacity-50">Date</span>
                  <span className="text-white font-bold">{new Date(nextMatch.date).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-orbitron uppercase mb-1 opacity-50">Time</span>
                  <span className="text-white font-bold">{nextMatch.startTime}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-orbitron uppercase mb-1 opacity-50">Map</span>
                  <span className="text-white font-bold uppercase">{nextMatch.map}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-orbitron uppercase mb-1 opacity-50">Mode</span>
                  <span className="text-white font-bold uppercase">{nextMatch.mode}</span>
                </div>
              </div>
              {nextMatch.roomId && nextMatch.roomPassword && (
                 <div className="mt-4 p-3 bg-white/5 border border-white/10 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-[#B8C0C2] uppercase font-orbitron">Room ID</p>
                      <p className="text-white font-bold tracking-wider">{nextMatch.roomId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[#B8C0C2] uppercase font-orbitron">Password</p>
                      <p className="text-white font-bold tracking-wider">{nextMatch.roomPassword}</p>
                    </div>
                 </div>
              )}
            </div>
          ) : (
            <div className="bg-[#080A0C] border border-white/5 p-8 flex flex-col items-center justify-center text-center flex-1">
              <AlertOctagon className="w-10 h-10 text-[#B8C0C2] mb-3 opacity-50" />
              <p className="font-inter text-sm text-[#B8C0C2]">No upcoming matches scheduled.</p>
            </div>
          )}
        </div>

        <div className="bg-[#111518]/90 border border-white/10 p-6 flex flex-col">
          <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Recent Intel</h3>
          <div className="flex-1 space-y-3">
            {loading ? (
               <div className="text-[#B8C0C2] text-center mt-10">Syncing...</div>
            ) : announcements.length === 0 ? (
               <div className="text-[#B8C0C2] text-center mt-10">No broadcasts found.</div>
            ) : (
              announcements.map((ann) => (
                <div key={ann._id} className={`bg-[#080A0C] border border-white/5 p-4 border-l-2 ${ann.importance === 'CRITICAL' ? 'border-l-red-500' : 'border-l-[#FF6A00]'}`}>
                  <p className={`font-orbitron text-[9px] uppercase mb-1 ${ann.importance === 'CRITICAL' ? 'text-red-500' : 'text-[#B8C0C2]'}`}>
                    {ann.category} NOTIFICATION
                  </p>
                  <p className="font-rajdhani text-sm font-bold text-white uppercase">{ann.title}</p>
                  <p className="font-inter text-xs text-[#B8C0C2] mt-1 line-clamp-2">{ann.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
