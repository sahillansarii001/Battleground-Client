"use client";
import { useState, useEffect } from 'react';
import { Search, Filter, Check, X, Eye, Edit, Trash2, Key } from 'lucide-react';
import api from '@/lib/api';
import TeamModal from '@/components/admin/TeamModal';

export default function AdminTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, PENDING, APPROVED, REJECTED
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await api.get('/admin/teams');
      if (res.success) {
        setTeams(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const approveTeam = async (id) => {
    try {
      if (!window.confirm("Approve this team? This will email them temporary credentials.")) return;
      await api.patch(`/admin/teams/${id}/approve`);
      alert("Team approved.");
      fetchTeams();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to approve");
    }
  };

  const rejectTeam = async (id) => {
    try {
      const reason = window.prompt("Reason for rejection:");
      if (!reason) return;
      await api.patch(`/admin/teams/${id}/reject`, { reason });
      alert("Team rejected.");
      fetchTeams();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to reject");
    }
  };

  const deleteTeam = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to completely delete this team and its user account? This cannot be undone.")) return;
      await api.delete(`/admin/teams/${id}`);
      fetchTeams();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to delete team");
    }
  };

  const changePassword = async (id) => {
    try {
      const newPassword = window.prompt("Enter new password for this team's user account:");
      if (!newPassword) return;
      
      await api.put(`/admin/teams/${id}/password`, { newPassword });
      alert("Password updated successfully.");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update password");
    }
  };

  const openEditModal = (team) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
  };

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.teamName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          team.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || team.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-[#111518]/90 border border-white/10 p-6">
        <div>
          <h2 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
            Squad Operations
          </h2>
          <p className="font-inter text-xs text-[#B8C0C2] mt-1">Review, approve, and manage team deployments.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8C0C2]" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="SEARCH SQUADS..." 
              className="w-full bg-[#080A0C] border border-white/10 text-white font-orbitron text-[10px] uppercase tracking-widest pl-10 pr-4 py-2 focus:outline-none focus:border-[#FF6A00]"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#080A0C] border border-white/10 p-2 text-[#B8C0C2] hover:text-[#FF6A00] transition-colors outline-none font-orbitron text-[10px] uppercase tracking-widest"
          >
            <option value="ALL">ALL STATUS</option>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>
      </div>

      {/* Teams Table */}
      <div className="bg-[#111518]/90 border border-white/10 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#080A0C] border-b border-white/10 font-orbitron text-[9px] text-[#FF6A00] uppercase tracking-widest">
              <th className="p-4">Squad Name</th>
              <th className="p-4">Comms Email</th>
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="font-inter text-sm text-white">
            {loading ? (
              <tr><td colSpan="5" className="p-10 text-center text-[#B8C0C2]">Loading squads...</td></tr>
            ) : filteredTeams.length === 0 ? (
              <tr><td colSpan="5" className="p-10 text-center text-[#B8C0C2]">No squads found.</td></tr>
            ) : filteredTeams.map(team => (
              <tr key={team._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 font-rajdhani font-bold text-lg uppercase tracking-wider">{team.teamName}</td>
                <td className="p-4 text-[#B8C0C2] text-xs">{team.email}</td>
                <td className="p-4">
                  <span className="bg-[#FF6A00]/10 border border-[#FF6A00]/30 text-[#FF6A00] font-orbitron text-[8px] px-2 py-1 uppercase">{team.teamType || 'SQUAD'}</span>
                </td>
                <td className="p-4">
                  {team.status === 'PENDING' && <span className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 font-orbitron text-[8px] px-2 py-1 uppercase">PENDING</span>}
                  {team.status === 'APPROVED' && <span className="bg-[#39B54A]/10 border border-[#39B54A]/30 text-[#39B54A] font-orbitron text-[8px] px-2 py-1 uppercase">APPROVED</span>}
                  {team.status === 'REJECTED' && <span className="bg-red-500/10 border border-red-500/30 text-red-500 font-orbitron text-[8px] px-2 py-1 uppercase">REJECTED</span>}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    {team.status === 'PENDING' && (
                      <>
                        <button onClick={() => approveTeam(team._id)} className="p-2 bg-[#39B54A]/10 text-[#39B54A] hover:bg-[#39B54A] hover:text-black border border-[#39B54A]/30 transition-colors" title="Approve">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => rejectTeam(team._id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/30 transition-colors" title="Reject">
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    
                    <button onClick={() => openEditModal(team)} className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white border border-blue-500/30 transition-colors" title="View/Edit Intel">
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    {team.status === 'APPROVED' && (
                      <button onClick={() => changePassword(team._id)} className="p-2 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black border border-yellow-500/30 transition-colors" title="Change Password">
                        <Key className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button onClick={() => deleteTeam(team._id)} className="p-2 bg-red-950/40 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/30 transition-colors" title="Delete Team">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TeamModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        team={selectedTeam} 
        onSuccess={() => {
          setIsModalOpen(false);
          fetchTeams();
        }} 
      />
    </div>
  );
}
