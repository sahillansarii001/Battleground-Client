"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save, CheckCircle, Upload, ArrowLeft } from 'lucide-react';
import api from '@/lib/api';

export default function MatchResults() {
  const { id } = useParams();
  const router = useRouter();
  const [match, setMatch] = useState(null);
  const [teams, setTeams] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      // Fetch Match
      const matchRes = await api.get('/matches');
      const foundMatch = matchRes.data.find(m => m._id === id);
      setMatch(foundMatch);

      // Fetch Teams
      const teamsRes = await api.get('/admin/teams');
      setTeams(teamsRes.data.filter(t => t.status === 'APPROVED'));

      // Fetch existing scores if any
      const scoreRes = await api.get(`/matches/${id}/scores`);
      if (scoreRes.success && scoreRes.data.length > 0) {
        // Map scores for easy editing
        const existingScores = scoreRes.data.map(s => ({
          teamId: s.teamId._id || s.teamId,
          placement: s.placement,
          placementPoints: s.placementPoints,
          kills: s.kills,
          killPoints: s.killPoints,
          totalPoints: s.totalPoints
        }));
        setScores(existingScores);
      } else {
        // Init empty scores for all approved teams
        const initScores = teamsRes.data
          .filter(t => t.status === 'APPROVED')
          .map(t => ({
            teamId: t._id,
            placement: 0,
            placementPoints: 0,
            kills: 0,
            killPoints: 0,
            totalPoints: 0
          }));
        setScores(initScores);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (teamId, field, value) => {
    const numValue = parseInt(value) || 0;
    setScores(prev => prev.map(s => {
      if (s.teamId === teamId) {
        const updated = { ...s, [field]: numValue };
        // Auto calculate total
        if (field === 'placementPoints' || field === 'killPoints') {
          updated.totalPoints = (field === 'placementPoints' ? numValue : s.placementPoints) + (field === 'killPoints' ? numValue : s.killPoints);
        }
        return updated;
      }
      return s;
    }));
  };

  const saveDraft = async () => {
    try {
      await api.put(`/matches/${id}/results`, { scores });
      alert('Draft saved successfully');
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const verifyResults = async () => {
    try {
      await api.put(`/matches/${id}/results/verify`);
      alert('Results verified');
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const publishResults = async () => {
    try {
      // Need to find the winner for the match payload if needed, or backend can do it.
      // We will just call publish.
      await api.put(`/matches/${id}/results/publish`);
      alert('Results published globally');
      router.push('/admin/matches');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="text-white p-10">Loading...</div>;
  if (!match) return <div className="text-white p-10">Match not found</div>;

  return (
    <div className="space-y-6">
      <button 
        onClick={() => router.push('/admin/matches')}
        className="flex items-center gap-2 text-[#B8C0C2] hover:text-white transition-colors uppercase font-orbitron text-xs tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Match Control
      </button>

      <div className="bg-[#111518]/90 border border-white/10 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-rajdhani text-3xl font-bold text-white uppercase tracking-widest">
            Results Entry: <span className="text-[#FF6A00]">{match.matchName}</span>
          </h2>
          <p className="font-inter text-xs text-[#B8C0C2] mt-1">Status: {match.resultStatus || 'DRAFT'}</p>
        </div>
        <div className="flex gap-2">
          {(!match.resultStatus || match.resultStatus === 'DRAFT') && (
            <>
              <button onClick={saveDraft} className="flex items-center gap-2 bg-[#1A2023] border border-white/10 hover:border-[#FF6A00] text-white px-4 py-2 font-bold uppercase tracking-widest font-rajdhani transition-colors">
                <Save className="w-4 h-4" /> Save Draft
              </button>
              <button onClick={verifyResults} className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 font-bold uppercase tracking-widest font-rajdhani transition-colors">
                <CheckCircle className="w-4 h-4" /> Verify
              </button>
            </>
          )}
          {match.resultStatus === 'VERIFIED' && (
            <button onClick={publishResults} className="flex items-center gap-2 bg-[#39B54A] hover:bg-[#39B54A]/80 text-white px-6 py-2 font-bold uppercase tracking-widest font-rajdhani transition-colors">
              <Upload className="w-4 h-4" /> Publish Globally
            </button>
          )}
          {match.resultStatus === 'PUBLISHED' && (
            <div className="bg-[#39B54A]/20 text-[#39B54A] px-6 py-2 font-bold uppercase tracking-widest font-rajdhani border border-[#39B54A]/50">
              PUBLISHED
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#080A0C] border border-white/10 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#111518] border-b border-white/10 font-orbitron text-[10px] text-[#FF6A00] uppercase tracking-widest">
              <th className="p-4">Squad</th>
              <th className="p-4 w-24 text-center">Place</th>
              <th className="p-4 w-32 text-center">Place Pts</th>
              <th className="p-4 w-24 text-center">Kills</th>
              <th className="p-4 w-32 text-center">Kill Pts</th>
              <th className="p-4 w-32 text-center text-white">Total Pts</th>
            </tr>
          </thead>
          <tbody>
            {scores.map(score => {
              const team = teams.find(t => t._id === score.teamId);
              if (!team) return null;
              const isReadOnly = match.resultStatus === 'VERIFIED' || match.resultStatus === 'PUBLISHED';
              return (
                <tr key={score.teamId} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4 font-rajdhani font-bold text-white uppercase tracking-wider">{team.teamName}</td>
                  <td className="p-4">
                    <input type="number" disabled={isReadOnly} value={score.placement} onChange={(e) => handleScoreChange(score.teamId, 'placement', e.target.value)} className="w-full bg-[#111518] border border-white/10 px-2 py-1 text-center text-white disabled:opacity-50" />
                  </td>
                  <td className="p-4">
                    <input type="number" disabled={isReadOnly} value={score.placementPoints} onChange={(e) => handleScoreChange(score.teamId, 'placementPoints', e.target.value)} className="w-full bg-[#111518] border border-white/10 px-2 py-1 text-center text-[#39B54A] font-bold disabled:opacity-50" />
                  </td>
                  <td className="p-4">
                    <input type="number" disabled={isReadOnly} value={score.kills} onChange={(e) => handleScoreChange(score.teamId, 'kills', e.target.value)} className="w-full bg-[#111518] border border-white/10 px-2 py-1 text-center text-white disabled:opacity-50" />
                  </td>
                  <td className="p-4">
                    <input type="number" disabled={isReadOnly} value={score.killPoints} onChange={(e) => handleScoreChange(score.teamId, 'killPoints', e.target.value)} className="w-full bg-[#111518] border border-white/10 px-2 py-1 text-center text-red-400 font-bold disabled:opacity-50" />
                  </td>
                  <td className="p-4">
                    <input type="number" disabled value={score.totalPoints} className="w-full bg-transparent px-2 py-1 text-center text-[#FF6A00] font-bold font-rajdhani text-xl" />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
