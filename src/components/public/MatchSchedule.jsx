"use client";
import { useState, useEffect } from 'react';
import { Map as MapIcon } from 'lucide-react';
import api from '@/lib/api';

export default function MatchSchedule() {
  const [matches, setMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingMatches = matches.filter(m => m.status === 'UPCOMING' || m.status === 'LIVE' || (m.status === 'COMPLETED' && m.resultStatus !== 'PUBLISHED'));
  const completedMatches = matches.filter(m => m.resultStatus === 'PUBLISHED');

  const displayedMatches = activeTab === 'upcoming' ? upcomingMatches : completedMatches;

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-end mb-12 border-b border-white/10 pb-6">
        <div>
          <h2 className="font-rajdhani text-4xl font-bold text-white uppercase tracking-tight">Match Center</h2>
          <p className="font-inter text-[#B8C0C2] mt-2">Upcoming drops and room intelligence.</p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`${activeTab === 'upcoming' ? 'bg-[#FF6A00] text-black' : 'bg-[#111518] text-[#B8C0C2] border border-white/10 hover:text-white'} font-orbitron text-[10px] font-bold px-4 py-2 uppercase tracking-widest transform skew-x-[-10deg] transition-colors`}
          >
            <span className="block transform skew-x-10">Upcoming</span>
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`${activeTab === 'completed' ? 'bg-[#FF6A00] text-black' : 'bg-[#111518] text-[#B8C0C2] border border-white/10 hover:text-white'} font-orbitron text-[10px] font-bold px-4 py-2 uppercase tracking-widest transform skew-x-[-10deg] transition-colors`}
          >
            <span className="block transform skew-x-10">Completed</span>
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center text-[#B8C0C2] py-10">Syncing matches...</div>
      ) : displayedMatches.length === 0 ? (
        <div className="text-center text-[#B8C0C2] py-10">No {activeTab} matches found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedMatches.map((match) => (
            <div key={match._id} className="bg-[#111518]/50 backdrop-blur-sm border border-white/10 p-6 hover:border-[#FF6A00]/50 transition-colors group">
              <div className="flex justify-between items-start mb-6">
                <span className={`bg-white/5 border border-white/10 font-orbitron text-[10px] font-bold px-2 py-1 uppercase tracking-widest ${match.status === 'LIVE' ? 'text-red-500' : 'text-[#B8C0C2]'}`}>
                  {match.status}
                </span>
                <div className="text-right">
                  <div className="font-rajdhani text-xl font-bold text-white">{new Date(match.date).toLocaleDateString()}</div>
                  <div className="font-orbitron text-xs text-[#FF6A00] tracking-widest">{match.startTime}</div>
                </div>
              </div>
              
              <h3 className="font-rajdhani text-3xl font-bold text-white mb-2 uppercase">{match.matchName}</h3>
              <p className="font-orbitron text-[11px] text-[#B8C0C2] mb-6 flex items-center gap-2 uppercase tracking-widest">
                <MapIcon className="w-4 h-4 text-[#FF6A00]" /> {match.map} <span className="mx-1 opacity-30">/</span> {match.mode}
              </p>
              
              {activeTab === 'completed' && match.winner && (
                <div className="w-full py-3 bg-[#1A2023] text-center font-rajdhani font-bold text-lg uppercase tracking-widest transform skew-x-[-10deg] border border-[#FF6A00]/50 mb-2">
                  <span className="block transform skew-x-10 text-[#FF6A00]">Winner: {match.winner.teamName}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
