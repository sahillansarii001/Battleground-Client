"use client";
import { useState, useEffect } from 'react';
import { X, Save, Trash2, Key, Edit, Shield } from 'lucide-react';
import api from '@/lib/api';

export default function TeamModal({ isOpen, onClose, team, onSuccess }) {
  const [formData, setFormData] = useState({
    teamName: '',
    email: '',
    teamType: 'SQUAD',
    players: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (team) {
      setFormData({
        teamName: team.teamName || '',
        email: team.email || '',
        teamType: team.teamType || 'SQUAD',
        players: team.players || []
      });
    }
  }, [team]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlayerChange = (index, field, value) => {
    const newPlayers = [...formData.players];
    newPlayers[index] = { ...newPlayers[index], [field]: value };
    setFormData({ ...formData, players: newPlayers });
  };

  const addPlayer = () => {
    setFormData({
      ...formData,
      players: [...formData.players, { inGameName: '', playerName: '', bgmiId: '', role: 'ASSAULTER' }]
    });
  };

  const removePlayer = (index) => {
    const newPlayers = formData.players.filter((_, i) => i !== index);
    setFormData({ ...formData, players: newPlayers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.put(`/admin/teams/${team._id}`, formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#111518] border border-[#FF6A00]/50 w-full max-w-3xl max-h-[90vh] flex flex-col relative shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#FF6A00]"></div>
        
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#FF6A00]" />
            Intel / Edit Squad
          </h2>
          <button onClick={onClose} className="text-[#B8C0C2] hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 mb-6 text-sm font-orbitron uppercase tracking-widest">
              {error}
            </div>
          )}

          <form id="team-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-orbitron text-[10px] text-[#B8C0C2] uppercase tracking-widest mb-2">Squad Name</label>
                <input
                  type="text"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleChange}
                  className="w-full bg-[#080A0C] border border-white/10 text-white font-inter text-sm px-4 py-2 focus:border-[#FF6A00] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-orbitron text-[10px] text-[#B8C0C2] uppercase tracking-widest mb-2">Comms Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#080A0C] border border-white/10 text-white font-inter text-sm px-4 py-2 focus:border-[#FF6A00] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-orbitron text-[10px] text-[#B8C0C2] uppercase tracking-widest mb-2">Operation Type</label>
                <select
                  name="teamType"
                  value={formData.teamType}
                  onChange={handleChange}
                  className="w-full bg-[#080A0C] border border-white/10 text-white font-inter text-sm px-4 py-2 focus:border-[#FF6A00] focus:outline-none"
                >
                  <option value="SQUAD">SQUAD</option>
                  <option value="DUO">DUO</option>
                  <option value="SOLO">SOLO</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-widest">Operators</h3>
                <button type="button" onClick={addPlayer} className="text-[#FF6A00] hover:text-white font-orbitron text-[10px] uppercase tracking-widest flex items-center gap-1 border border-[#FF6A00]/30 px-3 py-1 bg-[#FF6A00]/10">
                  + Add Operator
                </button>
              </div>

              {formData.players.length === 0 ? (
                <p className="text-[#B8C0C2] text-sm text-center py-4">No operators registered.</p>
              ) : (
                <div className="space-y-4">
                  {formData.players.map((player, index) => (
                    <div key={index} className="bg-[#080A0C] border border-white/5 p-4 relative pr-10">
                      <button type="button" onClick={() => removePlayer(index)} className="absolute right-4 top-4 text-red-500 hover:text-white">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block font-orbitron text-[9px] text-[#B8C0C2] uppercase mb-1">IGN</label>
                          <input type="text" value={player.inGameName} onChange={(e) => handlePlayerChange(index, 'inGameName', e.target.value)} className="w-full bg-[#111518] border border-white/10 text-white text-xs px-2 py-1 focus:border-[#FF6A00]" />
                        </div>
                        <div>
                          <label className="block font-orbitron text-[9px] text-[#B8C0C2] uppercase mb-1">Legal Name</label>
                          <input type="text" value={player.playerName} onChange={(e) => handlePlayerChange(index, 'playerName', e.target.value)} className="w-full bg-[#111518] border border-white/10 text-white text-xs px-2 py-1 focus:border-[#FF6A00]" />
                        </div>
                        <div>
                          <label className="block font-orbitron text-[9px] text-[#B8C0C2] uppercase mb-1">BGMI ID</label>
                          <input type="text" value={player.bgmiId} onChange={(e) => handlePlayerChange(index, 'bgmiId', e.target.value)} className="w-full bg-[#111518] border border-white/10 text-white text-xs px-2 py-1 focus:border-[#FF6A00]" />
                        </div>
                        <div>
                          <label className="block font-orbitron text-[9px] text-[#B8C0C2] uppercase mb-1">Role</label>
                          <input type="text" value={player.role} onChange={(e) => handlePlayerChange(index, 'role', e.target.value)} className="w-full bg-[#111518] border border-white/10 text-white text-xs px-2 py-1 focus:border-[#FF6A00]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-white/10 flex justify-end gap-4 bg-[#080A0C]">
          <button type="button" onClick={onClose} className="px-6 py-2 text-[#B8C0C2] hover:text-white font-rajdhani font-bold uppercase tracking-widest transition-colors">
            Cancel
          </button>
          <button type="submit" form="team-form" disabled={loading} className="flex items-center gap-2 bg-[#FF6A00] hover:bg-white text-black font-rajdhani font-bold px-8 py-2 uppercase tracking-widest transition-colors transform skew-x-[-10deg] disabled:opacity-50">
            <span className="transform skew-x-10 flex items-center gap-2">
              <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Intel'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
