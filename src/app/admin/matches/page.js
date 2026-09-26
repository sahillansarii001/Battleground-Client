"use client";
import { useState, useEffect } from 'react';
import { Swords, Plus, Calendar, Play, CheckSquare, Square } from 'lucide-react';
import api from '@/lib/api';
import MatchModal from '@/components/admin/MatchModal';
import ActionModal from '@/components/admin/ActionModal';
import { useRouter } from 'next/navigation';

export default function AdminMatches() {
  const [matches, setMatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [startMatchModal, setStartMatchModal] = useState({ isOpen: false, match: null, roomId: '', roomPassword: '' });
  const [loading, setLoading] = useState(true);
  const [availableMaps, setAvailableMaps] = useState(['ERANGEL', 'MIRAMAR', 'SANHOK', 'VIKENDI']);
  const [errorMsg, setErrorMsg] = useState('');
  const [actionModal, setActionModal] = useState({ isOpen: false });
  const router = useRouter();

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    if (startMatchModal.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [startMatchModal.isOpen]);

  const fetchMatches = async () => {
    try {
      const [matchesRes, settingsRes] = await Promise.all([
        api.get('/matches'),
        api.get('/admin/settings')
      ]);
      
      if (matchesRes.success) {
        setMatches(matchesRes.data);
      }
      if (settingsRes.success && settingsRes.data?.maps) {
        setAvailableMaps(settingsRes.data.maps);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMatch = async (matchData) => {
    setErrorMsg('');
    try {
      const res = await api.post('/matches', matchData);
      if (res.success) {
        setIsModalOpen(false);
        fetchMatches();
      } else {
        setErrorMsg(res.message);
      }
    } catch (error) {
      // error is already the response data from api.js interceptor
      setErrorMsg(error.message || 'Failed to create match');
    }
  };

  const updateStatus = async (id, status, extra = {}) => {
    try {
      await api.put(`/matches/${id}/status`, { status, ...extra });
      fetchMatches();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleUpdateMatch = async (matchData) => {
    setErrorMsg('');
    try {
      const res = await api.put(`/matches/${editingMatch._id}`, matchData);
      if (res.success) {
        setEditingMatch(null);
        fetchMatches();
      } else {
        setErrorMsg(res.message);
      }
    } catch (error) {
      // error is already the response data from api.js interceptor
      setErrorMsg(error.message || 'Failed to update match');
    }
  };

  const handleDeleteMatch = async (id) => {
    if (!confirm('Are you sure you want to delete this match?')) return;
    try {
      await api.delete(`/matches/${id}`);
      fetchMatches();
    } catch (error) {
      console.error('Failed to delete match', error);
    }
  };

  const handleStartMatch = async (e) => {
    e.preventDefault();
    if (!startMatchModal.roomId || !startMatchModal.roomPassword) {
      setActionModal({ isOpen: true, isAlert: true, title: 'Error', message: 'Room ID and Password are required to start the match.', confirmText: 'OK', onConfirm: () => setActionModal({ isOpen: false }) });
      return;
    }
    await updateStatus(startMatchModal.match._id, 'LIVE', { 
      roomId: startMatchModal.roomId, 
      roomPassword: startMatchModal.roomPassword 
    });
    setStartMatchModal({ isOpen: false, match: null, roomId: '', roomPassword: '' });
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
          onClick={() => {
            setErrorMsg('');
            setIsModalOpen(true);
          }}
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

              <div className="flex items-center gap-2">
                {match.status === 'UPCOMING' && (
                  <>
                    <button 
                      onClick={() => {
                        setErrorMsg('');
                        setEditingMatch(match);
                      }}
                      className="p-2 text-[#B8C0C2] hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                      title="Edit Match"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                    </button>
                    <button 
                      onClick={() => setStartMatchModal({ isOpen: true, match, roomId: '', roomPassword: '' })}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 text-sm font-bold uppercase tracking-widest font-rajdhani ml-2"
                    >
                      <Play className="w-4 h-4" /> Start Match
                    </button>
                  </>
                )}
                {match.status === 'LIVE' && (
                  <>
                    <button 
                      onClick={() => updateStatus(match._id, 'UPCOMING')}
                      className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 text-sm font-bold uppercase tracking-widest font-rajdhani"
                      title="Revert to Upcoming"
                    >
                      <Square className="w-4 h-4" /> Stop Match
                    </button>
                    <button 
                      onClick={() => updateStatus(match._id, 'RESULT_PROCESSING')}
                      className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 text-sm font-bold uppercase tracking-widest font-rajdhani"
                    >
                      <CheckSquare className="w-4 h-4" /> Mark Completed
                    </button>
                  </>
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
                <div className="h-6 w-px bg-white/10 mx-1"></div>
                <button 
                  onClick={() => handleDeleteMatch(match._id)}
                  className="p-2 text-red-500 hover:text-white hover:bg-red-600 bg-red-500/10 transition-colors"
                  title="Delete Match"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <MatchModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setErrorMsg('');
          setIsModalOpen(false);
        }} 
        onSubmit={handleCreateMatch} 
        availableMaps={availableMaps}
        errorMsg={errorMsg}
      />

      {editingMatch && (
        <MatchModal 
          isOpen={true}
          onClose={() => {
            setErrorMsg('');
            setEditingMatch(null);
          }}
          onSubmit={handleUpdateMatch}
          initialData={editingMatch}
          availableMaps={availableMaps}
          errorMsg={errorMsg}
        />
      )}

      {startMatchModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111518] border border-white/10 w-full max-w-md shadow-2xl">
            <form onSubmit={handleStartMatch}>
              <div className="p-6 pb-0">
                <h2 className="font-rajdhani text-xl font-bold text-white tracking-widest uppercase">Start Match: M{startMatchModal.match?.matchNumber}</h2>
                <p className="text-[#B8C0C2] mt-2 text-sm">Enter the Room ID and Password. This will be emailed to all approved squads immediately.</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block font-rajdhani text-[#FF6A00] font-bold uppercase tracking-widest mb-1">Room ID</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    value={startMatchModal.roomId}
                    onChange={(e) => setStartMatchModal({ ...startMatchModal, roomId: e.target.value.replace(/\D/g, '') })}
                    required
                    className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[#FF6A00] transition-colors"
                    placeholder="Enter Room ID"
                  />
                </div>
                <div>
                  <label className="block font-rajdhani text-[#FF6A00] font-bold uppercase tracking-widest mb-1">Room Password</label>
                  <input
                    type="text"
                    value={startMatchModal.roomPassword}
                    onChange={(e) => setStartMatchModal({ ...startMatchModal, roomPassword: e.target.value })}
                    required
                    className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[#FF6A00] transition-colors"
                    placeholder="Enter Room Password"
                  />
                </div>
              </div>
              <div className="p-6 flex justify-end gap-3 pt-0">
                <button
                  type="button"
                  onClick={() => setStartMatchModal({ isOpen: false, match: null, roomId: '', roomPassword: '' })}
                  className="px-6 py-2 text-sm font-bold uppercase tracking-wider text-white/70 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 text-sm font-bold uppercase tracking-widest transition-colors"
                >
                  Start & Send Emails
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {actionModal.isOpen && (
        <ActionModal
          isOpen={actionModal.isOpen}
          onClose={() => setActionModal({ isOpen: false })}
          title={actionModal.title}
          message={actionModal.message}
          confirmText={actionModal.confirmText}
          isDanger={actionModal.isDanger}
          onConfirm={actionModal.onConfirm}
          isAlert={actionModal.isAlert}
        />
      )}
    </div>
  );
}
