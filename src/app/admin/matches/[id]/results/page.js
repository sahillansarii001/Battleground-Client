"use client";
import { useState, useEffect, Fragment } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save, ArrowLeft, ChevronDown, ChevronUp, Edit, X } from 'lucide-react';
import api from '@/lib/api';
import ActionModal from '@/components/admin/ActionModal';

export default function MatchResults() {
  const { id } = useParams();
  const router = useRouter();
  const [match, setMatch] = useState(null);
  const [teams, setTeams] = useState([]);
  const [scores, setScores] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedTeamId, setExpandedTeamId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [actionModal, setActionModal] = useState({ isOpen: false });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      // Fetch Match, Teams, Settings
      const [matchRes, teamsRes, settingsRes] = await Promise.all([
        api.get('/matches'),
        api.get('/admin/teams'),
        api.get('/admin/settings')
      ]);

      const foundMatch = matchRes.data.find(m => m._id === id);
      setMatch(foundMatch);
      setTeams(teamsRes.data.filter(t => t.status === 'APPROVED'));
      if (settingsRes.success && settingsRes.data) {
        setSettings(settingsRes.data.pointsSystem);
      }

      // Fetch existing scores if any
      const scoreRes = await api.get(`/matches/${id}/results`);
      if (scoreRes.success && scoreRes.data.length > 0) {
        // Map scores for easy editing
        const existingScores = scoreRes.data.map(s => ({
          teamId: s.teamId._id || s.teamId,
          placement: s.placement,
          placementPoints: s.placementPoints,
          kills: s.kills,
          killPoints: s.killPoints,
          totalPoints: s.totalPoints,
          playerScores: s.playerScores?.map(ps => ({
            playerId: ps.playerId?._id || ps.playerId,
            kills: ps.kills
          })) || []
        }));
        setScores(existingScores);
        setIsEditing(false);
      } else {
        // Init empty scores for all approved teams
        const initScores = teamsRes.data
          .filter(t => t.status === 'APPROVED')
          .map(t => ({
            teamId: t._id,
            placement: 0,
            placementPoints: 0,
            kills: 0,
            kills: 0,
            killPoints: 0,
            totalPoints: 0,
            playerScores: t.players?.map(p => ({ playerId: p._id, kills: 0 })) || []
          }));
        setScores(initScores);
        setIsEditing(true); // First time entering results — start in edit mode
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (teamId, field, value, extraData) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    setScores(prev => prev.map(s => {
      if (s.teamId === teamId) {
        const updated = { ...s, [field]: numValue };
        
        // Auto calculate points based on settings
        if (field === 'placement' && settings?.placementPoints) {
          updated.placementPoints = settings.placementPoints[String(numValue)] || 0;
        }
        if (field === 'kills' && settings?.perKill !== undefined) {
          updated.killPoints = numValue * settings.perKill;
        }
        
        updated.totalPoints = updated.placementPoints + updated.killPoints;
        
        if (extraData?.playerScores) {
          updated.playerScores = extraData.playerScores;
        }

        return updated;
      }
      return s;
    }));
  };

  const handlePlayerScoreChange = (teamId, playerId, kills) => {
    const numKills = Math.max(0, parseInt(kills) || 0);
    
    setScores(prev => {
      const scoreIndex = prev.findIndex(s => s.teamId === teamId);
      if (scoreIndex === -1) return prev;
      
      const teamScore = prev[scoreIndex];
      const updatedPlayerScores = [...(teamScore.playerScores || [])];
      
      const pIndex = updatedPlayerScores.findIndex(p => p.playerId === playerId);
      if (pIndex >= 0) {
        updatedPlayerScores[pIndex].kills = numKills;
      } else {
        updatedPlayerScores.push({ playerId, kills: numKills });
      }
      
      const totalKills = updatedPlayerScores.reduce((sum, p) => sum + p.kills, 0);
      
      // We need to call handleScoreChange logic here but since it uses setState, 
      // it's better to just inline the calculation for the team score
      
      const updatedTeamScore = { ...teamScore, kills: totalKills, playerScores: updatedPlayerScores };
      
      if (settings?.perKill !== undefined) {
        updatedTeamScore.killPoints = totalKills * settings.perKill;
      }
      updatedTeamScore.totalPoints = updatedTeamScore.placementPoints + updatedTeamScore.killPoints;
      
      const newScores = [...prev];
      newScores[scoreIndex] = updatedTeamScore;
      return newScores;
    });
  };

  const saveResults = async () => {
    try {
      // Save scores first
      await api.post(`/matches/${id}/results`, { scores });
      // Then verify + publish in one go
      await api.put(`/matches/${id}/results/verify`);
      await api.put(`/matches/${id}/results/publish`);
      setActionModal({ isOpen: true, isAlert: true, title: 'Success', message: 'Results saved & published to scoreboard!', confirmText: 'OK', onConfirm: () => setActionModal({ isOpen: false }) });
      setIsEditing(false);
      fetchData();
    } catch (error) {
      console.error(error);
      setActionModal({ isOpen: true, isAlert: true, title: 'Error', message: 'Failed to save results', confirmText: 'OK', onConfirm: () => setActionModal({ isOpen: false }) });
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
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button onClick={() => { setIsEditing(false); fetchData(); }} className="flex items-center gap-2 bg-[#1A2023] border border-white/10 hover:border-white/30 text-[#B8C0C2] hover:text-white px-5 py-2.5 font-bold uppercase tracking-widest font-rajdhani transition-colors">
                <X className="w-4 h-4" /> Cancel
              </button>
              <button onClick={saveResults} className="flex items-center gap-2 bg-[#FF6A00] hover:bg-[#FF6A00]/80 text-black px-5 py-2.5 font-bold uppercase tracking-widest font-rajdhani transition-colors">
                <Save className="w-4 h-4" /> Save
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-[#1A2023] border border-white/10 hover:border-[#FF6A00] text-white px-5 py-2.5 font-bold uppercase tracking-widest font-rajdhani transition-colors">
              <Edit className="w-4 h-4" /> Edit
            </button>
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
              const isReadOnly = !isEditing;
              const isExpanded = expandedTeamId === score.teamId;
              
              return (
                <Fragment key={score.teamId}>
                  <tr className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4">
                      <div 
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => setExpandedTeamId(isExpanded ? null : score.teamId)}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#FF6A00]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-white/50 group-hover:text-[#FF6A00]" />
                        )}
                        <span className="font-rajdhani font-bold text-white uppercase tracking-wider">{team.teamName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <input type="number" min="0" disabled={isReadOnly} value={score.placement} onChange={(e) => handleScoreChange(score.teamId, 'placement', e.target.value)} className="w-full bg-[#111518] border border-white/10 px-2 py-1 text-center text-white disabled:opacity-50" />
                    </td>
                    <td className="p-4">
                      <span className="block w-full px-2 py-1 text-center text-[#39B54A] font-bold">{score.placementPoints}</span>
                    </td>
                    <td className="p-4">
                      <input type="number" min="0" disabled={isReadOnly} value={score.kills} onChange={(e) => handleScoreChange(score.teamId, 'kills', e.target.value)} className="w-full bg-[#111518] border border-white/10 px-2 py-1 text-center text-white disabled:opacity-50" />
                    </td>
                    <td className="p-4">
                      <span className="block w-full px-2 py-1 text-center text-red-400 font-bold">{score.killPoints}</span>
                    </td>
                    <td className="p-4">
                      <span className="block w-full px-2 py-1 text-center text-[#FF6A00] font-bold font-rajdhani text-xl">{score.totalPoints}</span>
                    </td>
                  </tr>
                  
                  {isExpanded && (
                    <tr className="bg-[#1A2023]/50 border-b border-white/5">
                      <td colSpan="6" className="p-4">
                        <div className="flex flex-wrap gap-4 pl-8">
                          {team.players && team.players.length > 0 ? (
                            team.players.map(p => {
                              const pScore = score.playerScores?.find(ps => ps.playerId === p._id) || { kills: 0 };
                              return (
                                <div key={p._id} className="bg-[#080A0C] border border-white/10 p-2 flex items-center gap-3">
                                  <span className="text-white text-xs font-orbitron">{p.inGameName}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-[#B8C0C2] uppercase">Kills</span>
                                    <input 
                                      type="number" 
                                      min="0"
                                      disabled={isReadOnly} 
                                      value={pScore.kills} 
                                      onChange={(e) => handlePlayerScoreChange(score.teamId, p._id, e.target.value)} 
                                      className="w-16 bg-[#111518] border border-white/10 px-2 py-1 text-center text-white disabled:opacity-50 focus:border-[#FF6A00] outline-none" 
                                    />
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <span className="text-xs text-[#B8C0C2]">No players registered for this team.</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

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
