"use client";
import { useState, useEffect } from 'react';
import { Swords, Plus, Calendar, Play, CheckSquare } from 'lucide-react';
import api from '@/lib/api';
import MatchModal from '@/components/admin/MatchModal';
import { useRouter } from 'next/navigation';

export default function AdminMatches() {
  const [matches, setMatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const handleCreateMatch = async (matchData) => {
    try {
      const res = await api.post('/matches', matchData);
      if (res.success) {
        setIsModalOpen(false);
        fetchMatches();
      }
    } catch (error) {
      console.error('Failed to create match', error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/matches/${id}/status`, { status });
      fetchMatches();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111518]/90 border border-white/10 p-6">
        <div>
          <h2 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest">Match Control</h2>
          <p className="font-inter text-xs text-[#B8C0C2] mt-1">Schedule and generate tournament brackets.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#FF6A00] hover:bg-white text-black font-rajdhani font-bold text-lg px-6 py-2 uppercase tracking-widest transition-colors transform skew-x-[-10deg]"
        >
          <span className="transform skew-x-10 flex items-center gap-2">
            <Plus className="w-5 h-5" /> Generate Match
          </span>
        </button>
      </div>

      {loading ? (
        <div className="text-white text-center py-10 font-rajdhani text-xl">Loading Matches...</div>
      ) : matches.length === 0 ? (
        <div className="bg-[#111518]/90 border border-white/10 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-[#080A0C] border border-white/10 flex items-center justify-center mb-4 transform skew-x-[-10deg]">
            <Calendar className="w-8 h-8 text-[#B8C0C2] transform skew-x-10 opacity-50" />
          </div>
          <h3 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest mb-2">No Active Matches</h3>
          <p className="font-inter text-[#B8C0C2] max-w-md mx-auto">
            You have not generated any matches yet. Click "Generate Match" to organize approved squads into lobbies.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {matches.map(match => (
            <div key={match._id} className="bg-[#111518] border border-white/10 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[#FF6A00] font-bold font-rajdhani text-xl">M{match.matchNumber}</span>
                  <h3 className="text-white font-bold font-rajdhani text-xl uppercase">{match.matchName}</h3>
                  <span className={`px-2 py-1 text-[10px] font-bold tracking-widest ${
                    match.status === 'LIVE' ? 'bg-red-500/20 text-red-500' :
                    match.status === 'COMPLETED' ? 'bg-green-500/20 text-green-500' :
                    match.status === 'RESULT_PROCESSING' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-white/10 text-[#B8C0C2]'
                  }`}>
                    {match.status}
                  </span>
                </div>
                <div className="flex gap-4 text-xs font-inter text-[#B8C0C2]">
                  <span>{new Date(match.date).toLocaleDateString()}</span>
                  <span>{match.startTime}</span>
                  <span className="uppercase">{match.map}</span>
                  <span className="uppercase">{match.mode}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {match.status === 'UPCOMING' && (
                  <button 
                    onClick={() => updateStatus(match._id, 'LIVE')}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 text-sm font-bold uppercase tracking-widest font-rajdhani"
                  >
                    <Play className="w-4 h-4" /> Start Match
                  </button>
                )}
                {match.status === 'LIVE' && (
                  <button 
                    onClick={() => updateStatus(match._id, 'RESULT_PROCESSING')}
                    className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 text-sm font-bold uppercase tracking-widest font-rajdhani"
                  >
                    <CheckSquare className="w-4 h-4" /> Mark Completed
                  </button>
                )}
                {match.status === 'RESULT_PROCESSING' && (
                  <button 
                    onClick={() => router.push(`/admin/matches/${match._id}/results`)}
                    className="flex items-center gap-2 bg-[#FF6A00] hover:bg-white hover:text-black text-white px-4 py-2 text-sm font-bold uppercase tracking-widest font-rajdhani transition-colors"
                  >
                    Enter Results
                  </button>
                )}
                {(match.status === 'COMPLETED' || match.resultStatus === 'PUBLISHED') && (
                  <button 
                    onClick={() => router.push(`/admin/matches/${match._id}/results`)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-sm font-bold uppercase tracking-widest font-rajdhani transition-colors"
                  >
                    View Results
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <MatchModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateMatch} 
      />
    </div>
  );
}
