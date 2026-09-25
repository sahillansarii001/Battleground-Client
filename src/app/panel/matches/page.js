"use client";
import { useState, useEffect } from 'react';
import { Swords, Trophy, Map, Users } from 'lucide-react';
import api from '@/lib/api';

export default function Matches() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await api.get('/matches');
      if (res.success) {
        setMatches(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch matches', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingMatches = matches.filter(m => m.status === 'UPCOMING' || m.status === 'LIVE' || (m.status === 'COMPLETED' && m.resultStatus !== 'PUBLISHED') || m.status === 'RESULT_PROCESSING');
  const pastMatches = matches.filter(m => m.resultStatus === 'PUBLISHED');

  return (
    <div className="space-y-6">
      {/* Filters/Tabs */}
      <div className="flex border-b border-white/10 mb-6">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`px-6 py-3 font-rajdhani text-lg font-bold tracking-widest uppercase transition-colors ${activeTab === 'upcoming' ? 'text-[#FF6A00] border-b-2 border-[#FF6A00]' : 'text-[#B8C0C2] hover:text-white'}`}
        >
          Upcoming
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          className={`px-6 py-3 font-rajdhani text-lg font-bold tracking-widest uppercase transition-colors ${activeTab === 'past' ? 'text-[#FF6A00] border-b-2 border-[#FF6A00]' : 'text-[#B8C0C2] hover:text-white'}`}
        >
          Past Results
        </button>
      </div>

      {loading ? (
        <div className="text-white text-center py-10 font-rajdhani text-xl">Loading Operations...</div>
      ) : activeTab === 'upcoming' ? (
        upcomingMatches.length === 0 ? (
          <div className="bg-[#111518]/90 border border-white/10 p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[#080A0C] border border-white/10 flex items-center justify-center mb-4 transform skew-x-[-10deg]">
              <Swords className="w-8 h-8 text-[#B8C0C2] transform skew-x-10 opacity-50" />
            </div>
            <h3 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest mb-2">No Scheduled Drops</h3>
            <p className="font-inter text-[#B8C0C2] max-w-md mx-auto">
              Tournament brackets have not been generated yet. Await further instructions from high command.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {upcomingMatches.map(match => (
              <div key={match._id} className="bg-[#111518]/90 border border-white/10 p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[#FF6A00] font-bold font-rajdhani text-xl">M{match.matchNumber}</span>
                    <h3 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest">{match.matchName}</h3>
                    <span className={`px-2 py-1 text-[10px] font-bold tracking-widest ${match.status === 'LIVE' ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-white/10 text-white'}`}>
                      {match.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs font-inter text-[#B8C0C2]">
                    <span className="flex items-center gap-1"><Map className="w-3 h-3"/> {match.map}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3"/> {match.mode}</span>
                    <span>{new Date(match.date).toLocaleDateString()}</span>
                    <span>{match.startTime}</span>
                  </div>
                </div>

                {match.roomId && match.roomPassword && (
                  <div className="bg-[#080A0C] border border-[#FF6A00]/30 p-4 min-w-50">
                    <div className="mb-2">
                      <p className="font-orbitron text-[9px] text-[#B8C0C2] uppercase">Room ID</p>
                      <p className="font-rajdhani text-lg font-bold text-white tracking-wider">{match.roomId}</p>
                    </div>
                    <div>
                      <p className="font-orbitron text-[9px] text-[#B8C0C2] uppercase">Password</p>
                      <p className="font-rajdhani text-lg font-bold text-white tracking-wider">{match.roomPassword}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        pastMatches.length === 0 ? (
          <div className="bg-[#111518]/90 border border-white/10 p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[#080A0C] border border-white/10 flex items-center justify-center mb-4 transform skew-x-[-10deg]">
              <Trophy className="w-8 h-8 text-[#B8C0C2] transform skew-x-10 opacity-50" />
            </div>
            <h3 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest mb-2">No Past Records Found</h3>
            <p className="font-inter text-[#B8C0C2] max-w-md mx-auto">
              Your squad hasn't completed any official deployments yet. Participate in matches to see results here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pastMatches.map(match => (
              <div key={match._id} className="bg-[#111518]/90 border border-white/10 p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[#FF6A00] font-bold font-rajdhani text-xl">M{match.matchNumber}</span>
                    <h3 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest">{match.matchName}</h3>
                    <span className="px-2 py-1 text-[10px] font-bold tracking-widest bg-green-500/20 text-green-500">
                      COMPLETED
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs font-inter text-[#B8C0C2]">
                    <span className="flex items-center gap-1"><Map className="w-3 h-3"/> {match.map}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3"/> {match.mode}</span>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="text-right">
                    <p className="font-orbitron text-[9px] text-[#B8C0C2] uppercase">Winner</p>
                    <p className="font-rajdhani text-lg font-bold text-[#FF6A00] uppercase tracking-wider">{match.winner?.teamName || 'TBD'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
